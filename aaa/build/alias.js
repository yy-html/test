// alias 别名 自行改，不固定
const path = require('path')
function resolve (relPath) {
  return path.resolve(__dirname, relPath)
}
const alias = {
  'config': resolve('../'),
  'common': resolve('../common'),
  '@': resolve('../src'),
  '@assets': resolve('../src/assets'),
  '@images': resolve('../src/assets/static/image'),
  '@components': resolve('../src/components'),
  '@config': resolve('../src/config'),
  '@common': resolve('../src/common'),
  '@mixins': resolve('../src/common/mixins'),
  '@views': resolve('../src/views'),
  'views': resolve('../src/views'),
  '@apis': resolve('../src/config/apis'),
  '@router': resolve('../src/config/router'),
  '@service': resolve('../src/config/service'),
  '@store': resolve('../src/config/store'),
  'public': resolve('../public'),
  'apis': resolve('../src/apis'),
  'router': resolve('../src/router'),
  'service': resolve('../src/service'),
  'store': resolve('../src/store')
}

module.exports = alias