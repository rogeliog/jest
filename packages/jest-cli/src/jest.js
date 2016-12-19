/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

import type {AggregatedResult} from 'types/TestResult';
import type {Path} from 'types/Config';

const realFs = require('fs');
const fs = require('graceful-fs');
fs.gracefulify(realFs);

const Runtime = require('jest-runtime');
const SearchSource = require('./SearchSource');
const TestRunner = require('./TestRunner');

const {Console, clearLine} = require('jest-util');
const {run} = require('./cli');
const chalk = require('chalk');
const preRunMessage = require('./preRunMessage');
const readConfig = require('jest-config').readConfig;
const TestWatcher = require('./TestWatcher');
const runJest = require('./runJest');
const watch = require('./watch');
const getMaxWorkers = require('./lib/getMaxWorkers');

const VERSION = require('../package.json').version;

const runCLI = (
  argv: Object,
  root: Path,
  onComplete: (results: ?AggregatedResult) => void,
) => {
  const pipe = argv.json ? process.stderr : process.stdout;
  argv = argv || {};
  if (argv.version) {
    pipe.write(`v${VERSION}\n`);
    onComplete && onComplete();
    return;
  }

  readConfig(argv, root)
    .then(config => {
      return Runtime.createHasteContext(config, {
        console: new Console(pipe, pipe),
        maxWorkers: getMaxWorkers(argv),
        resetCache: !config.cache,
        watch: config.watch,
      })
      .then(hasteContext => {
        if (argv.debug) {
          /* $FlowFixMe */
          const testFramework = require(config.testRunner);
          pipe.write('jest version = ' + VERSION + '\n');
          pipe.write('test framework = ' + testFramework.name + '\n');
          pipe.write('config = ' + JSON.stringify(config, null, '  ') + '\n');
        }
        if (argv.watch || argv.watchAll) {
          return watch(config, pipe, argv, hasteContext);
        } else {
          preRunMessage.print(pipe);
          const testWatcher = new TestWatcher({isWatchMode: false});
          return runJest(hasteContext, config, argv, pipe, testWatcher,
            onComplete);
        }
      });
    })
    .catch(error => {
      clearLine(process.stderr);
      clearLine(process.stdout);
      console.error(chalk.red(error.stack));
      process.exit(1);
    });
};

module.exports = {
  SearchSource,
  TestRunner,
  TestWatcher,
  getVersion: () => VERSION,
  run,
  runCLI,
};
