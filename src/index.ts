import express from 'express'
import proxy from 'express-http-proxy'
import dotenv from 'dotenv'

dotenv.config()

function getListenPort(env_name: string, fallback: number) {
  const text = process.env[env_name]
  if (text != null) {
    const value = parseInt(text)
    if (String(value) != text) {
      throw new Error('Invalid port number: ' + JSON.stringify(text))
    }
    return value
  }
  return fallback
}

const LISTEN_PORT = getListenPort('LISTEN_PORT', 3000)
const LISTEN_HOST = process.env.LISTEN_HOST || '127.0.0.1'
const VITE_DEV_PORT = getListenPort('VITE_DEV_PORT', 9999)

const app = express()

// Useful things you might want:
//app.use(express.urlencoded({ extended: true }));

// Proxy web requests to the Vite dev server.
if (process.env.DEV_CLIENT_SERVER) {
  app.use(proxy(`http://localhost:${VITE_DEV_PORT}`))
}

app.listen(LISTEN_PORT, LISTEN_HOST, () => {
  console.log(`Listening on ${LISTEN_HOST}:${LISTEN_PORT}`)
  console.log(`http://localhost:${LISTEN_PORT}`)
})
