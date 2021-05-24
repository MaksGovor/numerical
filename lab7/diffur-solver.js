'use strict';

const yD = require('./function');
const { roundPlus } = require('./fns');
const logger = require('./logger');
const { interval, y0, h, ORDER_ADAMS } = require('./task.json');
const eps = 10 ** (-1);

const rungeKuttMethod = (yD, interval, step, y0, points) => {
  const [ x0, right ] = interval;
  const result = [ [x0, y0] ];
  const xArr = [];
  let stepH = step;

  for (let i = x0; i <= right; i = roundPlus(6, i + step)) xArr.push(i);

  let yi = y0, count = 1;
  for (let xi = x0; xi <= roundPlus(6, right - stepH);) {
    const k1 = stepH * yD(xi, yi);
    const k2 = stepH * yD(xi + stepH / 2, yi + k1 / 2);
    const k3 = stepH * yD(xi + stepH / 2, yi + k2 / 2);
    const k4 = stepH * yD(xi + stepH, yi + k3);

    const deltaY = (k1 + 2 * (k2 + k3) + k4) / 6;
    // console.table({ k1, k2, k3, k4, deltaY });
    xi = roundPlus(6, xi + stepH) , yi += deltaY;
    result.push([ xi, yi ]);

    if (Math.abs((k2 - k3) / (k1 - k2)) > eps) stepH /= 2;
    
    count++;
    if (points && count === points) break;
  }

  const retResult = stepH === step ? result :
    result.filter(([ x ]) => xArr.includes(x));
  return retResult;
};

const adamsMethod = (yD, interval, step, y0) => {
  const result = rungeKuttMethod(yD, interval, step, y0, ORDER_ADAMS);
  const [ x0, right ] = interval;
  const xArr = [];
  let stepH = step;

  for (let i = x0; i <= right; i = roundPlus(6, i + step)) xArr.push(i);

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
  
  const retResult = stepH === step ? result :
    result.filter(([ x ]) => xArr.includes(x));
  return retResult;
}

const epsilonErr = (valH, valHd2, step) => {
  const xArr = [];
  const len = valH.length;
  const result = valH.map(arr => arr.slice());
  for (let i = valH[0][0]; i <= valH[len -1][0]; i = roundPlus(6, i + step)) xArr.push(i);
  const valHd2filtered = valHd2.filter(([ x ]) => xArr.includes(x));

  for (let i = 0; i < len; i++) {
    const eps = (valH[i][1] - valHd2filtered[i][1]) / 15;
    result[i]['ε(xᵢ)'] = (eps);
  }
 
  return result;
}

const resRK1 = rungeKuttMethod(yD, interval, h, y0);
const resRK2 = rungeKuttMethod(yD, interval, h / 2, y0);
const resRK = epsilonErr(resRK1, resRK2, 0.1);

const resA1 =  adamsMethod(yD, interval, h, y0);
const resA2 =  adamsMethod(yD, interval, h / 2, y0);
const resA = epsilonErr(resA1, resA2, 0.1);

logger.log('', logger.white, ' ');
logger.matrixLog(resRK, 'Result by Runge-Kutt method');
logger.matrixLog(resA, 'Result by Adams method');
