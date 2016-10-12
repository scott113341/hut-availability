import fs from 'fs';
import moment from 'moment';
import path from 'path';
import test from 'tape';

import { urlFor, urlsFor, availabilityFromHtml, combineAvailabilities } from '../get-availability.js';

const DATES = [ moment('2016-12-01'), moment('2016-12-11') ];
const DATES_1_DAY = [ moment('2016-12-01'), moment('2016-12-01') ];
const DATES_2_DAYS = [ moment('2016-12-01'), moment('2016-12-01') ];
const DATES_3_DAYS = [ moment('2016-12-01'), moment('2016-12-03') ];
const DATES_7_DAYS = [ moment('2016-12-01'), moment('2016-12-07') ];
const DATES_8_DAYS = [ moment('2016-12-01'), moment('2016-12-08') ];

test('urlFor', t => {
  t.equal(urlFor(DATES[0]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016');
  t.equal(urlFor(DATES[1]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/11/2016');
  t.end();
});

test('urlsFor', t => {
  [DATES, DATES_8_DAYS].map(dates => {
    t.deepEqual(urlsFor(...dates), [
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016',
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/8/2016'
    ]);
  });
  [DATES_1_DAY, DATES_2_DAYS, DATES_3_DAYS, DATES_7_DAYS].map(dates => {
    t.deepEqual(urlsFor(...dates), [
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016'
    ]);
  });
  t.end();
});

test('availabilityFromHtml', t => {
  const html = fs.readFileSync(path.join(__dirname, 'fixtures', '2016-12-01.html'));
  const huts = availabilityFromHtml(html);
  const hut = huts[0];

  t.equal(huts.length, 29);
  t.equal(hut.name, "Fritz's");
  t.deepEqual(hut.availability, [10, 10, 0, 10, 10, 10, 10]);
  t.end();
});

test('combineAvailabilities', t => {
  const htmls = ['2016-12-01.html', '2016-12-08.html']
    .map(file => fs.readFileSync(path.join(__dirname, 'fixtures', file)));
  const avails = htmls.map(availabilityFromHtml);
  const combined = combineAvailabilities(avails, ...DATES);
  const hut = combined[0];

  t.equal(hut.name, "Fritz's");
  t.deepEqual(hut.availability, [10, 10, 0, 10, 10, 10, 10, 10, 10, 0, 0]);
  t.equal(hut.capacity, 10);
  t.end();
});
