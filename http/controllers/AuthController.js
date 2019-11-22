const bcrypt = require('bcryptjs');

const { User } = model;

class AuthController {
  async login(req, res) {
    const { userfield, password } = req.body;

    let user = await User.findOne({
      $or: [{ email: userfield }, { username: userfield }]
    });

    if (!user) {
      return res
        .status(401)
        .json({ error_msg: "There isn't an account with that email." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error_msg: 'Invalid credentials' });
    }

    req.login(user, err => {
      if (err) {
        return res.status(401).json({
          error_msg: 'There was an error logging you in'
        });
      }

      return res
        .status(200)
        .json({ success_msg: 'success', userIsAdmin: user.isAdmin });
    });
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
    const hashedPassword = await bcrypt.hash(password, salt);

    // console.log({ firstname, lastname, email, username, hashedPassword });

    const user = new User({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      isAdmin: false
    });

    await user.save();

    return res.status(200).json({
      success_msg: 'Your account has been created! You can now log in.'
    });
  }

  async logout(req, res) {
    req.logout();

    var redirect = req.query['redirect_to'];

    if (!redirect) {
      redirect = '/';
    }

    return res.redirect(`${redirect}?success_msg=Logout Successful`);
  }
}

module.exports = AuthController;
