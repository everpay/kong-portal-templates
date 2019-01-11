#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program.version(pkg.version)

const fetchFiles = require('./helpers/fetch-files')
const saveFile = require('./helpers/save-file')

program
  .command('pull [url]')
  .description('Fetch files from a Kong cluster')
  .option('-w, --workspace <workspace>', 'Workspace to download files from')
  .option('-d, --directory <directory>', 'Directory files will be synced to, by default this will be: ./default/')
  .option('-t, --token <token>', 'RBAC Authorization Token')
  .action(async (url, { token, directory = './default/', workspace = 'default' }) => {
    Promise.resolve()
      .then(() => console.log(`[Pulling] ${url}/${workspace}`))
      .then(() => fetchFiles({ url, workspace, token }))
      .then(files => Promise.all(files.data.map(file => saveFile({ file, directory }))))
      .catch(error => console.log(error))
  })
 
program.parse(process.argv)