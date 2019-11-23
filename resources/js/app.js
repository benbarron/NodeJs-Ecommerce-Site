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

    if (i === 0) {
      return;
    }

    document.querySelector(`.row-${i - 1}`).remove();

    i -= 1;
  });
}

if (document.querySelector('#product-images')) {
  var images = [];

  document.querySelector('#clear-images-btn').addEventListener('click', e => {
    e.preventDefault();

    images = [];
    document.querySelector('#image-previews').innerHTML = '';
    document.querySelector('#file').value = '';
  });

  document.querySelector('input#file').addEventListener('change', e => {
    e.preventDefault();

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    images.push(file);

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      var imageEL = document.createElement('img');
      imageEL.className = 'image-upload-preview col-sm-2';
      imageEL.setAttribute('src', reader.result);
      document.querySelector('#image-previews').appendChild(imageEL);
    });

    reader.readAsDataURL(file);
  });

  document.querySelector('#add-form').addEventListener('submit', e => {
    e.preventDefault();

    var name = document.querySelector('#product-name').value;
    var price = document.querySelector('#product-price').value;
    var category = document.querySelector('#product-category').value;
    var live = document.querySelector('#product-status').value;
    var details = tinyMCE.activeEditor.getContent();
    var description = document.querySelector('#product-description').value;

    var options = [];
    var i = 0;

    while (1) {
      try {
        var obj = {
          name: document.querySelector('#option-' + i + '-name').value,
          method: document.querySelector('#option-' + i + '-method').value,
          values: document.querySelector('#option-' + i + '-values').value
        };
      } catch (e) {
        break;
      }

      if (!obj.name || !obj.method || !obj.values) {
        break;
      }

      options.push(obj);

      i++;
    }

    // console.log({ name, price, category, live, details, description, options, images });

    if (!name || !price || !category || !live || !details || !description) {
      return toastr.error('Please enter all fields');
    }

    if (images.length < 3) {
      return toastr.error('Please upload 3 images');
    }

    var formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('live', live);
    formData.append('details', details);
    formData.append('description', description);
    formData.append('options', JSON.stringify(options));

    for (let l = 1; l <= images.length; l++) {
      formData.append('images-' + l, images[l - 1]);
    }

    var headers = { 'Content-Type': 'multipart/form-data' };

    axios
      .post('/api/products/add', formData, headers)
      .then(res => {
        if (res.data.success_msg) {
          window.location.href =
            '/admin/products?success_msg=' + res.data.success_msg;
        }
      })
      .catch(err => {
        if (err.response.data.error_msg) {
          toastr.error(err.response.data.error_msg);
        }
      });
  });
}
