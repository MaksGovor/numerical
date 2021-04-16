'use strict';

const { rootBorders } = require('./task.json');
const polynom = require('./polynom');
const fns = require('./fns')
const eps = Math.pow(10, -6);


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

    if (fns.mod(rigthP - leftP) < eps){
      console.log(i);
      return x;
    }
  }
}

// const res = bisectionMethod(rootBorders[0], polynom, eps);
// console.log(res);

// Chord method 

const chordMethod = (rootBorder, polynom, eps) => {
  const [ leftP, rigthP ] = rootBorder;
  const intervalPoint = (leftP + rigthP) / 2;
  const derivativeMul = polynom.d1(intervalPoint) * polynom.d2(intervalPoint);
  const permanentPoint = derivativeMul < 0 ? leftP : rigthP;
  let variablePoint = derivativeMul < 0 ? rigthP : leftP;

  for (let i = 0; ; i++) {
    const variableValue = polynom(variablePoint);
    const valuesDiff = variableValue - polynom(permanentPoint);
    const argsDiff = variablePoint - permanentPoint;
    const nextPoint = variablePoint - (variableValue * argsDiff) / valuesDiff;

    if (fns.mod(nextPoint - variablePoint) < eps) {
      console.log(i);
      return nextPoint;
    } 
    variablePoint = nextPoint;
  }
}

// const res = chordMethod(rootBorders[0], polynom, eps);
// console.log(res);

// Tangent method

const tangentMethod = (rootBorder, polynom, eps) => {
  const [ leftP, rigthP ] = rootBorder;
  const intervalPoint = (leftP + rigthP) / 2;
  const derivativeMul = polynom.d1(intervalPoint) * polynom.d2(intervalPoint);
  let approachPoint = derivativeMul < 0 ? leftP : rigthP;

  for (let i = 0; i < 100; i++) {
    const frac = polynom(approachPoint) / polynom.d1(approachPoint);
    const nextPoint = approachPoint - frac;

    if (fns.mod(nextPoint - approachPoint) < eps) {
      console.log(i);
      return nextPoint;
    }
    approachPoint = nextPoint
  }  
}

// const res = chordMethod(rootBorders[0], polynom, eps);
// console.log(res);
