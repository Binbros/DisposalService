import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

export default function db() {
    mongoose.connect( url, {useNewUrlParser: true}).catch(err=> console.error(err));
};