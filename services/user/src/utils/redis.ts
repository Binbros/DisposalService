import redis from "redis";
import logger from "./logger";
const redisClient = redis.createClient({ host: process.env.REDIS_PORT,
     port: Number(process.env.REDIS_PORT), retry_strategy: () => 1000 });
// process.env.REDIS_URL is the redis url config variable name on heroku.
// if local use redis.createClient()
redisClient.on("connect", () => {
    logger.warn("Redis client connected");
});
redisClient.on("error", (error: string) => {
    logger.error(error);
});
export default redisClient;