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

import type {PatternInfo} from './SearchSource';
import type {HasteContext} from 'types/HasteMap';

const realFs = require('fs');
const fs = require('graceful-fs');
fs.gracefulify(realFs);

const SearchSource = require('./SearchSource');
const TestRunner = require('./TestRunner');

const {Console} = require('jest-util');
const chalk = require('chalk');
const {formatTestResults} = require('jest-util');
const path = require('path');
const getMaxWorkers = require('./lib/getMaxWorkers');
const setWatchMode = require('./lib/setWatchMode');
const buildTestPathPatternInfo = require('./lib/buildTestPathPatternInfo');

const getTestSummary = (
  argv: Object,
  patternInfo: PatternInfo,
) => {
  const testPathPattern = SearchSource.getTestPathPattern(patternInfo);
  const testInfo = patternInfo.onlyChanged
    ? chalk.dim(' related to changed files')
    : patternInfo.input !== ''
      ? chalk.dim(' matching ') + testPathPattern
      : '';

  const nameInfo = argv.testNamePattern
    ? chalk.dim(' with tests matching ') + `"${argv.testNamePattern}"`
    : '';

  return (
    chalk.dim('Ran all test suites') +
    testInfo +
    nameInfo +
    chalk.dim('.')
  );
};

const runJest = (
  hasteContext: HasteContext,
  config: any,
  argv: Object,
  pipe: stream$Writable | tty$WriteStream,
  testWatcher: any,
  onComplete: (testResults: any) => void,
) => {
  const maxWorkers = getMaxWorkers(argv);
  const localConsole = new Console(pipe, pipe);
  let patternInfo = buildTestPathPatternInfo(argv);
  return Promise.resolve().then(() => {
    const source = new SearchSource(hasteContext, config);
    return source.getTestPaths(patternInfo)
      .then(data => {
        if (!data.paths.length) {
          if (patternInfo.onlyChanged && data.noSCM) {
            if (config.watch) {
              // Run all the tests
              setWatchMode(argv, 'watchAll', {
                noSCM: true,
              });
              patternInfo = buildTestPathPatternInfo(argv);
              return source.getTestPaths(patternInfo);
            } else {
              localConsole.log(
                'Jest can only find uncommitted changed files in a git or hg ' +
                'repository. If you make your project a git or hg repository ' +
                '(`git init` or `hg init`), Jest will be able to only ' +
                'run tests related to files changed since the last commit.',
              );
            }
          }

          localConsole.log(
            source.getNoTestsFoundMessage(patternInfo, config, data),
          );
        }
        return data;
      }).then(data => {
        if (data.paths.length === 1 && config.verbose !== false) {
          config = Object.assign({}, config, {verbose: true});
        }

        return new TestRunner(
          hasteContext,
          config,
          {
            getTestSummary: () => getTestSummary(argv, patternInfo),
            maxWorkers,
          },
        ).runTests(data.paths, testWatcher);
      })
      .then(runResults => {
        if (config.testResultsProcessor) {
          /* $FlowFixMe */
          runResults = require(config.testResultsProcessor)(runResults);
        }
        if (argv.json) {
          if (argv.outputFile) {
            const outputFile = path.resolve(process.cwd(), argv.outputFile);

            fs.writeFileSync(
              outputFile,
              JSON.stringify(formatTestResults(runResults)),
            );
            process.stdout.write(
              `Test results written to: ` +
              `${path.relative(process.cwd(), outputFile)}\n`,
            );
          } else {
            process.stdout.write(
              JSON.stringify(formatTestResults(runResults)),
            );
          }
        }
        return onComplete && onComplete(runResults);
      }).catch(error => {
        throw error;
      });
  });
};

module.exports = runJest;
