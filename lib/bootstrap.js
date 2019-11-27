const fs = require('fs');
const path = require('path');
const colors = require('colors');

module.exports = dir => {
  // load enviormental variables -------------------------------------------------------
  var obj = JSON.parse(
    fs.readFileSync(path.resolve(dir, 'config/settings.json'), 'utf-8')
  );

  for (const key of Object.keys(obj)) {
    process.env[key] = obj[key];
  }

  global.env = name => {
    if (process.env[name]) {
      return process.env[name];
    }

    throw colors.red('Enviormental variable not found');
  };

  // load models -------------------------------------------------------
  const models = fs.readdirSync(path.resolve(dir, 'http/models'));
  global.db = {};

  for (let i = 0; i < models.length; i++) {
    let name = models[i].split('.')[0];
    global.db[name] = require(path.resolve(dir, 'http/models', name));
  }

  // load middleware -------------------------------------------------------
  const mware = fs.readdirSync(path.resolve(dir, 'http/middleware'));
  global.mware = {};

  for (var i = 0; i < mware.length; i++) {
    let name = mware[i].split('.')[0];
    global.mware[name] = require(path.resolve(dir, 'http/middleware', name));
  }

  // read in interfaces
  const interfaces = fs.readdirSync(path.resolve(dir, 'http', 'interfaces'));

  global.interfaces = {};

  for (let i = 0; i < interfaces.length; i++) {
    let name = interfaces[i].split('.')[0];
    global.interfaces[name] = require(path.resolve(
      dir,
      'http/interfaces',
      name
    ));
  }

  // set colored console logs -------------------------------------------
  global.success = msg => console.log(colors.green(msg));
  global.info = msg => console.log(colors.blue(msg));
  global.error = msg => console.log(colors.red(msg));
  global.warning = msg => console.log(colors.yellow(msg));
};
