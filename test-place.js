'use strict';

const gauss = require('gaussian-elimination');

const arr = [
    [ 2, 4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.9582406008920068 ],
    [ 0, 0, 0, 2, 4, 8, 0, 0, 0, 0, 0, 0, 1.9582406008920068 ],
    [ 0, 0, 0, 0, 0, 0, 2, 4, 8, 0, 0, 0, 0.05177238601573109 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 8, 1.022846892542915 ],
    [ -1, -4, -6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, -1, -4, -6, 1, 0,  0,  0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, -1, -4, -6, 1, 0, 0 , 0],
    [ 0, -1, -6, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, -1, -6, 0, 1, 0,  0, 0, 0, 0 ],
    [ 0, 0,  0,  0, 0, 0, 0, -1, -6, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 0]
];

const res1 = gauss(arr);

console.table(res1);