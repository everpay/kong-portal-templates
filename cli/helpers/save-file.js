const determineSpecExtension = require('./determine-spec-extension')
const {readFileSync, writeFileSync} = require('fs')

module.exports = ({ file, directory }) => {
  let fileName = file.name
  let contents = file.contents + '\n'
  let fileType = file.type + 's/'
  let extension = file.type === 'spec'
    ? determineSpecExtension(contents)
    : '.hbs'

  if (extension === '' || !extension) {
    return promise.reject(`Error: unable to determine extension of ${fileName}`)
  }

  let filePath = (directory + fileType + fileName + extension)
  let message = ''

  try {
    let localContents = readFileSync(filePath, 'utf8')
    if (localContents !== contents) {
      message = `File Updated: ${filePath}`
    }
  } catch (e) {
    message = `File Created: ${filePath}`
  }

  try {
    writeFileSync(filePath, contents, {flag: 'w'})
    return Promise.resolve(message)
  } catch (e) {
    return Promise.reject(`Pull Failed! Unable to write file: ${filePath}\n\n\t${e.message}`)
  }
}