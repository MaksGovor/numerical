'use strict';

const gauss = require('gaussian-elimination');

const arr = [
  [0, 2, -1, 9],
  [2, 0, 3, 13],
  [3, 2, 0, -1]
];

const res = gauss(arr);

console.log(res);