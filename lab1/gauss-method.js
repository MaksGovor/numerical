'use strict';

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

const fns = {};

fns.mod = Math.abs;

fns.maxItem = (matrix) => {
  const res = { iN: 0, jN: 0, num: 0 };

  for (let i = 0; i < matrix.length; i++) {
    const max = matrix[i].reduce((a, b) =>
      (fns.mod(a) > fns.mod(b) ? a : b));

    if (max > res.num) {
      res.num = max;
      res.iN = i;
    }
  }

  res.jN = matrix[res.iN].indexOf(res.num);

  return res;
};

fns.matrixCopy = (matrix) => {
  const mat = matrix.slice();
  for (let i = 0; i < matrix.length; i++) {
    mat[i] = mat[i].slice();
  }

  return mat;
};

fns.swapRows = (matrix, row1, row2) => {
  if (row1 === row2) return;
  const copyRow1 = matrix[row1];
  matrix[row1] = matrix[row2];
  matrix[row2] = copyRow1;
};

fns.swapCols = (matrix, col1, col2) => {
  if (col1 === col2) return;
  for (let i = 0; i < matrix.length; i++) {
    const copyItem = matrix[i][col1];
    matrix[i][col1] = matrix[i][col2];
    matrix[i][col2] = copyItem;
  }
};

const gauss = (matrix, vector) => {
  const mat = fns.matrixCopy(matrix);
  const length = mat.length;
  const continues = [];

  for (let q = 0; q < length; q++) {
    let { iN, jN, num } = fns.maxItem(mat);
    fns.swapRows(mat, iN, q);
    console.log({ iN, jN, q });
    fns.swapCols(mat, jN, q);
    iN = q;
    const mainLine = mat[iN];
    continues.push(iN);

    for (let i = 0; i < length; i++) {
      mainLine[i] = mainLine[i] / num;
    }

    for (let i = 0; i < length; i++) {
      if (continues.includes(i)) continue;
      const koff = mat[i][q];
      const copyML = mainLine.slice().map((x) => x * koff);
      for (let j = q; j < length; j++) {
        mat[i][j] = mat[i][j] - copyML[j];
      }
    }
  console.log(mat);

  }

};

gauss(matrixA);
