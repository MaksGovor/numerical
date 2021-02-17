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
  const res = { i: 0, j: 0, koff: 0 };

  for (let i = 0; i < matrix.length; i++) {
    const max = matrix[i].reduce((a, b) => 
    fns.mod(a) > fns.mod(b) ? a : b);
    
    if (max > res.koff) {
      res.koff = max;
      res.j = i;
    };
  }

  res.i = matrix[res.j].indexOf(res.koff);
  
  return res;
};

const gauss = (matrix, vector) => {
  const length = matrix.length;
  console.log(length);


  for (let i = 0; i < length; i++) {

  }
};


console.log(fns.maxItem(matrixA));
gauss(matrixA);
