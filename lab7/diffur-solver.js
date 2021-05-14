'use strict';

const yD = require('./function');

const rungeKuttmethod = (yD, interval, step, y0) => {
  const [ x0, right ] = interval;
  const result = [ [x0, y0] ];

  for (let xi = x0; xi <= right; x += step) {
    
  }
}