'use strict';

const fns = require('./fns');
const logger = require('./logger');
const equationSolver = require('./gauss-solve');

const f = require('./interpolatedFunction');
const { nodes, indexes } = require('./task.json');
const { pow } = Math;

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

const funcPolynom = (coffs, nodes, firstValue) => (x) => {
  const len = nodes.length;
  const items = [firstValue, ...coffs];

  let sum = 0;
  for (let i = 0; i < len; i++) {
    let multiplier = items[i];
    for (let k = 0; k < i; k++) {
      multiplier *= (x - nodes[k]);
    }
    sum += multiplier;
  }

  return sum;
}

const calcUncertainty = (func, polynom, nodes) => {
  const compareTable = [];

  for(const node of nodes) {
    const pv = polynom(node), fv = func(node);
    compareTable.push({
      'x': node,
      'P₄(x)': pv,
      'y(x)': fv,
      '|P₄(x) - y(x)|': fns.mod(pv - fv)
    })
  }
  return compareTable;
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
  const coffs = {
    '0': [ hi, pow(hi, 2), pow(hi, 3) ],
    '1': [ -1, -2 * hi, -3 * pow(hi, 2), 1 ],
    '2': [ 0, -1, -3 * hi, 0, 1 ],
    last: [3 * hi, 1]
  }
  return coffs[numEquation];
}

const splineMethod = (nodes, values) => {
  const xIntervals = getIntervalsLength(nodes);
  const yItnervals = getIntervalsLength(values);
  const countOfIntervals = nodes.length - 1, offset = 3;
  const countOfvars = countOfIntervals * offset;
  const row = Array(countOfvars).fill(0);
  const matrixEquations = [];

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
    return intervals;
  }
  
  let index = 0;
  for (let i = 0; i < offset; i++) {
    const count = i > 0 ? countOfIntervals - 1 : countOfIntervals;
    index += iterator(index, count, i);
  }

  matrixEquations.push(row.slice(), row.slice());

  const last = offset - 1;
  matrixEquations[countOfvars - 2][last - 1] = 1;
  for (let i = last; i > 0; i--) {
    const hn = xIntervals[countOfIntervals - 1];
    matrixEquations[countOfvars - 1][countOfvars - i] = generateCoffs(hn, 'last')[i - 1];
  }
  for(let i = 0; i < countOfvars; i++) matrixEquations[i].push(yItnervals[i] || 0);

  const res = equationSolver(matrixEquations);
  const coffs = fns.roundMins(res);
  return { coffs, aValues: values };
}

const displayCoffs = (values, letters) => {
  const { coffs, aValues} = values;
  const len = letters.length;
  if (coffs.length % len !== 0) return;
  let out = '';
  let index = 0

  for (let i = 1; i <= coffs.length / len; i++) {
    out += `a${indexes[i]} = ${aValues[i - 1]} | `;
    for (let k = 0; k < len; k++) {
      out += `${letters[k]}${indexes[i]} = ${coffs[index]} | `;
      index++;
    }
    out += '\n';
  }
 
  return out;
}

const displaySplines = (values, nodes) => {
  const { coffs, aValues} = values;
  const size = 3;
  const subCoffs = [];
  for (let i = 0; i < Math.ceil(coffs.length/size); i++) {
    subCoffs[i] = coffs.slice((i*size), (i*size) + size);
    subCoffs[i].unshift(aValues[i]);
  }

  let out = '';
  for(const coff of subCoffs) {
    const index = subCoffs.indexOf(coff);
    const node = nodes[index] >= 0 ? nodes[index]: -nodes[index];
    const signNode = nodes[index] >= 0 ? '-': '+';
    const nodeStr = `(x ${signNode} ${node})`;
    out += `S${indexes[index + 1]}(x) = ${coff[0]} + ${coff[1]}∙${nodeStr} + ${coff[2]}∙${nodeStr}² + ${coff[3]}∙${nodeStr}³\n`;
  }

  return out;
}

//Usage polynom Newton
const separatedDiff = interpolationNewton(nodes, functionValues);
const polynomNewtonStr = getNewtonPolynom(separatedDiff, nodes, functionValues[0]);
const funcPolynomNewton = funcPolynom(separatedDiff, nodes, functionValues[0]);
const compareTable = calcUncertainty(f, funcPolynomNewton, nodes);

logger.log('Interpolation by the Newton method', logger.blue);
logger.log(polynomNewtonStr, logger.green, ' ');
logger.matrixLog(compareTable, 'Compare results');

// Usage spline method
const result = splineMethod(nodes, functionValues);
const coffsStr = displayCoffs(result, ['b', 'c', 'd']);
const splines = displaySplines(result, nodes);

logger.log('Interpolation by the spline method. Coffs:', logger.blue);
logger.log(coffsStr, logger.green, '\0');
logger.log('Splines: ', logger.blue);
logger.log(splines, logger.green, '\0');