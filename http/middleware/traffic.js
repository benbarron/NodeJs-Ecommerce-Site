module.exports = (req, res, next) => {
  req.startTime = new Date().getTime();

  res.on('finish', async () => {
    const traffic = new db.Traffic();

    var id = req.user ? req.user._id : '';

    traffic.ip = req.connection.remoteAddress || 'no ip available';
    traffic.deviceType = req.device.type;
    traffic.deviceModel = '';
    traffic.method = req.method;
    traffic.path = req.path;
    traffic.requestTime = new Date().getTime() - req.startTime;
    traffic.user = id;

    await traffic.save();
  });

  next();
};
