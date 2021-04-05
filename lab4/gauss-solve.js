'use strict';

const gauss = (matrix) => {
  const swapRow = (matrix, i0) => {
    for (let i = i0; i < matrix.length; i++) {
      if (matrix[i][i0] === 0) continue;
      const tempRow = matrix[i0];
      matrix[i0] = matrix[i];
      matrix[i] = tempRow;
      return matrix[i0];
    }
  };

  const straightRun = (matrix, i0) => {
    const row0 = matrix[i0];
    for (let i = i0 + 1; i < matrix.length; i++) {
      const row = matrix[i];
      if (row[i0] === 0) continue;
      const mul = row[i0] / row0[i0];
      for (let j = i0 + 1; j < row0.length; j++) { row[j] -= row0[j] * mul; }
      row[i0] = 0;
    }
  };

  const reverseRun = (matrix, i0) => {
    const row0 = matrix[i0];
    for (let i = i0 - 1; i >= 0; i--) {
      const row = matrix[i];
      if (row[i0] === 0) continue;
      const mul = row[i0] / row0[i0];
      for (let j = i0 + 1; j < row0.length; j++) { row[j] -= row0[j] * mul; }
      row[i0] = 0;
    }
  };

  matrix = matrix.slice();
  for (let i = 0; i < matrix.length; i++) matrix[i] = matrix[i].slice();

  for (let i = 0; i < matrix.length - 1; i++) {
    swapRow(matrix, i);
    straightRun(matrix, i);
  }
  const res = new Array(matrix.length);
  for (let i = matrix.length - 1; i > 0; i--) {
    reverseRun(matrix, i);
  }
  for (let i = 0; i < res.length; i++) {
    res[i] = matrix[i][matrix[i].length - 1] / matrix[i][i];
  }
  return res;
};

module.exports = gauss;
