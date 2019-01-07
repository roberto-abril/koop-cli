/* eslint-env mocha */

const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs-extra')
const os = require('os')
const createNewProject = require('../../src/utils/create-new-project')
const addPlugin = require('../../src/utils/add-plugin')

const expect = chai.expect
const temp = path.join(__dirname, 'temp')

let appName

describe('add command', () => {
  before(() => {
    shell.mkdir('-p', temp)
  })

  beforeEach(() => {
    shell.cd(temp)
    appName = `add-command-test-${Date.now()}`
  })

  it('should add a plugin to an app project', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipInstall: true,
        skipGit: true
      }
    )
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      { skipInstall: true }
    )

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)

    shell.rm('-rf', appPath)
  })

  it('should add a plugin published as a scoped module', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipInstall: true,
        skipGit: true
      }
    )
    shell.cd(appPath)

    await addPlugin(
      appPath,
      '@koop/test-provider',
      { skipInstall: true }
    )

    const plugins = await fs.readFile(path.join(appPath, 'src', 'plugins.js'), 'utf-8')
    const expected = [
      "const testProvider = require('@koop/test-provider')",
      'module.exports = [',
      '  testProvider,',
      ']'
    ].join(os.EOL)
    expect(plugins).to.includes(expected)

    shell.rm('-rf', appPath)
  })

  it('should add plugin config if provided', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipInstall: true,
        skipGit: true
      }
    )
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      {
        config: { api: 'api url' },
        skipInstall: true
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig['test-provider']).to.deep.equal({
      api: 'api url'
    })

    shell.rm('-rf', appPath)
  })

  it('should add string plugin config if provided', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipInstall: true,
        skipGit: true
      }
    )
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      {
        config: JSON.stringify({ api: 'api url' }),
        skipInstall: true
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig['test-provider']).to.deep.equal({
      api: 'api url'
    })

    shell.rm('-rf', appPath)
  })

  it('should append the plugin config to the app config if specified', async () => {
    const appPath = path.join(temp, appName)

    await createNewProject(
      temp,
      'app',
      appName,
      {
        skipInstall: true,
        skipGit: true
      }
    )
    shell.cd(appPath)

    await addPlugin(
      appPath,
      'test-provider',
      {
        config: { api: 'api url' },
        appendToRoot: true,
        skipInstall: true
      }
    )

    const appConfig = await fs.readJson(path.join(appPath, 'config', 'default.json'))
    expect(appConfig.api).to.equal('api url')

    shell.rm('-rf', appPath)
  })
})