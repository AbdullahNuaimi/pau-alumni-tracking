const handleJWTError = () =>
    new AppError('رمز الدخول غير صالح، يرجى تسجيل الدخول مرة أخرى', 401);
  
  const handleJWTExpiredError = () =>
    new AppError('انتهت صلاحية رمز الدخول، يرجى تسجيل الدخول مرة أخرى', 401);
  
  const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `هذا ${field} مسجل مسبقاً، يرجى استخدام قيمة أخرى`;
    return new AppError(message, 400);
  };
  
  const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `بيانات غير صالحة: ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  
  // Main error handler
  export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Handle specific errors
    let error = { ...err };
    error.message = err.message;
  
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
    // Development vs Production errors
    if (process.env.NODE_ENV === 'development') {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack
      });
    } else {
      // Production
      if (error.isOperational) {
        res.status(error.statusCode).json({
          status: error.status,
          message: error.message
        });
      } else {
        console.error('ERROR 💥', error);
        res.status(500).json({
          status: 'error',
          message: 'حدث خطأ غير متوقع!'
        });
      }
    }
  };