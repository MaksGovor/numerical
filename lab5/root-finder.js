'use strict';

const { rootBorders } = require('./task.json');
const polynom = require('./polynom');
const fns = require('./fns');
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

    if (fns.mod(rigthP - leftP) < eps) {
      return { res: x, i };
    }
  }
};

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
      return { res: nextPoint, i };
    }
    variablePoint = nextPoint;
  }
};

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
      return { res: nextPoint, i };
    }
    approachPoint = nextPoint;
  }
};

// Usage

const table = rootBorders.map((rootBorder) => {
  const resBis = bisectionMethod(rootBorder, polynom, eps);
  const resCh = chordMethod(rootBorder, polynom, eps);
  const resTan = tangentMethod(rootBorder, polynom, eps);

  const row = {
    interval: rootBorder,
    iterBisection: resBis.i,
    resBisection: resBis.res,
    iterChord: resCh.i,
    resChord: resCh.res,
    iterTangent: resTan.i,
    resTangent: resTan.res
  };

  return row;
});

console.table(table);
