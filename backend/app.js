/// security
const helmet = require('helmet');

/// Limit access
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const app = express();

const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productImageRoutes = require('./routes/productImageRoutes.js');

const requestLoggerMiddleware = require('./middlewares/requestLogger.js');
const errorHandlerMiddleware = require('./middlewares/errorHandler.js');

const config = require('./config/config.js');
const db = require('./models');
const { maxHeaderSize } = require('http');
const PORT = config.PORT || 3000;

app.use(requestLoggerMiddleware);

/// setup security
app.use(helmet());
const limiter = rateLimit({
    /// limit IP to 100 request per window
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: "Too many request this IP, please try again in 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter);

app.use(express.static(path.join(__dirname, 'images')));
app.use(express.json());


app.use('/api/account', accountRoutes);
app.use ('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/productImage', productImageRoutes);
/// Error handling middleware
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