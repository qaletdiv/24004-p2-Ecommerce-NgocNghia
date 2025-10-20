/// Middlewares to handle errors in the application
function errorHandlerMiddleware(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = errorHandlerMiddleware;