const https = require('https')
const http = require('http')
const URL = require('url')

const PROTOCOLS = {
  'http:': {
    adapter: http,
    agent: new http.Agent({ keepAlive: true })
  },

  'https:': {
    adapter: https,
    agent: new https.Agent({ keepAlive: true })
  }
}

module.exports = function httpRequest ({
  url, 
  token, 
  method = 'GET', 
  data = ''
}) {
  const options = URL.parse(url)

  options.method = method
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }

  if (token) {
    options.headers['kong-admin-token'] = token
  }

  const protocol = PROTOCOLS[options.protocol]
  const adapter = protocol.adapter
  options.agent = protocol.agent

  return new Promise((resolve, reject) => {
    const req = adapter.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk.toString('utf8')))
      res.on('error', reject)
      res.on('end', () => {
        let { statusCode, headers } = res
        let parsedBody = null

        try {
          parsedBody = JSON.parse(body)
        } catch (e) {
          parsedBody = body
        }

        if (statusCode >= 200 && statusCode <= 299) {
          return resolve({ statusCode, headers, body, parsedBody })
        }

        if (statusCode === 401) {
          return reject(`Authentication failed:\n\n\t${parsedBody.message}.\n\nUse -t, --token to pass your RBAC token or credentials.`)
        }

        reject(`Request failed. status: ${statusCode}, body: ${body}`)
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}
