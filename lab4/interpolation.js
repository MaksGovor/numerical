'use strict';

const { nodes } = require('./task.json');
const f = require('./interpolatedFunction');

const functionValues = nodes.map(f);
console.log(functionValues);

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

  console.log(separatedDiff);
}

interpolationNewton(nodes, functionValues);