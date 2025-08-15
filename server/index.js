import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import connectDB from './database/db.js';
import userRoutes from './routes/user.router.js';
import adminRoutes from './routes/admin.router.js';
import cookieParser from 'cookie-parser';
import oclmedicalroutes from './routes/oclmedical.router.js';
import dailymedicalroutes from './routes/dailymedical.routes.js'
import injurydata from './routes/injury.router.js'
import path from "path";
import { connectAllUserDBs } from './models/dbconnection.js';
import ftemedicalrouter from './routes/FTEmedical.router.js';
import request from './routes/request.router.js';
// import { sequelize } from './database/sqldb.js'; // to use sequelize.sync()


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://ttv6h7ww-5173.inc1.devtunnels.ms'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes); // Use the user routes
app.use('/api/v1/oclmedical', oclmedicalroutes); // Use the oclmedical routes
app.use('/api/v1/dailymedical', dailymedicalroutes); // Use the dailymedical route
app.use('/api/v1/injurydata', injurydata); // Use the dailymedical route
app.use('/api/v1/FTEmedical', ftemedicalrouter); // Use the FTEmedical routes
app.use('/api/v1/request', request); // Use the request routes


// app.use(express.static(path.join(__dirname,"client", "dist")))

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname,"client", "dist", "index.html"));
// });


app.listen(PORT,async()=>{
    try {
        await connectAllUserDBs(); // MySQL connection check
        console.log('✅ MySQL connected');
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    } catch (err) {
        console.error('❌ Unable to connect to the database:', err);
    }

})

