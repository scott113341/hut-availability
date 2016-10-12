'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlFor = urlFor;
exports.urlsFor = urlsFor;
exports.availabilityFromHtml = availabilityFromHtml;
exports.combineAvailabilities = combineAvailabilities;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(function* (startDate, endDate) {
    var urls = urlsFor(startDate, endDate);
    var responses = yield Promise.all(urls.map(function (url) {
      return _superagent2.default.get(url);
    }));
    var avails = responses.map(function (res) {
      return availabilityFromHtml(res.text);
    });
    return combineAvailabilities(avails, startDate, endDate);
  });

  function getAvailability(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return getAvailability;
}();

function urlFor(startDate) {
  return 'http://www.huts.org/getPage.php?page=oShowHutAvail.asp&thisWeek=' + startDate.format('l');
}

function urlsFor(startDate, endDate) {
  var urls = [];
  var start = (0, _moment2.default)(startDate);

  while (start.isSameOrBefore(endDate)) {
    urls.push(urlFor(start));
    start.add(1, 'w');
  }

  return urls;
}

function availabilityFromHtml(html) {
  var badRows = [0, 1, 27];
  var $ = _cheerio2.default.load(html);
  var rows = $('tr').filter(function (i) {
    return badRows.indexOf(i) === -1;
  }).map(function (i, row) {
    var availability = $(row).find('td').slice(1, 8).map(function (i, td) {
      return $(td).text();
    }).get().map(function (n) {
      return n === 'none' ? 0 : n;
    }).map(function (n) {
      return parseInt(n, 10);
    });

    var name = $(row).find('td').eq(0).text().replace(/^\s-/, '').replace(/^Benedict Huts - /, '');

    return {
      name: name,
      availability: availability
    };
  });

  return rows.get();
}

function combineAvailabilities(avails, startDate, endDate) {
  var avail = [];
  var days = endDate.diff(startDate, 'days');
  avails[0].forEach(function (hut, i) {
    var otherAvails = avails.slice(1).map(function (a) {
      return a[i].availability;
    });
    var availability = hut.availability.concat(otherAvails.reduce(function (a, c) {
      return a.concat(c);
    }, [])).slice(0, days + 1);

    avail.push({
      name: hut.name,
      availability: availability,
      capacity: Math.max.apply(Math, _toConsumableArray(availability))
    });
  });

  return avail;
}