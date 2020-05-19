import redis from "node-redis";
import logger from "./logger";
import secret from "./secret";
const redisClient = redis.createClient(secret.RedisURL);

redisClient.on("connect", () => {
    logger.warn("Redis connected");
});
redisClient.on("error", () => {
    logger.error("Redis not connected");
});
export default redisClient;
