'use strict';

const { nodes } = require('./task.json');
const f = require('./interpolatedFunction');

const functionValues = nodes.map(f);
console.log(functionValues);

const interpolationNewton = (nodes) => {

}