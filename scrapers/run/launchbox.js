// @flow
const util = require('util');

const print = o =>
    console.log(util.inspect(o, {colors: true, depth: 10}));

require('../launchbox').fetchAll(15).then(print);
