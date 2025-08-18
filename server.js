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
// import { log } from 'console'


const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

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

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)

// REST API for Toys
// app.get('/api/toy', (req, res) => {
//     const filterBy = {
//         txt: req.query.txt || '',
//         maxPrice: +req.query.maxPrice || 0,
//         labels: req.query.labels || [],
//         inStock: req.query.inStock || undefined,
//         sortField: req.query.sortField || '',
//         sortDir: +req.query.sortDir || 1,
//     }
//     toyService.query(filterBy)
//         .then(toys => res.send(toys))
//         .catch(err => {
//             logger.error('Cannot get toys', err)
//             res.status(400).send('Cannot get toys')
//         })
// })

// app.get('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.getById(toyId)
//         .then(toy => res.send(toy))
//         .catch(err => {
//             logger.error('Cannot get toy', err)
//             res.status(400).send('Cannot get toy')
//         })
// })

// app.post('/api/toy', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // if (!loggedinUser) return res.status(401).send('Cannot add toy')

//     const toy = {
//         name: req.body.name,
//         price: +req.body.price,
//         inStock: req.body.inStock === 'true',
//         labels: req.body.labels,
//         imgUrl: req.body.imgUrl,
//     }
//     toyService.save(toy, loggedinUser)
//         .then(savedToy => res.send(savedToy))
//         .catch(err => {
//             logger.error('Cannot save toy', err)
//             res.status(400).send('Cannot save toy')
//         })
// })

// app.put('/api/toy/:id', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // if (!loggedinUser) return res.status(401).send('Cannot update toy')

//     const toy = {
//         _id: req.params.id,
//         name: req.body.name,
//         price: +req.body.price,
//         inStock: (req.body.inStock === true || req.body.inStock === 'true') ? true : false,
//         labels: req.body.labels,
//         imgUrl: req.body.imgUrl,
//         createdAt: req.body.createdAt,
//     }
//     toyService.save(toy, loggedinUser)
//         .then(savedToy => res.send(savedToy))
//         .catch(err => {
//             logger.error('Cannot save toy', err)
//             res.status(400).send('Cannot save toy')
//         })
// })

// app.delete('/api/toy/:toyId', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // console.log('loggedinUser:', loggedinUser)
//     // if (!loggedinUser) return res.status(401).send('Cannot remove toy')

//     const { toyId } = req.params
//     toyService.remove(toyId, loggedinUser)
//         .then(() => res.send('Removed!'))
//         .catch(err => {
//             logger.error('Cannot remove toy', err)
//             res.status(400).send('Cannot remove toy')
//         })
// })

// // User API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then(users => res.send(users))
//         .catch(err => {
//             logger.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })



// app.get('/api/user/:userId', (req, res) => {
//     const { userId } = req.params

//     userService.getById(userId)
//         .then(user => res.send(user))
//         .catch(err => {
//             logger.error('Cannot load user', err)
//             res.status(400).send('Cannot load user')
//         })
// })

// // Auth API
// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body
//     console.log('🚀 ~ app.post ~ credentials:', credentials)

//     userService.checkLogin(credentials)
//         .then(user => {
//             console.log('user:', user)
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
//         .catch(err => {
//             logger.error('Cannot login', err)
//             res.status(400).send('Cannot login')
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body

//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 res.status(400).send('Cannot signup')
//             }
//         })
//         .catch(err => {
//             logger.error('Cannot signup', err)
//             res.status(400).send('Cannot signup')
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })

// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser)
//         .then(user => {
//             const token = userService.getLoginToken(user)
//             res.cookie('loginToken', token)
//             res.send(user)
//         })
//         .catch(err => {
//             logger.error('Cannot edit user', err)
//             res.status(400).send('Cannot edit user')
//         })
// })


// Fallback route
app.get('/*all', (req, res) => {
    console.log('path not found')
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    logger.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
