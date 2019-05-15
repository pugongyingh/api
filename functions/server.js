import serverless from 'serverless-http'
import expressApp from './server/server.js'

// Initialize express app
const app = expressApp()

// Export lambda handler
exports.handler = serverless(app)
