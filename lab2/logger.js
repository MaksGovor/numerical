'use strict';

const logger = {
  tab: `${'-'.repeat(10)}`,
  white: '\x1b[1;37m', // Bold
  green: '\x1b[1;32m', // Bold
  blue: '\x1b[1;34m', // Bold
  red: '\x1b[1;31m' // Bold
};

logger.log = function(str, color) {
  let out = `${this.tab + str + this.tab}`;
  if (color) out = color + out + logger.white;
  console.log(out);
};

logger.matrixLog = function(matrix, str) {
  if (str) this.log(this.blue + str + this.white);
  console.table(matrix);
};

logger.residualLog = function(vectors) {
  for (let i = 0; i < vectors.length; i++) {
    console.log(`${this.white}Residual vector iteration ${i}: [${
      this.blue + vectors[i].join(', ') + this.white
    }]`);
  }
};

logger.iterateTables = function(tables) {
  for (const table of tables) {
    const index = tables.indexOf(table);
    if (index !== -1) this.matrixLog(table, `Vector x iteration ${index}`);
  }
};

module.exports = logger;
