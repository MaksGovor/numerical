'use strict';

const { nodes } = require('./task.json');
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
      // console.log({ y1: fValues[k], y2: fValues[k + 1], x1: nodes[k], x2:  nodes[k + nodeStep], delta});
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
  const length = nodes.length - 1;

  for (let i = 0; i < length; i++) {
    const sign = nodes[i] >= 0 ? '-' : '+';
    const node = nodes[i] > 0 ? nodes[i]: -nodes[i];
    multiplier += `(x ${sign} ${node})`
    polynom += ` + ${roundTo6(diffs[i])}∙${multiplier}`
  }

  return polynom;
}

// Usage polynom Newton
const separatedDiff = interpolationNewton(nodes, functionValues);
const polynomNewton = getNewtonPolynom(separatedDiff, nodes, functionValues[0]);

logger.log('Interpolation by the Newton method', logger.blue);
logger.log(polynomNewton, logger.green, ' ');