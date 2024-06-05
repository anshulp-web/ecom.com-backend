import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import ConnectedDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';
import orderRoute from './routes/orderRoute.js';
import cors from 'cors';

//config env
dotenv.config();

//Mongodb Config Connect DB
ConnectedDB();

const app = express();
//middelware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/order', orderRoute);
//rest api
app.get('/', (req, res) => {
  res.send({
    messages: 'Welcome to ecom.com',
  });
});
const PORT = process.env.PORT || 8080;
//run listen
app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white
  );
});
