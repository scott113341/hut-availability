export function filter (huts, ...filters) {

}

export function huts (...hutNames) {
  return hut => hutNames.includes(hut.name);
}

export function nights (min, max = min) {
  return () => {

  }
}

export function daysOfWeek(...days) {

}
