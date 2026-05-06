function errorHandler(error, req, res, next) {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "Une erreur inconnue " });
}

export default errorHandler;
