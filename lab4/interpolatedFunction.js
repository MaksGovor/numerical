'use strict';

const { alpha } = require('./task.json');
const {sin, cbrt} = Math;

const f = (x) => (sin(x * alpha / 2) + cbrt(x * alpha));

module.exports = f;