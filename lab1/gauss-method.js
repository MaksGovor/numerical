'use strict';

const alpha = 3;

const matrixA = [
  [ 3.81, 0.25, 1.28, 3.75 ],
  [ 2.25, 1.32, 7.58, 0.49 ],
  [ 5.31, 9.28, 0.98, 1.04 ],
  [ 12.39, 2.45, 3.35, 2.28 ],
];

const vectorB = [
  4.21,
  9.47,
  2.38,
  13.48,
];

const gauss = (matrix, vector) => {
  const length = matrix.length;
  console.log(length);
}

gauss(matrixA);