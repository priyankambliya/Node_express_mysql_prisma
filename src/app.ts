import "./providers/connection.provider"
import express, { Express, Request, Response } from 'express'
import cors from 'cors'

import routes from './routes'
import handler from "./utils/handler"
import rateLimiter from "./middlewares/rateLimiter"
import corsOptions from "./utils/corsOptions"

export const app: Express = express()

app.use(cors(corsOptions))
app.use(rateLimiter())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/ping', (req: Request, res: Response): any => res.send('pong'))
app.use('/api', routes)

app.use(handler.unHandledRouteHandler)
app.use(handler.globalErrorHandler)