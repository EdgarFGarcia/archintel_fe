/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import axios from 'axios'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(axios)
}
