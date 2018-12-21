const fileTypes = {
  YAML: '.yaml',
  JSON: '.json'
}

module.exports = function getSpecExtension (content) {
  content = typeof content !== 'string'
    ? JSON.stringify(content)
    : content

  try {
    content = JSON.parse(content)
  } catch (e) {
    return fileTypes.YAML
  }

  if (typeof content === 'object' && content !== null) {
    return fileTypes.JSON
  }

  return ''
}