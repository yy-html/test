
import appConfig from 'public/dependen/app.json'
// import * as microDevLoader from 'micro-dev-loader'
// import * as microDevLoader from 'app-loader-test'
import * as microDevLoader from '@mfb/micro-loader-local'

import * as mainOptions from '@/main.js'
const { initial } = microDevLoader

initial('development', {
  ...appConfig,
  main: mainOptions,
  store: {},
})