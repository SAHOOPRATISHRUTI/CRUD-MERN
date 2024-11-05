const failResponse = (req, res, data, message, status = 500) => { 
    return res.status(status).json({
        error: true,
        success: false,
        message: message || 'An error occurred',
        data: data || null,
    });
};

const successResponse = (req, res, data, message, status = 200) => { 
    return res.status(status).json({
        error: false,
        success: true,
        message: message || 'Success',
        data: data || null,
    });
};

const errorResponse = (req, res, errorDesc, errorKey = 500) => {
    const statusCode = errorKey; 
    return res.status(statusCode).send({
        error: true,
        success: false,
        message: errorDesc.message || 'An unexpected error occurred.',
        data: null,
    });
};

module.exports = {
    failResponse,
    successResponse,
    errorResponse,
};
