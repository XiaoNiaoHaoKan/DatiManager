// Inoltra automaticamente gli errori delle route async al middleware di gestione errori.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { asyncHandler };
