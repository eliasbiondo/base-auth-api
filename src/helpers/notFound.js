module.exports = (req, res) => {
    res.status(404).json({status: 404, error: 'not found'})
}