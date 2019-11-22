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

    clearQuery();
  }

  if (urlParams.has('error_msg')) {
    toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';

    toastr.error(urlParams.get('error_msg'));

    clearQuery();
  }
});

if (document.querySelector('#options-area')) {
  const optionsAreaEL = document.querySelector('#options-area');

  var i = 0;

  document.querySelector('#add-option-btn').addEventListener('click', e => {
    e.preventDefault();

    var el = document.createElement('div');
    el.className = `row row-${i}`;

    var out = `
          <div class="col-sm-12">
            <div class="mb-2 row">
              <div class="col-sm-2">
                ${
                  i == 0
                    ? `<label for='option-${i}-name'>Option Name</label>`
                    : ''
                }
                <input type="text" class="form-control form-control-sm" aria-label="Small" id="option-${i}-name" name="option-${i}-name" placeholder="Option Name">

              </div>
              <div class="col-sm-5">
                ${
                  i == 0
                    ? `<label for='option-${i}-method'>Option Display Method</label>`
                    : ''
                }
                <select name="option-${i}-method" id="option-${i}-method" class="form-control form-control-sm" aria-label="Small">
                  <option value="dropdown" class="form-control  form-control-sm">Dropdown</option>
                  <option value="radio-buttons"  class="form-control form-control-sm">Radio Buttons</option>
                </select>
              </div>
            <div class="col-sm-5">
              ${
                i == 0
                  ? `<label for='option-${i}-values'>Option Values</label>`
                  : ''
              }
              <input type="text" class="form-control form-control-sm" aria-label="Small" id="option-${i}-values" name="option-${i}-values" placeholder="Values (Enter in comma separated list)">
            </div>

          </div>
          <hr>
        </div>
    `;

    el.innerHTML = out;

    optionsAreaEL.appendChild(el);

    out = '';
    i += 1;
  });

  document.querySelector('#remove-option-btn').addEventListener('click', e => {
    e.preventDefault();

    document.querySelector(`.row-${i - 1}`).remove();

    i -= 1;
  });
}

if (document.querySelector('#product-images')) {
  var k = 0;
  document.querySelector('input#file-1').addEventListener('change', e => {
    e.preventDefault();

    let formData = new FormData();

    formData.append('image', e.target.files[0]);

    const headers = {
      'Content-Type': 'multipart/form-data'
    };

    axios
      .post('/api/accept-images', formData, headers)
      .then(res => {
        var inputEL = document.createElement('input');
        inputEL.name = 'file-' + k;
        inputEL.value = res.data.path;
        inputEL.type = 'hidden';
        document.querySelector('#image-inputs').appendChild(inputEL);

        var imageEL = document.createElement('img');
        imageEL.src = res.data.path;
        imageEL.className = 'col-sm-2 my-3';

        var removeIcon = document.createElement('i');
        removeIcon.className = 'fas fa-minus';
        imageEL.appendChild(removeIcon);

        document.querySelector('#image-uploads').appendChild(imageEL);
      })
      .catch(err => {
        console.log(err);
      });

    k += 1;
  });
}
