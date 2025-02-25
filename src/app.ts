import "./providers/connection.provider"
import "./utils/seeder"

import cors from 'cors'
import morgan from 'morgan'
import express, { Express } from 'express'

import rateLimiter from "./middlewares/rateLimiter"
import routes from './routes'
import corsOptions from "./utils/corsOptions"
import handler from "./utils/handler"

export const app: Express = express()

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(rateLimiter())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', routes)

app.use(handler.unHandledRouteHandler)
app.use(handler.globalErrorHandler)