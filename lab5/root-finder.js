'use strict';

const { rootBorders } = require('./task.json');
const { polynom, polynomD1, polynomD2 } = require('./polynom');
const fns = require('./fns')
const eps = Math.pow(10, -3);


// Bisection method

const bisectionMethod = (rootBorder, polynom, eps) => {
  let [ leftP, rigthP ] = rootBorder;
  if (polynom(leftP) * polynom(rigthP) > 0) return;

  for (let i = 0; ; i++) {
    const x = (leftP + rigthP) / 2;
    const value = polynom(x);
    if (value === 0) return x;

    if (value * polynom(leftP) > 0) leftP = x;
    else rigthP = x;

    if (fns.mod(rigthP - leftP) < eps) return x;
  }
}

const res = bisectionMethod(rootBorders[0], polynom, eps);
console.log(res);

// Chord method 