import Redis from "ioredis"

const port = process.env['REDIS_PORT'] ?? '6379'
const host = process.env['REDIS_HOST'] ?? 'localhost'

const redisClient = new Redis(Number(port), host)

export default redisClient