'use strict';

const fns = require('./fns');
const logger = require('./logger');
const  {matrixA, vectorB } = require('./task.json');

const matrix = [
  [1, 2, 0, 6],
  [56, 12, 1, 65],
  [12, 43, 0, 23],
  [5, 0, 6, 1]
];

const vector = [
  1,
  76,
  5,
  3
]

const gauss = (matrix, vector) => {
  const mat = fns.matrixCopy(matrix);
  const vec = vector.slice();
  const length = mat.length;
  const matP = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]
  const continues = [];

  for (let q = 0; q < length; q++) {
    let { iN, jN, num } = fns.maxItem(mat, q);
    console.log({ iN, jN, q, num });
    fns.swapRows(mat, iN, q);
    fns.swapRows(vec, iN, q);
    fns.swapRows(matP, jN, q);
    fns.swapCols(mat, jN, q);
    iN = q;
    const mainLine = mat[iN];
    continues.push(iN);

    vec[iN] = vec[iN] / num;
    for (let i = 0; i < length; i++) {
      mainLine[i] = mainLine[i] / num;
    }

    for (let i = q; i < length; i++) {
      if (continues.includes(i)) continue;
      const koff = mat[i][q];
      const copyML = mainLine.slice().map((x) => x * koff);
      vec[i] = vec[i] - vec[iN] * koff;

      for (let j = q; j < length; j++) {
        mat[i][j] = mat[i][j] - copyML[j];
      }
    }
  console.log('/');
  console.log(mat[0]);
  console.log(mat[1]);
  console.log(mat[2]);
  console.log(mat[3]);
  console.log('\\');
  console.log(vec);
  }

  const last = length - 1;

  const result = new Array(last);
  result.push(vec[last]);
  
  console.log('----------------------Reverse-----------------------------');

  for (let i = last - 1; i >= 0 ; i--) {
    let sum = 0;
    for (let j = i + 1; j <= last; j++) {
      sum += mat[i][j] * result[j];
      console.dir({i, j, element: mat[i][j]});
    }
    result[i] = vec[i] - sum;
  }

  const out = fns.multipyMatrix(matP, result.map(x => [x]));
  console.log(out);
};

console.log(matrix);
gauss(matrix, vector);
