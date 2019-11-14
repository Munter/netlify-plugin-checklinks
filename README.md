# Netlify Checklinks Build Plugin

[![NPM version](https://badge.fury.io/js/netlify-plugin-checklinks.svg)](http://badge.fury.io/js/netlify-plugin-checklinks)
[![Build Status](https://travis-ci.org/Munter/netlify-plugin-checklinks.svg?branch=master)](https://travis-ci.org/Munter/netlify-plugin-checklinks)
[![Coverage Status](https://img.shields.io/coveralls/Munter/netlify-plugin-checklinks.svg)](https://coveralls.io/r/Munter/netlify-plugin-checklinks?branch=master)
[![Dependency Status](https://david-dm.org/Munter/netlify-plugin-checklinks.svg)](https://david-dm.org/Munter/netlify-plugin-checklinks) [![Greenkeeper badge](https://badges.greenkeeper.io/Munter/netlify-plugin-checklinks.svg)](https://greenkeeper.io/)

Checklinks helps you keep all your asset references correct and avoid embarrassing broken links to your internal pages, or even to external pages you link out to.

Checklinks will traverse your pages dependency graph and report on any missing assets. It will find broken links, broken fragment links, inefficient redirect chains and potential mixed content warnings.

Under the hood the [hyperlink](https://www.npmjs.com/package/hyperlink) package is doing all the work. If you
need more granular control or want to add a different [TAP-reporter](https://www.npmjs.com/search?q=tap%20reporter) you can opt to use hyperlink directly in your own build tooling instead of using this plugin.

## Installation

```
npm install --save-dev netlify-plugin-checklinks
```

Then add the following to your `netlify.yml`:

```yml
plugins:
  - type: netlify-plugin-checklinks
```

## Configuration

Checklinks works out of the box, but can be improved upon with some improved knowledge about your site.

These are the configuration options with their default values:

```yml
plugins:
  - type: netlify-plugin-checklinks
    config:
      # An array of glob patterns for pages on your site
      # Recursive traversal will start from these
      entryPoints:
        - '*.html'

      # canonicalRoot is the origin where your page will eventually be deployed
      # Setting canonicalRoot will enable checklinks to map canonical URL's to your
      # page in your code to local files on disk
      canonicalRoot: https://your-page.netlify.com

      # Recurse through all the links and asset references on your page, starting
      # at the entrypoints
      recursive: true

      # Checklinks outputs TAP (https://testanything.org/tap-version-13-specification.html)
      # by default. Enabling pretty mode makes the output easier on the eyes.
      pretty: true

      # You can mark some check as skipped, which will block checklinks
      # from ever attempting to execute them.
      # skipPatterns is an array of strings you can match against failing reports
      skipPatterns: []

      # You can mark some check as todo, which will execute the check, but allow failures.
      # todoPatterns is an array of strings you can match against failing reports
      todoPatterns: []

      # Report on all broken links to extrnal pages.
      # Enabling this will make your tests more brittle, since you can't control
      # external pages.
      checkExternal: false

      # Enable to check references to source maps, source map sources etc.
      # Many build tools don't emit working references, so this is disabled by default
      followSourceMaps: false
```

## License

[BSD 3-Clause License](<https://tldrlegal.com/license/bsd-3-clause-license-(revised)>)
