const fs = require('fs')
const path = require('path')

const Logger = require('./src/cli/logger')
const getFiles = require('./src/cli/get-files')
const terminal = require('./src/cli/terminal')
const render = require('./src/cli/render')
const watch = require('./src/cli/watch')
const server = require('./src/cli/server')
const getSuites = require('./src/cli/get-suites')
const getDescription = require('./src/cli/get-description')

module.exports = async (args) => {
  const logger = Logger(args.noColor)
  console.log({args})
  const results = args.results
  if (!fs.existsSync(results) && !args.xml ) {
    const { showHelp } = require('./src/cli/args')
    showHelp()
    console.log(logger.error('\n The folder/file:'), logger.file(results), logger.error('does not exist'))
    process.exit(1)
  }

  const runXunitViewer = async () => {
    const files = args.xml ? [{file:'text content', contents: args.xml}] : getFiles(logger, args)
    const suites = await getSuites(logger, files)
    const description = getDescription(suites)
    if (args.console) terminal(suites, logger, description, args)
    else{
      const result = render(logger, files, description, args)
      if (typeof args.output === 'string') {
        const outputFile = path.resolve(process.cwd(), args.output)
        fs.writeFileSync(outputFile, result)
        console.log('Written to:', logger.file(outputFile))
      }
      else {
        console.log('returning result ', {result})
        return result
      }
    }
  }

  if (args.console ) return await runXunitViewer()
  if (args.server || args.port) server(logger, args)
  else if (args.watch) {
    watch(args, async () => {
      await runXunitViewer()
    })
  }
}
