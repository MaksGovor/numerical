'use strict';

const gauss = require('gaussian-elimination');

const arr = [
  [0, 2, -1, 9],
  [2, 0, 3, 13],
  [3, 2, 0, -1]
];

const jacobiOptimized = (matrix, vector, eps) => {
  const { matR, vecR } = bringMatrix(matrix, vector);
  const len = matR.length;
  let res = fns.matrixCopy(vecR);
  logger.matrixLog(matR);

  for (let k = 0; ; k++) {
    const resN = [];
    for (let i = 0; i < len; i++) {
      resN[i] = [];
      let t = 0;
      for (let j = 0; j < len; j++) {
        t += matR[i][j] * res[j][0];
      }
      resN[i][0] = t + vecR[i][0];
    }

    if (k % 15 === 0) {
      logger.matrixLog(res, `${k} iteration`);
    }

    const errs = fns.subByModVector(resN, res);
    if (errs.every(([x]) => x < eps)) {
      logger.log(`End in ${k} iteration`);
      break;
    }

    res = resN;
  }

  res = res.map(([x]) => [roundTo6(x)]);
  return res;
};

const res = gauss(arr);

console.log(res);