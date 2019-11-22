import axios from 'axios';

if (document.querySelector('#login-form')) {
  document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();

    var username = document.querySelector('#login-username').value;
    var password = document.querySelector('#login-password').value;

    if (!username || !password) {
      return toastr.error('Please enter all fields');
    }

    axios
      .post('/api/login', { userfield: username, password })
      .then(res => {
        window.location.href =
          window.location.href.split('?')[0] + '?success_msg=Login Successful';
        // console.log('success');
      })
      .catch(err => {
        if (err.response.data.error_msg) {
          return toastr.error(err.response.data.error_msg);
        }
      });

    console.log(username, password);
  });
}

if (document.querySelector('#register-form')) {
  document.querySelector('#register-form').addEventListener('submit', e => {
    e.preventDefault();

    var firstnameEL = document.querySelector('#register-firstname');
    var lastnameEL = document.querySelector('#register-lastname');
    var emailEL = document.querySelector('#register-email');
    var usernameEL = document.querySelector('#register-username');
    var password1EL = document.querySelector('#register-password1');
    var password2EL = document.querySelector('#register-password2');

    var firstname = firstnameEL.value;
    var lastname = lastnameEL.value;
    var email = emailEL.value;
    var username = usernameEL.value;
    var password1 = password1EL.value;
    var password2 = password2EL.value;

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
        firstnameEL.value = '';
        lastnameEL.value = '';
        emailEL.value = '';
        usernameEL.value = '';
        password1EL.value = '';
        password2EL.value = '';

        toastr.success(res.data.success_msg);
      })
      .catch(err => {
        if (err.response.data.error_msg) {
          toastr.error(err.response.data.error_msg);
        }
      });

    // console.log({ firstname, lastname, email, username, password1, password2 });
  });
}

document.addEventListener('DOMContentLoaded', e => {
  const urlParams = new URLSearchParams(window.location.search);

  const clearQuery = () => {
    if (history.pushState) {
      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname;

      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  if (urlParams.has('success_msg')) {
    toastr.success(urlParams.get('success_msg'));

    clearQuery();
  }

  if (urlParams.has('error_msg')) {
    toastr.error(urlParams.get('error_msg'));

    clearQuery();
  }
});
