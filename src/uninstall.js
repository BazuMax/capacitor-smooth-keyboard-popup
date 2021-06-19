/**
 * Quasar App Extension uninstall script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/uninstall-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/UninstallAPI.js
 */

const {removeCapacitorPackage} = require("./helpers");
const fs = require('fs')
const {removePathFromJsonFile} = require("./helpers");

module.exports = function (api) {
    const conf = api.getPersistentConf()
    if (conf.removeKeyboardPlugin) {
        removeCapacitorPackage(api, '@capacitor/keyboard')
    }

    const configPath = api.resolve.capacitor('capacitor.config.json')
    if (fs.existsSync(configPath)) {
        removePathFromJsonFile(configPath, 'plugins.Keyboard')
    }
}
