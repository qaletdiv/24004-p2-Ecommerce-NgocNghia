/// security
const helmet = require('helmet');
/// Limit access
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productImageRoutes = require('./routes/productImageRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes.js');

const session = require('express-session');
/// Middleware cookie parser
const cookieParser = require('cookie-parser');

/// Library directly use
const MySQLStore = require('express-mysql-session')(session);

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
app.use(cookieParser());


const dbConfig = config[config.env];
const sessionStoreOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    /// Thời gian clear cookie trong database
    clearExpired: true,
    /// Kiểm tra expire
    checkExpirationInterval: 1000 * 60 * 10,
    /// Thời gian hết hạn
    expiration: 1000 * 60 * 60 * 24,
    createDatabaseTable: false,
}
const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(session({
    secret: config.sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        /// set cứng cookie
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, ///1 ngày hết cookie
        secure: process.env.NODE_ENV === 'production',

    }
}));

app.get('/set-cookie', (req,res) => {
    res.cookie('username', 'guest');
    res.cookie ('language', 'vietnamese', {maxAge: 1000 * 60 * 15}); /// Thời gian hết hạn cho vietnamese
    res.cookie('data', 'someToken123', {
        httpOnly: true,
        secure: true,
        /// không cho những thằng khác lấy cookie
        sameSite: 'strict'
    })

    res.json({message: "Cookies have been set!"})
});


/// Thiết kế API
app.get('/read-cookie', (req,res) => {
    /// Parse cookie
    const username = req.cookies.username;
    const language = req.cookies.language;
    const data = req.cookies.data;

    console.log("Cookies: ", req.cookies);

    res.json ({
        message: "Get Cookies"
    })
})

/// Khi Token hết hạn (người dùng đăng xuất) => clear cookie

app.get('/clear-cookie', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('language');
    res.clearCookie('data');

    /// Clear cookie có thể thêm option để clear
    /* Sử dụng option phải bằng lúc set lúc set sao thì clear giống vậy 
    Clear trong trường hợp path với domain là cự kì clear 
    */
     res.json ({
        message: "Clear Cookies"
    })
})

app.use('/api/account', accountRoutes);
app.use ('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/productImage', productImageRoutes);
app.use ('/api/session', sessionRoutes);
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