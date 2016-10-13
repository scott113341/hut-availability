const moment = require('moment');

const getAvailability = require('./lib/get-availability.js').default;

swag(moment('2016-12-16'), moment('2017-01-17'), 2, {
  excludeDates: [
    moment('2016-12-24'),
    moment('2016-12-25'),
    moment('2016-12-26'),
  ],
  // huts: [
  //   'McNamara Hut',
  //   "Margy's Hut",
  //   'Harry Gates Hut',
  //   'Peter Estin Hut',
  //   'Polar Star Inn',
  //   'Fowler-Hilliard Hut',
  //   'Jackal Hut',
  //   "Vance's Cabin",
  //   'Sangree M. Froelicher Hut',
  //   '10th Mountain Div. Hut',
  //   "Uncle Bud's Hut",
  //   'Betty Bear Hut',
  //   "Francie's Cabin",
  //   "Janet's Cabin",
  // ],
  onlyDays: [0, 1, 5, 6],
});

function swag (startDate, endDate, nights, { huts = [], excludeDates = [], onlyDays = [] }) {
  return;
  return getAvailability(startDate, endDate)
    .then(avail => avail.filter(a => huts.length ? huts.includes(a.name) : true))
    .then(avail => {
      avail.forEach(hut => {
        let first = true;
        hut.availability.forEach((n, i) => {
          const na = hut.availability.slice(i, i + nights);
          const start = startDate.clone().add(i, 'd');
          const end = startDate.clone().add(i + nights - 1, 'd');

          const ok = Math.min(...na) === hut.capacity;
          const longEnough = na.length === nights;
          const daysOk = onlyDays.length ? onlyDays.includes(start.day()) && onlyDays.includes(end.day()) : true;
          const datesOk = excludeDates.length ? !excludeDates.some(d => start.isSame(d) || end.isSame(d)) : true;

          if (ok && longEnough && daysOk && datesOk) {
            if (first) {
              console.log(`${hut.name} (capacity ${hut.capacity})`);
              first = false;
            }
            console.log(`  ${start.format('M-D')} to ${end.clone().add(1, 'd').format('M-D')}`);
          }
        });
      });
    })
    .catch(e => console.log(e));
}
