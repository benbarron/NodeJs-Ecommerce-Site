const cluster = require('cluster');
const os = require('os');
const https = require('http');
const http = require('http');
const fs = require('fs');

require('./lib/bootstrap')(__dirname);

const app = require('./app');

if (env('mode') === 'PRODUCTION') {
  if (cluster.isMaster) {
    var cpus = os.cpus();

    for (let i = 0; i < cpus.length; i++) {
      cluster.fork();
    }

    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    const options = {
      key: fs.readFileSync('./keys/key.pem'),
      cert: fs.readFileSync('./keys/cert.pem')
    };

    https
      .createServer(options, app)
      .listen(443, () => success(`Https server started on port: ${443}`));

    http
      .createServer(app)
      .listen(80, () => success(`Http server started on port ${80}`));
  }
} else {
  const port = env('port');

  app.listen(port, () => success(`Development server started on port ${port}`));
}
