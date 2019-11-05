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
