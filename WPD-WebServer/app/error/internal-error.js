function internalError(req, res) {
  res.status(500)
  res.send('Internal Server Error')
}

module.exports = internalError