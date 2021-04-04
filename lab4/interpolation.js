'use strict';

const { nodes } = require('./task.json');
const { pow } = Math;
const fns = require('./fns');
const logger = require('./logger');
const f = require('./interpolatedFunction');

const roundTo6 = fns.partial(fns.roundPlus, 6);
const functionValues = nodes.map(f);

// Interpolation Newton Method

const interpolationNewton = (nodes, values) => {
  const separatedDiff = [];
  const iterations = nodes.length - 1;
  let quantityByOrder = iterations, nodeStep = 1;

  for (let i = 0; i < iterations; i++) {
    const fValues = separatedDiff[i - 1] || values;
    separatedDiff[i] = [];
    for (let k = 0; k < quantityByOrder; k++) {
      const delta = (fValues[k] - fValues[k + 1]) / (nodes[k] - nodes[k + nodeStep]);
      separatedDiff[i].push(delta);
    };
    quantityByOrder--;
    nodeStep++;
  }

  const result = separatedDiff.map((x) => x[0]);
  return result;
}

const getNewtonPolynom = (diffs, nodes, firstValue) => {
  let polynom = `f(x) ≈ ${roundTo6(firstValue)}`;
  let multiplier = ''
  const length = nodes.length - 1, plus = '+', minus = '-';

  for (let i = 0; i < length; i++) {
    const signNode = nodes[i] >= 0 ? minus : plus;
    const node = nodes[i] > 0 ? nodes[i]: -nodes[i];
    multiplier += `(x ${signNode} ${node})`;
    
    const signDiff = diffs[i] >= 0 ? plus : minus;
    const diff = diffs[i] > 0 ? diffs[i]: -diffs[i];
    polynom += ` ${signDiff} ${roundTo6(diff)}∙${multiplier}`
  }

  return polynom;
}

// Interpolation spline

const getIntervalsLength = (nodes) => {
  const intervalsLength = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    intervalsLength[i] = nodes[i + 1] - nodes[i];
  }
  return intervalsLength;
}

const generateCoffs = (hi, numEquation) => {
  const coffs = [
    [ hi, pow(hi, 2), pow(hi, 3) ],
    [ -1, -2 * hi, -3 * hi, 1 ],
    [ 0, -1, -3 * hi, 0, 1 ]
  ]
  return coffs[numEquation];
}

const splineMethod = (nodes, values) => {
  const xIntervals = getIntervalsLength(nodes);
  const yItnervals = getIntervalsLength(values);
  const countOfIntervals = nodes.length - 1, offset = 3;
  const countOfvars = countOfIntervals * offset;
  const vectorEquations = Array(countOfvars).fill(0);
  const row = Array(countOfvars).fill(0);
  const matrixEquations = Array(countOfvars);

  const iterator = (index, intervals, numEquation) => {
    for (let i = 0; i < intervals; i++) {
      matrixEquations[i + index] = row.slice();
      const localOffset = i * offset;
      const hi = xIntervals[i];
      const coffs = generateCoffs(hi, numEquation);
      for (let j = localOffset; j < countOfvars; j++) {
        if (coffs[j - localOffset] || coffs[j - localOffset] === 0) 
          matrixEquations[i + index][j] = coffs[j - localOffset];
        else break;
      }
    }
    return index + intervals;
  }
  
  let index = 0;
  for (let i = 0; i < offset; i++) {
    const count = i > 0 ? countOfIntervals - 1 : countOfIntervals;
    index += iterator(index, count, i);
  }

  for (let i = 0; i <= countOfIntervals; i++) vectorEquations[i] = yItnervals[i];


  
  logger.matrixLog(matrixEquations);
  logger.matrixLog(vectorEquations);
}

splineMethod(nodes, functionValues);
// Usage polynom Newton
// const separatedDiff = interpolationNewton(nodes, functionValues);
// const polynomNewton = getNewtonPolynom(separatedDiff, nodes, functionValues[0]);

// logger.log('Interpolation by the Newton method', logger.blue);
// logger.log(polynomNewton, logger.green, ' ');