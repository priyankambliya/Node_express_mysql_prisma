import rateLimit from 'express-rate-limit'

const rateLimiter = () => {

    let time = process.env['RATELIMIT_TIME'] ?? 15 * 60 * 1000
    let request = process.env['RATELIMIT_REQUEST'] ?? 100

    return rateLimit({
        windowMs: Number(time),
        max: Number(request),
        message: 'Too many requests from this IP, please try again after 15 minutes',
    })
}

export default rateLimiter