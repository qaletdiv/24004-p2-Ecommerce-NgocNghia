function errorHandlerMiddleware(err, req, res, next) {
    console.error(`Error: ${err.stack}`);
    res.status(500).send("Loi server. Vui long thu lai sau !!!");
}

module.exports = errorHandlerMiddleware;