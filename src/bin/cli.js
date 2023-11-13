const { execSync } = require('child_process')
const logger = require('~/config/logger')
const path = require('path')
const { program } = require('commander')

export const initCLI = (program) => {
  program
    .version('1.0.0')
    .description('A CLI tool for import and export data')
    .arguments('<action>')
    .action((action) => {
      const actions = {
        import: 'importData.js',
        export: 'databaseDaily.js'
      }
      if (!actions[action]) {
        logger.error('Please provide a valid action (import or export).')
        process.exit(1)
      }
      const scriptPath = path.join(__dirname, `../data/${actions[action]}`)
      try {
        execSync(`babel-node ${scriptPath}`, { stdio: 'inherit' })
      } catch (error) {
        logger.error(`Error executing the command: ${error.message}`)
        process.exit(1)
      }
    })
    .parse(process.argv)
}

initCLI(program)

