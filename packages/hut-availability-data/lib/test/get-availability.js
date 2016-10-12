'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _getAvailability = require('../get-availability.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DATES = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-11')];
var DATES_1_DAY = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-01')];
var DATES_2_DAYS = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-01')];
var DATES_3_DAYS = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-03')];
var DATES_7_DAYS = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-07')];
var DATES_8_DAYS = [(0, _moment2.default)('2016-12-01'), (0, _moment2.default)('2016-12-08')];

(0, _tape2.default)('urlFor', function (t) {
  t.equal((0, _getAvailability.urlFor)(DATES[0]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016');
  t.equal((0, _getAvailability.urlFor)(DATES[1]), 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/11/2016');
  t.end();
});

(0, _tape2.default)('urlsFor', function (t) {
  [DATES, DATES_8_DAYS].map(function (dates) {
    t.deepEqual(_getAvailability.urlsFor.apply(undefined, _toConsumableArray(dates)), ['http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016', 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/8/2016']);
  });
  [DATES_1_DAY, DATES_2_DAYS, DATES_3_DAYS, DATES_7_DAYS].map(function (dates) {
    t.deepEqual(_getAvailability.urlsFor.apply(undefined, _toConsumableArray(dates)), ['http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=12/1/2016']);
  });
  t.end();
});

(0, _tape2.default)('availabilityFromHtml', function (t) {
  var html = _fs2.default.readFileSync(_path2.default.join(__dirname, 'fixtures', '2016-12-01.html'));
  var huts = (0, _getAvailability.availabilityFromHtml)(html);
  var hut = huts[0];

  t.equal(huts.length, 29);
  t.equal(hut.name, "Fritz's");
  t.deepEqual(hut.availability, [10, 10, 0, 10, 10, 10, 10]);
  t.end();
});

(0, _tape2.default)('combineAvailabilities', function (t) {
  var htmls = ['2016-12-01.html', '2016-12-08.html'].map(function (file) {
    return _fs2.default.readFileSync(_path2.default.join(__dirname, 'fixtures', file));
  });
  var avails = htmls.map(_getAvailability.availabilityFromHtml);
  var combined = _getAvailability.combineAvailabilities.apply(undefined, [avails].concat(DATES));
  var hut = combined[0];

  t.equal(hut.name, "Fritz's");
  t.deepEqual(hut.availability, [10, 10, 0, 10, 10, 10, 10, 10, 10, 0, 0]);
  t.equal(hut.capacity, 10);
  t.end();
});