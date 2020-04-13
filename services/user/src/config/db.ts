import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../utils/logger";

dotenv.config();

const url = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";

export default function db() {
    mongoose.connect( url, {useNewUrlParser: true}).catch((err) => logger.error(err));
}
