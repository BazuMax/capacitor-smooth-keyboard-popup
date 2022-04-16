const semver = require('semver')
const { spawnSync } = require('@quasar/app/lib/helpers/spawn')
const { log, warn, fatal } = require('@quasar/app/lib/helpers/logger')
const fs = require('fs')


function checkCapacitorPackageVersion(api, packageName, expr) {
    return semver.satisfies(semver.coerce(require(api.resolve.capacitor('package.json')).dependencies[packageName]), expr);
}

function existsCapacitorPackage(api, packageName) {
    return require(api.resolve.capacitor('package.json')).dependencies[packageName] !== undefined
}

function installCapacitorDependencies(api) {
    const nodePackager = require('@quasar/app/lib/helpers/node-packager')
    const cmdParam = nodePackager === 'npm'
        ? ['install']
        : []

    spawnSync(
        nodePackager,
        cmdParam,
        { cwd: api.resolve.capacitor(''), env: { ...process.env, NODE_ENV: 'development' } },
        () => console.warn(`Failed to update dependencies`)
    )
}

function installCapacitorPackage(api, packageName) {
    const nodePackager = require('@quasar/app/lib/helpers/node-packager')
    const cmdParam = nodePackager === 'npm'
        ? ['install']
        : ['add']

    log(`Retrieving "${packageName}"...`)
    spawnSync(
        nodePackager,
        cmdParam.concat(packageName),
        { cwd: api.resolve.capacitor(''), env: { ...process.env, NODE_ENV: 'development' } },
        () => warn(`Failed to install ${packageName}`)
    )
}

function removeCapacitorPackage(api, packageName) {
    const nodePackager = require('@quasar/app/lib/helpers/node-packager')
    const cmdParam = nodePackager === 'npm'
        ? ['uninstall']
        : ['remove']

    log(`Retrieving "${packageName}"...`)
    spawnSync(
        nodePackager,
        cmdParam.concat(packageName),
        { cwd: api.resolve.capacitor(''), env: { ...process.env, NODE_ENV: 'development' } },
        () => warn(`Failed to install ${packageName}`)
    )
}

function capacitorSync(api) {
    const nodePackager = require('@quasar/app/lib/helpers/node-packager')
    const cmdParam = nodePackager === 'npm'
        ? ['install', '--save-dev']
        : ['add', '--dev']

    const system = {
        _platform: process.platform
    };

    system.win = system._platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';
    system.mac = system._platform === 'darwin';

    if (system.mac) {
        log(`🌪 Running 'npx capacitor sync'...`)
        spawnSync(
            'npx',
            ['cap', 'sync'],
            { cwd: api.resolve.capacitor(''), env: { ...process.env, NODE_ENV: 'development' } },
            () => warn(`Failed to sync :(`)
        )
    }
    else {
        log(`🌪 Running 'npx capacitor sync android'...`)
        spawnSync(
            'npx',
            ['cap', 'sync'],
            { cwd: api.resolve.capacitor(''), env: { ...process.env, NODE_ENV: 'development' } },
            () => warn(`Failed to sync :(`)
        )
        warn("😱 You are not using MacOS, if you want to support this plugin for iOS, please run 'npx cap sync' on MacOS")
    }


}

function merge (target, source) {
    for (const key in source) {
        if (key !== 'spinner' && Object(source[ key ]) === source[ key ]) {
            target[ key ] = Object(target[ key ]) !== target[ key ]
                ? {}
                : { ...target[ key ] }

            merge(target[ key ], source[ key ])
        }
        else {
            target[ key ] = source[ key ]
        }
    }
}

function extendJsonFile (file, newData) {
    if (newData !== void 0 && Object(newData) === newData && Object.keys(newData).length > 0) {
        const filePath = file

        // Try to parse the JSON with Node native tools.
        // It will soft-fail and log a warning if the JSON isn't parseable
        //  which usually means we are dealing with an extended JSON flavour,
        //  for example JSON with comments or JSON5.
        // Notable examples are TS 'tsconfig.json' or VSCode 'settings.json'
        try {
            const data = merge({}, fs.existsSync(filePath) ? require(filePath) : {}, newData)

            fs.writeFileSync(
                file,
                JSON.stringify(data, null, 2),
                'utf-8'
            )
        }
        catch(e) {
            warn()
            warn(`Extension(${this.extId}): extendJsonFile() - "${filePath}" doesn't conform to JSON format: this could happen if you are trying to update flavoured JSON files (eg. JSON with Comments or JSON5). Skipping...`)
            warn(`Extension(${this.extId}): extendJsonFile() - The extension tried to apply these updates to "${filePath}" file: ${JSON.stringify(newData)}`)
            warn()
        }
    }
}
function deletePropertyPath (obj, path) {

    if (!obj || !path) {
        return;
    }

    if (typeof path === 'string') {
        path = path.split('.');
    }

    for (var i = 0; i < path.length - 1; i++) {

        obj = obj[path[i]];

        if (typeof obj === 'undefined') {
            return;
        }
    }

    delete obj[path.pop()];
}

function removePathFromJsonFile (file, path) {
        const filePath = file

        // Try to parse the JSON with Node native tools.
        // It will soft-fail and log a warning if the JSON isn't parseable
        //  which usually means we are dealing with an extended JSON flavour,
        //  for example JSON with comments or JSON5.
        // Notable examples are TS 'tsconfig.json' or VSCode 'settings.json'
        try {
            const data = fs.existsSync(filePath) ? require(filePath) : {}

            deletePropertyPath(data, path)


            fs.writeFileSync(
                file,
                JSON.stringify(data, null, 2),
                'utf-8'
            )
        }
        catch(e) {
        }
}

module.exports = {
    checkCapacitorPackageVersion,
    existsCapacitorPackage,
    installCapacitorDependencies,
    removePathFromJsonFile,
    installCapacitorPackage,
    removeCapacitorPackage,
    capacitorSync,
    extendJsonFile
}
