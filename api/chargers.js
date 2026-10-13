const { chargersAt, SITE_CANDIDATES } = require('../shared/lincah');

module.exports = function handler(req, res) {
  const q = req.query || {};
  const h = parseInt(q.hour, 10);
  const hour = Number.isFinite(h) && h >= 0 && h <= 23 ? h : new Date().getHours();
  res.status(200).json({ hour, stations: chargersAt(hour), sites: SITE_CANDIDATES });
};
