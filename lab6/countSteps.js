'use strict';

const valuesFuncD = {
  '4' : 5336.46,
  '6': 17787.7,
  '8': 110679,
  '10': 11067900,
  '12': 1623300000,
  '14': 328266000000,
  '16': 87537700000000
}

function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}

const eps = 0.0001;
const r2 = (a, b, n) => 39.7896 * ((b - a)**3)/(12 * (n**2));
const r4 = (a, b, n) => 5336.46  * ((b - a)**5)/(180 * (n**4));
const rn = (a, b, n) => valuesFuncD[2*n] * ((factorial(n))**4) * ((b - a)**(2*n + 1)) / ((2*n + 1) * ((factorial(2*n))**3));


let nr = 2;
for(; Math.abs(rn(-0.7, 1.2, nr)) >= Math.abs(eps); nr++) { }

console.log(nr);