/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */


const {capacitorSync, checkCapacitorPackageVersion, existsCapacitorPackage, installCapacitorPackage} = require("./helpers");
const { log, warn, fatal } = require('@quasar/app/lib/helpers/logger')
const fs = require('fs')

function patchCapacitorConfig(api) {
    if (fs.existsSync(api.resolve.capacitor('capacitor.config.json'))) {
        // Save default
        const config = require(api.resolve.capacitor('capacitor.config.json'))
        const defaultResize = (config.plugins && config.plugins.Keyboard && config.plugins.Keyboard.resize) || undefined
        api.mergePersistentConf({
            defaults: {
                resize: defaultResize
            }
        })
        api.extendJsonFile('src-capacitor/capacitor.config.json', {
            plugins: {
                Keyboard: {
                    resize: "body"
                }
            }
        })
    } else {
        fatal("🥺 This little plugin don't support capacitor.config without .json extension, please create issue on github")
    }
}

module.exports = function (api) {
    if (!checkCapacitorPackageVersion(api,'@capacitor/core', '^3.0.0')) {
        fatal('🌩 This plugin only works with capacitor 3.\n' +
            'Please, check upgrade guide https://capacitorjs.com/docs/updating/3-0');
    }
    if (!existsCapacitorPackage(api, '@capacitor/keyboard')) {
        log('🍇 Installing Keyboard plugin');
        api.mergePersistentConf({
            removeKeyboardPlugin: true
        })
        installCapacitorPackage(api, '@capacitor/keyboard')
        capacitorSync(api)
    }
    if (checkCapacitorPackageVersion(api, '@capacitor/keyboard', '< 1.0.1')) {
        log('🍇 Upgrading Keyboard plugin');
        installCapacitorPackage(api, '@capacitor/keyboard')
        capacitorSync(api)
    }

    patchCapacitorConfig(api)
}
