import serverless from 'serverless-http'
import server from './server/server.js'

// We need to define our function name for express routes to set the correct base path
const functionName = 'server'

// Initialize express app
const app = server()

// Export lambda handler
exports.handler = serverless(app)
