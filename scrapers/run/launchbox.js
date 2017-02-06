// @flow
const launchbox = require('../launchbox');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const END = 50000;
const OUT = path.join(process.env.HOME, '/download/launchbox/');

mkdirp.sync(OUT);

let id = 1;

const util = require('util');

const print = o =>
    console.log(util.inspect(o, {colors: true, depth: 10}));

const run = () =>
    launchbox.fetchAll(id)
        .then(res => {
            fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(res, null, '  '));
            return res;
        })
        .then(print)
        .then(() => {
            id++;
            if (id < END) run();
        })
        .catch(() => {
            id++;
            if (id < END) run();
        });

run();
