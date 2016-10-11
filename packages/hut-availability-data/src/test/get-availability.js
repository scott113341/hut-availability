import fs from 'fs';
import moment from 'moment';
import path from 'path';
import test from 'tape';

import getAvailability, * as util from '../get-availability.js';

const DATES =        [ moment('2016-12-01'), moment('2016-12-11') ];
const DATES_1_DAY =  [ moment('2016-12-01'), moment('2016-12-01') ];
const DATES_2_DAYS = [ moment('2016-12-01'), moment('2016-12-01') ];
const DATES_3_DAYS = [ moment('2016-12-01'), moment('2016-12-03') ];
const DATES_7_DAYS = [ moment('2016-12-01'), moment('2016-12-07') ];
const DATES_8_DAYS = [ moment('2016-12-01'), moment('2016-12-08') ];

test('urlFor', t => {
  t.equal(util.urlFor(DATES[0]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016');
  t.equal(util.urlFor(DATES[1]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/11/2016');
  t.end();
});

test('urlsFor', t => {
  [DATES, DATES_8_DAYS].map(dates => {
    t.deepEqual(util.urlsFor(...dates), [
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016',
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/8/2016',
    ]);
  });
  [DATES_1_DAY, DATES_2_DAYS, DATES_3_DAYS, DATES_7_DAYS].map(dates => {
    t.deepEqual(util.urlsFor(...dates), [
      'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016'
    ]);
  });
  t.end();
});

test('availabilityFromHtml', t => {
  const html = fs.readFileSync(path.join(__dirname, 'fixtures', '2016-12-01.html'));
  const huts = util.availabilityFromHtml(html);
  const hut = huts[0];

  t.equal(huts.length, 29);
  t.equal(hut.name, "Fritz's");
  t.deepEqual(hut.availability, [10, 10, 0, 10, 10, 10, 10]);
  t.end();
});

/*
test('yolo', t => {
  getAvailability(...DATES).then(a => {
    t.end();
  });
});
*/
