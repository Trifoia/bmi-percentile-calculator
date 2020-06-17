module.exports = {
  'env': {
    'node': true,
    'es6': true,
    'browser': true,
    'mocha': true
  },
  'parserOptions': {
    'sourceType': 'script',
    'ecmaVersion': 2020
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'rules': {
    'indent': [ 'error', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single' ],
    'semi': [ 'error', 'always' ],
    'prefer-const': [ 'error' ],
    'strict': [ 'error', 'safe' ],
    'require-atomic-updates': 0
  }
};
