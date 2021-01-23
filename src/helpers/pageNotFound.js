module.exports = (req, res) => {
  res.status(400).json({
    status: 404,
    error: "page not found",
  });
};
