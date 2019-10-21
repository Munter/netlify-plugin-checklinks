const { resolve } = require('path');
const expect = require('unexpected');
const extractConfig = require('../lib/extractConfig');

const BUILD_DIR = resolve(__dirname, '../testdata/manypages');
const defaultConfig = {
  constants: {
    BUILD_DIR
  },
  pluginConfig: {}
};

describe('extractConfig', () => {
  it('should have the expected defaults', () => {
    expect(extractConfig(defaultConfig), 'to exhaustively satisfy', {
      root: BUILD_DIR,
      canonicalRoot: undefined,
      entryPoints: ['404.html', '500.html', 'index.html'],
      recursive: true,
      pretty: true,
      checkExternal: false,
      followSourceMaps: false,
      skipFilter: expect.it('to be a function'),
      todoFilter: expect.it('to be a function')
    });
  });

  it('should parse all options', () => {
    const config = {
      ...defaultConfig,
      pluginConfig: {
        canonicalRoot: 'https://netlify.com',
        entryPoints: ['index.html'],
        recursive: false,
        pretty: false,
        checkExternal: true,
        followSourceMaps: true
      }
    };
    expect(extractConfig(config), 'to satisfy', {
      canonicalRoot: 'https://netlify.com',
      entryPoints: ['index.html'],
      recursive: false,
      pretty: false,
      checkExternal: true,
      followSourceMaps: true
    });
  });

  it('should take multiple entry points', () => {
    const config = {
      ...defaultConfig,
      pluginConfig: {
        entryPoints: ['index.html', '404.html', 'subpage/index.html']
      }
    };
    expect(extractConfig(config), 'to satisfy', {
      entryPoints: ['index.html', '404.html', 'subpage/index.html']
    });
  });

  it('should expand entry point glob patterns', () => {
    const config = {
      ...defaultConfig,
      pluginConfig: {
        entryPoints: ['**/*.html']
      }
    };
    expect(extractConfig(config), 'to satisfy', {
      entryPoints: [
        '404.html',
        '500.html',
        'index.html',
        'subpage/index.html',
        'path/to/deep/file.html'
      ]
    });
  });
});
