import axios from 'axios';

document.querySelector('#login-form').addEventListener('submit', e => {
  e.preventDefault();

  var username = document.querySelector('#login-username').value;
  var password = document.querySelector('#login-password').value;

  if (!username || !password) {
    return toastr.error('Please enter all fields');
  }

  console.log(username, password);
});

document.querySelector('#register-form').addEventListener('submit', e => {
  e.preventDefault();

  var firstname = document.querySelector('#register-firstname').value;
  var lastname = document.querySelector('#register-lastname').value;
  var email = document.querySelector('#register-email').value;
  var username = document.querySelector('#register-username').value;
  var password1 = document.querySelector('#register-password1').value;
  var password2 = document.querySelector('#register-password2').value;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !username ||
    !password1 ||
    !password2
  ) {
    return toastr.error('Please enter all fields');
  }

  if (password1 !== password2) {
    return toastr.error('Passwords do not match');
  }

  if (password1.length < 6) {
    return toastr.error('Your password is too short');
  }

  axios
    .post('/api/register', {
      firstname,
      lastname,
      email,
      username,
      password: password1
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      if (err.response.data.error_msg) {
        toastr.error(err.response.data.error_msg);
      }
    });

  console.log({ firstname, lastname, email, username, password1, password2 });
});
