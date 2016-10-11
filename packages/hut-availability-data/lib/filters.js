"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;
exports.huts = huts;
exports.nights = nights;
exports.daysOfWeek = daysOfWeek;
function filter(huts) {}

function huts() {
  for (var _len = arguments.length, hutNames = Array(_len), _key = 0; _key < _len; _key++) {
    hutNames[_key] = arguments[_key];
  }

  return function (hut) {
    return hutNames.includes(hut.name);
  };
}

function nights(min) {
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : min;

  return function () {};
}

function daysOfWeek() {}