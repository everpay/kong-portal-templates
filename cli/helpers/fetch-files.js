const request = require('./request')
const URL = require('url')

const fetchFiles = async ({ url: requestURL, workspace, token, type }) => {
  let records = []
  let fetching = true
  let offset = null
  let url = `${requestURL}`

  url += workspace ? `/${workspace}` : ``
  url += `/files?size=100`
  url += type ? `&type=${type}` : ``

  while (fetching) {
    let res = await request({ url, token })
    records = records.concat(res.parsedBody.data)
    offset = res.offset

    if (!offset) {
      fetching = false
      return { data: records }
    }
  }
}

module.exports = fetchFiles
