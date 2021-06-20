/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */
const { log, warn, fatal } = require('@quasar/app/lib/helpers/logger')


const extendConf = (api) => (conf) => {
    // make sure my-ext boot file is registered
    conf.boot.push(`~@bazumax/quasar-app-extension-capacitor-smooth-keyboard-popup/src/boot/capacitor-smooth-keyboard-${api.ctx.targetName}.js`)

    // make sure boot & component files get transpiled
    conf.build.transpileDependencies.push(/@bazumax\/quasar-app-extension-capacitor-smooth-keyboard-popup[\\/]src/)
}


module.exports = function (api) {
    if (api.ctx.modeName === 'capacitor') {
        if (['ios', 'android'].includes(api.ctx.targetName)) {
            api.extendQuasarConf(extendConf(api))
        }
        else {
            fatal("KEK")
        }
    }
    else {
        fatal("KEK2")
    }
}
