import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {connectDb} from './database2/database-orm.js';
import './models-orm-sequelize/index.js';
import router from './routers/index.js';
import './middlewares/auth.js';
import schedule from './cron.js';

dotenv.config();

const app = express();
const PORT = 8080;

await connectDb();

schedule.start();

app.use(cors({
    credentials: true
}));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

router(app);
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
