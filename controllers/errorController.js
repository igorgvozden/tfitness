const errorHandler = (err, req, res, next) => { // kada ovako definises middleware sa err kao prvim parametrom, express zna da je rec o error middleware
    console.log(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    next();
};

module.exports = errorHandler;