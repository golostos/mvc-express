function promiseError(error, statusCode = 500) {
    error = (typeof error === 'string') ? new Error(error) : error;
    if (error instanceof Error) {
        error.statusCode = statusCode;
        return Promise.reject(error);
    } else {
        const e = new Error('Server error');
        e.statusCode = 500;
        return Promise.reject(e);
    }
}

module.exports = {
    promiseError
}