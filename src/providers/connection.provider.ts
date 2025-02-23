import { prisma } from "../database/connection";
import { server } from "../server";
import redisClient from "../utils/redisHelper";

const PORT = process.env.PORT || 7778;

const startServer = async () => {
    try {
        redisClient.on("connect", () => {
            console.log("Redis connected successfully");
        })
        redisClient.on("error", (error) => {
            console.log("Error connecting to Redis", error);
        })
        await prisma.$connect()
        console.log("Database connected successfully")
        server.listen(PORT as number, () => {
            console.log(`Server started on port ${PORT}`)
        });
    } catch (error) {
        console.log("Error connecting to database", error)
    }
}

startServer()