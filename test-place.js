'use strict';

const gauss = require('gaussian-elimination');

const arr = [
  [1, 2, -1, 9],
  [2, -1, 3, 13],
  [3, 2, -5, -1]
];

const res = gauss(arr);

console.log(res);