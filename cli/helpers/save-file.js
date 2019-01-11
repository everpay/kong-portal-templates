const determineSpecExtension = require('./determine-spec-extension')
const {readFileSync, outputFileSync} = require('fs-extra')

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
  let message = `[skip] ${filePath}`

  try {
    let localContents = readFileSync(filePath, 'utf8')
    if (localContents !== contents) {
      message = `[updated] ${filePath}`
    }
  } catch (e) {
    message = `[created] ${filePath}`
  }

  try {
    outputFileSync(filePath, contents)
    return console.log(message)
  } catch (e) {
    return Promise.reject(`Pull Failed! Unable to write file: ${filePath}\n\n\t${e.message}`)
  }
}