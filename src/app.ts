import "./providers/connection.provider"
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'

import routes from './routes'
import handler from "./utils/handler"
import rateLimiter from "./middlewares/rateLimiter"
import corsOptions from "./utils/corsOptions"

export const app: Express = express()

app.use(session({
    secret: process.env['SESSION_SECRET'] as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}))

app.use(cors(corsOptions))
app.use(rateLimiter())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/ping', (req: Request, res: Response): any => res.send('pong'))
app.use('/api', routes)

app.use(handler.unHandledRouteHandler)
app.use(handler.globalErrorHandler)