import serverless from 'serverless-http'
import expressApp from './server'

// Initialize express app
const app = expressApp()

// Export lambda handler
exports.handler = serverless(app)
