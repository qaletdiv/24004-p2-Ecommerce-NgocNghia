const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const requestLoggerMiddleware = require('./middlewares/requestLoger.js');
const errorHandlerMiddleware = require('./middlewares/errorHandler.js'); 

const config = require('./config/config.js');
const db = require('./models');

const PORT = config.PORT || 3000;

// Middleware to parse JSON requests
app.use(requestLoggerMiddleware);
app.use(express.json());

app.use ('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use(errorHandlerMiddleware);

db.sequelize.authenticate() 
    .then(() => {
        console.log('Kết nối cơ sở dữ liệu thành công');
    })
    .catch(err => {
        console.error('Không thể kết nối cơ sở dữ liệu:', err);
    });

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});