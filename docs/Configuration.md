---
id: configuration
title: Configuration
layout: docs
category: Reference
permalink: docs/configuration.html
next: troubleshooting
---

#### The Jest configuration options

Jest's configuration can be defined in the `package.json` file of your project
or through the `--config <path/to/json>` option. If you'd like to use
your `package.json` to store Jest's config, the "jest" key should be used on the
top level so Jest will know how to find your settings:

```js
{
  "name": "my-project",
  "jest": {
    "verbose": true
  }
}
```

When using the --config option, the JSON file must not contain a "jest" key:

```js
{
  "bail": true,
  "verbose": true
}
```


#### [Configuration Options](#configuration)

These options let you control Jest's behavior in your `package.json` file. The Jest philosophy is to work great by default, but sometimes you just need more configuration power.

  - [`automock` [boolean]](#automock-boolean)
  - [`browser` [boolean]](#browser-boolean)
  - [`bail` [boolean]](#bail-boolean)
  - [`cacheDirectory` [string]](#cachedirectory-string)
  - [`collectCoverage` [boolean]](#collectcoverage-boolean)
  - [`collectCoverageFrom` [array]](#collectcoveragefrom-array)
  - [`coverageDirectory` [string]](#coveragedirectory-string)
  - [`coveragePathIgnorePatterns` [array<string>]](#coveragepathignorepatterns-array-string)
  - [`coverageReporters` [array<string>]](#coveragereporters-array-string)
  - [`coverageThreshold` [object]](#coveragethreshold-object)
  - [`globals` [object]](#globals-object)
  - [`mocksPattern` [string]](#mockspattern-string)
  - [`moduleDirectories` [array<string>]](#moduledirectories-array-string)
  - [`moduleFileExtensions` [array<string>]](#modulefileextensions-array-string)
  - [`moduleNameMapper` [object<string, string>]](#modulenamemapper-object-string-string)
  - [`modulePathIgnorePatterns` [array<string>]](#modulepathignorepatterns-array-string)
  - [`modulePaths` [array<string>]](#modulepaths-array-string)
  - [`notify` [boolean]](#notify-boolean)
  - [`preset` [string]](#preset-string)
  - [`resetMocks` [boolean]](#resetmocks-boolean)
  - [`resetModules` [boolean]](#resetmodules-boolean)
  - [`rootDir` [string]](#rootdir-string)
  - [`setupFiles` [array]](#setupfiles-array)
  - [`setupTestFrameworkScriptFile` [string]](#setuptestframeworkscriptfile-string)
  - [`snapshotSerializers` [array<string>]](#snapshotserializers-array-string)
  - [`testEnvironment` [string]](#testenvironment-string)
  - [`testPathDirs` [array<string>]](#testpathdirs-array-string)
  - [`testPathIgnorePatterns` [array<string>]](#testpathignorepatterns-array-string)
  - [`testRegex` [string]](#testregex-string)
  - [`testResultsProcessor` [string]](#testresultsprocessor-string)
  - [`testRunner` [string]](#testrunner-string)
  - [`testURL` [string]](#testurl-string)
  - [`timers` [string]](#timers-string)
  - [`transform` [object<string, string>]](#transform-object-string-string)
  - [`transformIgnorePatterns` [array<string>]](#transformignorepatterns-array-string)
  - [`unmockedModulePathPatterns` [array<string>]](#unmockedmodulepathpatterns-array-string)
  - [`verbose` [boolean]](#verbose-boolean)

-----

## Jest options

### `automock` [boolean]
(default: `false`)

This option is disabled by default. If you are introducing Jest to a large organization with an existing codebase but few tests, enabling this option can be helpful to introduce unit tests gradually. Modules can be explicitly auto-mocked using `jest.mock(moduleName)`.

*Note: Core modules, like `fs`, are not mocked by default. They can be mocked explicitly, like `jest.mock('fs')`.*

### `browser` [boolean]
(default: `false`)

Respect Browserify's [`"browser"` field](https://github.com/substack/browserify-handbook#browser-field) in `package.json` when resolving modules. Some modules export different versions based on whether they are operating in Node or a browser.

### `bail` [boolean]
(default: `false`)

By default, Jest runs all tests and produces all errors into the console upon completion. The bail config option can be used here to have Jest stop running tests after the first failure.

### `cacheDirectory` [string]
(default: `"/tmp/<path>"`)

The directory where Jest should store its cached dependency information.

Jest attempts to scan your dependency tree once (up-front) and cache it in order to ease some of the filesystem raking that needs to happen while running tests. This config option lets you customize where Jest stores that cache data on disk.

### `collectCoverage` [boolean]
(default: `false`)

Indicates whether the coverage information should be collected while executing the test. Because this retrofits all executed files with coverage collection statements, it may significantly slow down your tests.

### `collectCoverageFrom` [array]
(default: `undefined`)

An array of [glob patterns](https://github.com/jonschlinkert/micromatch)
indicating a set of files for which coverage information should be collected. If a file matches
the specified glob pattern, coverage information will be collected for it even if no tests exist for
this file and it's never required in the test suite.

Example:
```js
collectCoverageFrom: ["**/*.{js,jsx}", "!**/node_modules/**", "!**/vendor/**"]
```

This will collect coverage information for all the files inside the project's `rootDir`, except the ones that match
`**/node_modules/**` or `**/vendor/**`.

*Note: This option requires `collectCoverage` to be set to true or Jest to be invoked with `--coverage`.*

### `coverageDirectory` [string]
(default: `undefined`)

The directory where Jest should output its coverage files.

### `coveragePathIgnorePatterns` [array<string>]
(default: `["/node_modules/"]`)

An array of regexp pattern strings that are matched against all file paths before executing the test. If the file path matches any of the patterns, coverage information will be skipped.

These pattern strings match against the full path. Use the `<rootDir>` string token to  include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/", "<rootDir>/node_modules/"]`.

### `coverageReporters` [array<string>]
(default: `["json", "lcov", "text"]`)

A list of reporter names that Jest uses when writing coverage reports. Any [istanbul reporter](https://github.com/gotwarlost/istanbul/tree/master/lib/report) can be used.

*Note: Setting this option overwrites the default values. Add `"text"` or `"text-summary"` to see a coverage summary in the console output.*

### `coverageThreshold` [object]
(default: `undefined`)

This will be used to configure minimum threshold enforcement for coverage results. If the thresholds are not met, jest will return failure. Thresholds, when specified as a positive number are taken to be the minimum percentage required. When a threshold is specified as a negative number it represents the maximum number of uncovered entities allowed.

For example, statements: 90 implies minimum statement coverage is 90%. statements: -10 implies that no more than 10 uncovered statements are allowed.

```js
{
  ...
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 50,
        "functions": 50,
        "lines": 50,
        "statements": 50
      }
    }
  }
}
```

### `globals` [object]
(default: `{}`)

A set of global variables that need to be available in all test environments.

For example, the following would create a global `__DEV__` variable set to `true` in all test environments:

```js
{
  ...
  "jest": {
    "globals": {
      "__DEV__": true
    }
  }
}
```

Note that, if you specify a global reference value (like an object or array) here, and some code mutates that value in the midst of running a test, that mutation will *not* be persisted across test runs for other test files.

### `mocksPattern` [string]
(default: `(?:[\\/]|^)__mocks__[\\/]`)

A pattern that is matched against file paths to determine which folder contains manual mocks.

### `moduleFileExtensions` [array<string>]
(default: `["js", "json", "jsx", "node"]`)

An array of file extensions your modules use. If you require modules without specifying a file extension, these are the extensions Jest will look for.

If you are using TypeScript this should be `["js", "jsx", "json", "ts", "tsx"]`

### `moduleDirectories` [array<string>]
(default: `["node_modules"]`)

An array of directory names to be searched recursively up from the requiring module's location. Setting this option
will _override_ the default, if you wish to still search `node_modules` for packages include it
along with any other options: `["node_modules", "bower_components"]`

### `moduleNameMapper` [object<string, string>]
(default: `null`)

A map from regular expressions to module names that allow to stub out resources, like images or styles with a single module.

Modules that are mapped to an alias are unmocked by default, regardless of whether automocking is enabled or not.

Use `<rootDir>` string token to refer to [`rootDir`](#rootdir-string) value if you want to use file paths.

Additionally, you can substitute captured regex groups using numbered backreferences.

Example:
```js
  "moduleNameMapper": {
    "^image![a-zA-Z0-9$_-]+$": "GlobalImageStub",
    "^[./a-zA-Z0-9$_-]+\.png$": "<rootDir>/RelativeImageStub.js",
    "module_name_(.*)": "<rootDir>/substituted_module_$1.js"
  }
```
*Note: If you provide module name without boundaries `^$` it may cause hard to spot errors. E.g. `relay` will replace all modules which contain `relay` as a substring in its name: `relay`, `react-relay` and `graphql-relay` will all be pointed to your stub.*

### `modulePathIgnorePatterns` [array<string>]
(default: `[]`)

An array of regexp pattern strings that are matched against all module paths before those paths are to be considered 'visible' to the module loader. If a given module's path matches any of the patterns, it will not be `require()`-able in the test environment.

These pattern strings match against the full path. Use the `<rootDir>` string token to  include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/"]`.

### `modulePaths` [array<string>]
(default: `[]`)

An alternative API to setting the `NODE_PATH` env variable, `modulePaths` is an array of absolute paths to
additional locations to search when resolving modules. Use the `<rootDir>` string token to include the path to your project's root directory. Example: `["<rootDir>/app/"]`.

### `notify` [boolean]
(default: `false`)

Activates notifications for test results.

### `preset` [string]
(default: `undefined`)

A preset that is used as a base for Jest's configuration. A preset should point to an npm module that exports a `jest-preset.json` module on its top level.

### `resetMocks` [boolean]
(default: `false`)

Automatically reset mock state between every test. Equivalent to calling `jest.resetAllMocks()` between each test.

### `resetModules` [boolean]
(default: `false`)

If enabled, the module registry for every test file will be reset before running each individual test. This is useful to isolate modules for every test so that local module state doesn't conflict between tests. This can be done programmatically using [`jest.resetModules()`](#jest-resetmodules).

### `rootDir` [string]
(default: The root of the directory containing the `package.json` *or* the [`pwd`](http://en.wikipedia.org/wiki/Pwd) if no `package.json` is found)

The root directory that Jest should scan for tests and modules within. If you put your Jest config inside your `package.json` and want the root directory to be the root of your repo, the value for this config param will default to the directory of the `package.json`.

Oftentimes, you'll want to set this to `'src'` or `'lib'`, corresponding to where in your repository the code is stored.

*Note that using `'<rootDir>'` as a string token in any other path-based config settings to refer back to this value. So, for example, if you want your [`setupFiles`](#setupfiles-array) config entry to point at the `env-setup.js` file at the root of your project, you could set its value to `["<rootDir>/env-setup.js"]`.*

### `setupFiles` [array]
(default: `[]`)

The paths to modules that run some code to configure or set up the testing environment before each test. Since every test runs in its own environment, these scripts will be executed in the testing environment immediately before executing the test code itself.

It's worth noting that this code will execute *before* [`setupTestFrameworkScriptFile`](#setuptestframeworkscriptfile-string).

### `setupTestFrameworkScriptFile` [string]
(default: `undefined`)

The path to a module that runs some code to configure or set up the testing framework before each test. Since [`setupFiles`](#setupfiles-array) executes before the test framework is installed in the environment, this script file presents you the opportunity of running some code immediately after the test framework has been installed in the environment.

For example, Jest ships with several plug-ins to `jasmine` that work by monkey-patching the jasmine API. If you wanted to add even more jasmine plugins to the mix (or if you wanted some custom, project-wide matchers for example), you could do so in this module.

### `snapshotSerializers` [array<string>]
(default: `[]`)

A list of paths to snapshot serializer modules Jest should use for snapshot
testing.

Jest has default serializers for built-in javascript types and for react
elements. See [snapshot test tutorial](/jest/docs/tutorial-react-native.html#snapshot-test) for more information.

Example serializer module:

```js
// my-serializer-module
module.exports = {
  test: function(val) {
    return val && val.hasOwnProperty('foo');
  },
  print: function(val, serialize, indent) {
    return 'Pretty foo: ' + serialize(val.foo);
  }
};
```

`serialize` is a function that serializes a value using existing plugins.

To use `my-serializer-module` as a serializer, configuration would be as
follows:

```js
{
  ...
  "jest": {
    "snapshotSerializers": ["my-serializer-module"]
  }
}
```

Finally tests would look as follows:

```js
test(() => {
  const bar = {
    foo: {x: 1, y: 2}
  };

  expect(foo).toMatchSnapshot();
});
```

Rendered snapshot:

```
Pretty foo: Object {
  "x": 1,
  "y": 2,
}
```

### `testEnvironment` [string]
(default: `"jsdom"`)

The test environment that will be used for testing. The default environment in Jest is a browser-like environment through [jsdom](https://github.com/tmpvar/jsdom). If you are building a node service, you can use the `node` option to use a node-like environment instead.

### `testPathDirs` [array<string>]
(default: `["<rootDir>"]`)

A list of paths to directories that Jest should use to search for tests in.

There are times where you only want Jest to search in a single sub-directory (such as cases where you have a `src/` directory in your repo), but not the rest of the repo.

### `testPathIgnorePatterns` [array<string>]
(default: `["/node_modules/"]`)

An array of regexp pattern strings that are matched against all test paths before executing the test. If the test path matches any of the patterns, it will be skipped.

These pattern strings match against the full path. Use the `<rootDir>` string token to  include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/build/", "<rootDir>/node_modules/"]`.

### `testRegex` [string]
(default: `(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$`)

The pattern Jest uses to detect test files. By default it looks for `.js` and `.jsx` files
inside of `__tests__` folders, as well as any files with a suffix of `.test` or `.spec`
(e.g. `Component.test.js` or `Component.spec.js`). It will also find files called `test.js`
or `spec.js`.

### `testResultsProcessor` [string]
(default: `undefined`)

This option allows the use of a custom results processor. This processor must be a node module that exports a function expecting an object with the following structure as the first argument:

```
{
  "success": bool,
  "startTime": epoch,
  "numTotalTestSuites": number,
  "numPassedTestSuites": number,
  "numFailedTestSuites": number,
  "numRuntimeErrorTestSuites": number,
  "numTotalTests": number,
  "numPassedTests": number,
  "numFailedTests": number,
  "numPendingTests": number,
  "testResults": [{
    "numFailingTests": number,
    "numPassingTests": number,
    "numPendingTests": number,
    "testResults": [{
      "title": string (message in it block),
      "status": "failed" | "pending" | "passed",
      "ancestorTitles": [string (message in describe blocks)],
      "failureMessages": [string],
      "numPassingAsserts": number
    },
    ...
    ],
    "perfStats": {
      "start": epoch,
      "end": epoch
    },
    "testFilePath": absolute path to test file,
    "coverage": {}
  },
  ...
  ]
}
```

### `testRunner` [string]
(default: `jasmine2`)

This option allows use of a custom test runner. The default is jasmine2. A custom test runner can be provided by specifying a path to a test runner implementation.

### `testURL` [string]
(default: `about:blank`)

This option sets the URL for the jsdom environment. It is reflected in properties such as `location.href`.

### `timers` [string]
(default: `real`)

Setting this value to `fake` allows the use of fake timers for functions such as `setTimeout`.  Fake timers are useful when a piece of code sets a long timeout that we don't want to wait for in a test.

### `transform` [object<string, string>]
(default: `undefined`)

A map from regular expressions to paths to transformers. A transformer is a module that provides a synchronous function for transforming source files. For example, if you wanted to be able to use a new language feature in your modules or tests that isn't yet supported by node, you might plug in one of many compilers that compile a future version of JavaScript to a current one. Example: see the [examples/typescript](/jest/examples/typescript/package.json#L16) example or the [webpack tutorial](/jest/docs/tutorial-webpack.html).

Examples of such compilers include [babel](https://babeljs.io/), [typescript](http://www.typescriptlang.org/), and [async-to-gen](http://github.com/leebyron/async-to-gen#jest).

*Note: a transformer is only ran once per file unless the file has changed. During development of a transformer it can be useful to run Jest with `--no-cache` or to frequently [delete Jest's cache](/jest/docs/troubleshooting.html#caching-issues).*

*Note: if you are using the `babel-jest` transformer and want to use an additional code preprocessor, keep in mind that when "transform" is overwritten in any way the `babel-jest` is not loaded automatically anymore. If you want to use it to compile JavaScript code it has to be explicitly defined. See [babel-jest plugin](https://github.com/facebook/jest/tree/master/packages/babel-jest#setup)*

### `transformIgnorePatterns` [array<string>]
(default: `["/node_modules/"]`)

An array of regexp pattern strings that are matched against all source file paths before transformation. If the test path matches any of the patterns, it will not be transformed.

These pattern strings match against the full path. Use the `<rootDir>` string token to  include the path to your project's root directory to prevent it from accidentally ignoring all of your files in different environments that may have different root directories. Example: `["<rootDir>/bower_components/", "<rootDir>/node_modules/"]`.

### `unmockedModulePathPatterns` [array<string>]
(default: `[]`)

An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them. If a module's path matches any of the patterns in this list, it will not be automatically mocked by the module loader.

This is useful for some commonly used 'utility' modules that are almost always used as implementation details almost all the time (like underscore/lo-dash, etc). It's generally a best practice to keep this list as small as possible and always use explicit `jest.mock()`/`jest.unmock()` calls in individual tests. Explicit per-test setup is far easier for other readers of the test to reason about the environment the test will run in.

It is possible to override this setting in individual tests by explicitly calling `jest.mock()` at the top of the test file.

### `verbose` [boolean]
(default: `false`)

Indicates whether each individual test should be reported during the run. All errors will also still be shown on the bottom after execution.
