import express from 'express'
import cookieParser from 'cookie-parser'
import path, { dirname } from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// import { toyService } from './services/toy.service.js'
// import { userService } from './services/user.service.js'
import { logger } from './services/logger.service.js'

import { toyRoutes } from './api/toy/toy.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
import { setupSocketAPI } from './services/socket.service.js'
import http from 'http'



// import { log } from 'console'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

const server = http.createServer(app)

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    // Make sure origin contains the url 
    // your frontend dev-server is running on
    const corsOptions = {
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.all('*all', setupAsyncLocalStorage)

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)

setupSocketAPI(server)


// Fallback route
app.get('/*all', (req, res) => {
    console.log('path not found')
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
server.listen(PORT, () =>
    logger.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
