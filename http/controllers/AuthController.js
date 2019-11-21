const bcrypt = require('bcryptjs');

const { User } = model;

class AuthController {
  async login(req, res) {
    // req.login(user, (err, user, info) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(401).json({
    //       error_msg: 'There was an error logging you in'
    //     });
    //   }
    //   // return res.redirect('/users/create-post');
    // });
  }

  async logout(req, res) {
    req.logout();

    return res.render('Login', {
      success_msg: 'You have been logged out'
    });
  }

  async register(req, res) {
    const { firstname, lastname, email, username, password } = req.body;

    const existingUser = await User.findOne({ username }).or({ email });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(401).json({
          error_msg: 'That email is taken'
        });
      }

      if (existingUser.username === username) {
        return res.status(401).json({
          error_msg: 'That username is taken'
        });
      }

      return;
    }

    const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // console.log({ firstname, lastname, email, username, hashedPassword });
  }
}

module.exports = AuthController;
