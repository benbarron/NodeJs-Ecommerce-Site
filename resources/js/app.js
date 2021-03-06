import axios from 'axios';

const loginFormEL = document.querySelector('#login-form');
const registerFormEL = document.querySelector('#register-form');

if (loginFormEL) {
  loginFormEL.addEventListener('submit', e => {
    e.preventDefault();

    var username = document.querySelector('#login-username').value;
    var password = document.querySelector('#login-password').value;

    if (!username || !password) {
      return toastr.error('Please enter all fields');
    }

    axios
      .post('/auth/login', { userfield: username, password })
      .then(res => {
        if (res.data.userIsAdmin) {
          window.location.href = '/admin?success_msg=Login Successful';
        } else {
          window.location.href =
            window.location.href.split('?')[0] +
            '?success_msg=Login Successful';
        }
      })
      .catch(err => {
        if (err.response.data.error_msg) {
          return toastr.error(err.response.data.error_msg);
        }
      });
  });
}

if (registerFormEL) {
  registerFormEL.addEventListener('submit', e => {
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
      .post('/auth/register', {
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

  const clearQueryString = () => {
    if (history.pushState) {
      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname;

      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };

  if (urlParams.has('success_msg')) {
    toastr.success(urlParams.get('success_msg'));

    clearQueryString();
  }

  if (urlParams.has('error_msg')) {
    toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';

    toastr.error(urlParams.get('error_msg'));

    clearQueryString();
  }

  if (urlParams.has('warning_msg')) {
    toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';

    toastr.warning(urlParams.get('warning_msg'));

    clearQueryString();
  }
});
