const path = require('path')
const fs = require('fs-extra')
const latestVersion = require('latest-version')
const { addDependency } = require('../manage-dependencies')
const writeJson = require('../write-formatted-json')

/**
 * Add the given plugin from NPM.
 * @param {string} cwd     app directory
 * @param {string} type    plugin type
 * @param {Object} plugin  plugin information
 * @param {Object} options options
 */
module.exports = async function addNpmPlugin (cwd, type, plugin, options = {}) {
  if (options.skipInstall) {
    const packageInfoPath = path.join(cwd, 'package.json')
    const packageInfo = await fs.readJson(packageInfoPath)

    let options

    if (plugin.version) {
      options = {
        version: plugin.version
      }
    }

    const pluginVersion = await latestVersion(plugin.fullName, options)
    packageInfo.dependencies[plugin.fullName] = `^${pluginVersion}`

    await writeJson(packageInfoPath, packageInfo)
  } else {
    const moduleName = plugin.versionedFullName || plugin.fullName
    await addDependency(cwd, moduleName, options)
  }
}
