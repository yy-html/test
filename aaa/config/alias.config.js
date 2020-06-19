// alias 别名
var path = require('path');
// var baseAlias = require('../cloudConfig/build/alias.js');

var alias = {
    'config': path.resolve(__dirname),
    'common': path.resolve(__dirname, '../common'),
    '@': path.resolve(__dirname, '../src'),
    'assets': path.resolve(__dirname, '../src/assets'),
    'images': path.resolve(__dirname, '../src/assets/static/image'),
    'components': path.resolve(__dirname, '../src/components'),
    'apis': path.resolve(__dirname, '../src/apis'),
    'store': path.resolve(__dirname, '../src/store'),
    'views': path.resolve(__dirname, '../src/views'),
    // ...baseAlias,
}

module.exports = alias