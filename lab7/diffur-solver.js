'use strict';

const yD = require('./function');
const { interval, y0, ORDER_ADAMS } = require('./task.json');
const eps = 10 ** (-1);

const roundPlus = (accuracy, num) => {
  if (isNaN(num) || isNaN(accuracy)) return false;
  const p = Math.pow(10, accuracy);
  const mantisa = Math.round(num * p);
  return mantisa / p;
};

const rungeKuttMethod = (yD, interval, step, y0, points) => {
  const [ x0, right ] = interval;
  const result = [ [x0, y0] ];
  let stepH = step;

  let yi = y0, count = 1;
  for (let xi = x0; xi <= right - stepH;) {
    const k1 = stepH * yD(xi, yi);
    const k2 = stepH * yD(xi + stepH / 2, yi + k1 / 2);
    const k3 = stepH * yD(xi + stepH / 2, yi + k2 / 2);
    const k4 = stepH * yD(xi + stepH, yi + k3);

    const deltaY = (k1 + 2 * (k2 + k3) + k4) / 6;
    // console.table({ k1, k2, k3, k4, deltaY });
    xi += stepH, yi += deltaY;
    result.push([ roundPlus(6, xi), yi ]);

    if (Math.abs((k2 - k3) / (k1 - k2)) > eps) stepH /= 2;
    
    count++;
    if (points && count === points) break;
  }

  return result;
};

const adamsMethod = (yD, interval, step, y0) => {
  const result = rungeKuttMethod(yD, interval, step, y0, ORDER_ADAMS);
  const [ x0, right ] = interval;
  let stepH = step;

  for (let i = ORDER_ADAMS - 1; i < (right - x0) / step; i++) {
    const [xi, yi] = result[i];
    const [xi1, yi1] = result[i - 1];
    const [xi2, yi2] = result[i - 2];
    const [xi3, yi3] = result[i - 3];

    const yD0 = yD(xi, yi), yD1 = yD(xi1, yi1), yD2 = yD(xi2, yi2);
    const yExtra = yi + step * (55 * yD0 - 59 * yD1 + 37 * yD2 - 9 * yD(xi3, yi3)) / 24;

    const xp1 = roundPlus(6, xi + stepH);
    const yInter = yi + step * (9 * yD(xp1, yExtra) + 19 * yD0 - 5 * yD1 + yD2) / 24;

    const yPush = yExtra !== yInter ? yInter : yExtra;
    if (Math.abs(yInter - yExtra) > eps) stepH /= 2;
    result.push([ xp1, yPush ]);
  }
  
  return result;
}

const f = (x, y) => 0.25 * (y**2) + x ** 2;

const resRK = rungeKuttMethod(f, [0, 1], 0.1, -1);

console.table(resRK);

// adamsMethod(f, [0, 1], 0.1, -1);