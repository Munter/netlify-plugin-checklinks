const globby = require('globby');

/**
 * @typedef {{
 *   name: string,
 *   ok: boolean,
 *   operator: string,
 *   expected: string,
 *   actual: string,
 *   at: string
 * }} Report
 */

/**
 * @callback FilterFunction
 * @param {Report} report TAP report
 * @returns {boolean}
 */

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function checkBoolean(maybeBool, name) {
  if (typeof maybeBool !== 'boolean') {
    throw new ValidationError(
      `${name} must be a boolean: ${JSON.stringify(
        maybeBool
      )} (${typeof maybeBool})`
    );
  }
}

function checkString(maybeString, name) {
  if (typeof maybeString !== 'string') {
    throw new ValidationError(
      `${name} must be a string: : ${JSON.stringify(
        maybeString
      )} (${typeof maybeString})`
    );
  }
}

function checkArray(maybeArray, name) {
  if (!Array.isArray(maybeArray)) {
    throw new ValidationError(
      `${name} must be an array: : ${JSON.stringify(
        maybeArray
      )} (${typeof maybeArray})`
    );
  }
}

module.exports = function extractConfig({
  constants: { BUILD_DIR },
  pluginConfig: {
    canonicalRoot,
    entryPoints = ['*.html'],
    recursive = true,
    pretty = true,
    skipPatterns = [],
    todoPatterns = [],
    checkExternal = false,
    followSourceMaps = false
  }
}) {
  /** @type {string} */
  const root = BUILD_DIR;

  if (canonicalRoot) {
    checkString(canonicalRoot, 'canonicalRoot');
  }

  const booleans = {
    recursive,
    pretty,
    checkExternal,
    followSourceMaps
  };

  for (const [name, maybeBool] of Object.entries(booleans)) {
    checkBoolean(maybeBool, name);
  }

  const stringArrays = {
    entryPoints,
    skipPatterns,
    todoPatterns
  };

  for (const [name, maybeArray] of Object.entries(stringArrays)) {
    checkArray(maybeArray, name);

    maybeArray.map(s => checkString(s, name));
  }

  const resolvedEntryPoints = globby.sync(entryPoints, { cwd: root });

  /** @type {FilterFunction} */
  const skipFilter = report =>
    Object.values(report).some(value =>
      skipPatterns.some(pattern => String(value).includes(pattern))
    );

  /** @type {FilterFunction} */
  const todoFilter = report =>
    Object.values(report).some(value =>
      todoPatterns.some(pattern => String(value).includes(pattern))
    );

  const config = {
    root,
    canonicalRoot,
    entryPoints: resolvedEntryPoints,
    recursive,
    pretty,
    skipFilter,
    todoFilter,
    checkExternal,
    followSourceMaps
  };

  return config;
};
