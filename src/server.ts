import http from "http"
import dotenv from "dotenv"
dotenv.config()

import { app } from "./app"

// create server for connection
export const server = http.createServer(app)