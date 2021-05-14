'use strict';

const yD = require('./function');

const roundPlus = (accuracy, num) => {
  if (isNaN(num) || isNaN(accuracy)) return false;
  const p = Math.pow(10, accuracy);
  const mantisa = Math.round(num * p);
  return mantisa / p;
};

const rungeKuttmethod = (yD, interval, step, y0) => {
  const [ x0, right ] = interval;
  const result = [ [x0, y0] ];
  let stepH = step;

  let yi = y0;
  for (let xi = x0; xi <= right - stepH; xi += stepH) {
    const k1 = stepH * yD(xi, yi);
    const k2 = stepH * yD(xi + stepH / 2, yi + k1 / 2);
    const k3 = stepH * yD(xi + stepH / 2, yi + k2 / 2);
    const k4 = stepH * yD(xi + stepH, yi + k3);

    const deltaY = (k1 + 2 * (k2 + k3) + k4) / 6;
    yi += deltaY;
    result.push([ roundPlus(6, xi + stepH), yi ]);
  }

  return result;
};

const f = (x, y) => 0.25 * (y**2) + x ** 2;

const resRK = rungeKuttmethod(f, [0, 1], 0.1, -1);

console.table(resRK);