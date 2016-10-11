const moment = require('moment');

const filters = require('./lib/filters.js');
const getAvailability = require('./lib/get-availability.js').default;

const nights = 2;
const startDate = moment('2016-12-16');
const endDate = moment('2017-01-17');
const onlyWeekends = false;
const huts = [
  "McNamara Hut",
  "Margy's Hut",
  "Harry Gates Hut",
  "Peter Estin Hut",
  "Polar Star Inn",
  "Fowler-Hilliard Hut",
  "Jackal Hut",
  "Vance's Cabin",
  "Sangree M. Froelicher Hut",
  "10th Mountain Div. Hut",
  "Uncle Bud's Hut",
  "Betty Bear Hut",
  "Francie's Cabin",
  "Janet's Cabin"
];
const excludeDates = [
  moment('2016-12-24'),
  moment('2016-12-25'),
  moment('2016-12-26')
];

/*
 * start & end dates
 * number of nights
 * name of hut
 * filter days of week (whitelist, require, blacklist)
 */

getAvailability(startDate, endDate)
  .then(avail => avail.filter(a => huts.length ? huts.includes(a.name) : true))
  .then(avail => {
    avail.forEach(hut => {
      let first = true;
      hut.availability.forEach((n, i) => {
        const na = hut.availability.slice(i, i + nights);
        const start = startDate.clone().add(i + 1, 'd');
        const end = startDate.clone().add(i + nights, 'd');
        const weekends = [0, 6];

        const ok = Math.min(...na) === hut.capacity;
        const weekend = weekends.includes(start.day()) && weekends.includes(end.day()) || !onlyWeekends;
        const datesOk = !excludeDates.some(d => start.isSame(d) || end.isSame(d));

        if (ok && weekend && datesOk) {
          if (first) {
            console.log(hut.name);
            first = false;
          }
          const start = startDate.clone().add(i + 1, 'd').format('YYYY-M-D');
          const end = startDate.clone().add(i + nights, 'd').format('YYYY-M-D');
          console.log(`${start} to ${end}`);
        }
      });
    });
  })
  .catch(e => console.log(e));
