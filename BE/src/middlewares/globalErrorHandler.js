const  globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
  // Do not call next() after sending a response - the request cycle is complete
}

export default globalErrorHandler;