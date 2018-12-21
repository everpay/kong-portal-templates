const request = require('./request')
const URL = require('url')

module.exports = function getFiles ({url: requestURL, workspace, token, type}) {
  let url = `${requestURL}/files`
  
  if (workspace) {
    url = new URL(workspace, url)
  }

  if (type) {
    url += `?type=${type}`
  }

  return Promise.resolve()
    .then(() => request({ url, token }))
    .then((res) => JSON.parse(res.body))
}