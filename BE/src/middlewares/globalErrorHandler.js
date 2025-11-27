const  globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
  next();
}

export default globalErrorHandler;