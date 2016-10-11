import cheerio from 'cheerio';
import moment from 'moment';
import request from 'superagent';

export default async function getAvailability (startDate, endDate) {
  const urls = urlsFor(startDate, endDate);
  const responses = await Promise.all(urls.map(url => request.get(url)));
  const avails = responses.map(res => availabilityFromHtml(res.text));

  const avail = [];
  const days = endDate.diff(startDate, 'days');
  avails[0].forEach((hut, i) => {
    const otherAvails = avails.slice(1).map(a => a[i].availability);
    const availability = hut.availability
      .concat(otherAvails.reduce((a, c) => a.concat(c), []))
      .slice(0, days - 1);

    avail.push({
      name: hut.name,
      availability: availability,
      capacity: Math.max(...availability)
    });
  });

  return avail;
}

export function availabilityFromHtml (html) {
  const badRows = [0, 1, 27];
  const $ = cheerio.load(html);
  const rows = $('tr')
    .filter(i => !badRows.includes(i))
    .map((i, row) => {
      const availability = $(row)
        .find('td')
        .slice(1, 8)
        .map((i, td) => $(td).text()).get()
        .map(n => n === 'none' ? 0 : n)
        .map(n => parseInt(n, 10));

      const name = $(row).find('td').eq(0).text()
        .replace(/^\s-/, '')
        .replace(/^Benedict Huts - /, '');

      return {
        name,
        availability
      };
    });

  return rows.get();
}

export function urlFor (startDate) {
  return `http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=${startDate.format('l')}`;
}

export function urlsFor (startDate, endDate) {
  const urls = [];
  const start = moment(startDate);

  while (start.isSameOrBefore(endDate)) {
    urls.push(urlFor(start));
    start.add(1, 'w');
  }

  return urls;
}
