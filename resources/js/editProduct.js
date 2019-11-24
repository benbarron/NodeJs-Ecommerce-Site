import uuid from 'uuid';
import axios from 'axios';

// determine number of rows in options area
var optionCount = 0;
while (1) {
  if (!document.querySelector('.row-' + optionCount)) {
    break;
  }

  if (optionCount > 100) {
    break;
  }

  optionCount++;
}

document.querySelector('#remove-option-btn').addEventListener('click', e => {
  e.preventDefault();

  if (optionCount === 0) {
    return;
  }

  document.querySelector(`.row-${optionCount - 1}`).remove();

  optionCount -= 1;
});

const optionsAreaEL = document.querySelector('#options-area');

document.querySelector('#add-option-btn').addEventListener('click', e => {
  e.preventDefault();

  var el = document.createElement('div');
  el.className = `row row-${optionCount}`;

  var out = `
    <div class="col-sm-12">
      <div class="mb-2 row">
        <div class="col-sm-2">
          ${
            optionCount == 0
              ? `<label for='option-${optionCount}-name'>Option Name</label>`
              : ''
          }
          <input type="text" class="form-control form-control-sm" aria-label="Small" id="option-${optionCount}-name" name="option-${optionCount}-name" placeholder="Option Name">
        </div>
        <div class="col-sm-5">
          ${
            optionCount == 0
              ? `<label for='option-${optionCount}-method'>Option Display Method</label>`
              : ''
          }
          <select name="option-${optionCount}-method" id="option-${optionCount}-method" class="form-control form-control-sm" aria-label="Small">
            <option value="dropdown" class="form-control  form-control-sm">Dropdown</option>
          </select>
        </div>
        <div class="col-sm-5">
          ${
            optionCount == 0
              ? `<label for='option-${optionCount}-values'>Option Values</label>`
              : ''
          }
          <input type="text" class="form-control form-control-sm" aria-label="Small" id="option-${optionCount}-values" name="option-${optionCount}-values" placeholder="Values (Enter in comma separated list)">
          </div>
        </div>
        <hr>
      </div>
    `;

  el.innerHTML = out;

  optionsAreaEL.appendChild(el);

  out = '';
  optionCount += 1;
});

document.querySelector('#edit-form').addEventListener('submit', e => {
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

  if (!name || !price || !category || !live || !details || !description) {
    return toastr.error('Please enter all fields');
  }

  if (images.length < 3) {
    return toastr.error('Please upload 3 images');
  }

  console.log({
    name,
    price,
    category,
    live,
    details,
    description,
    options,
    images
  });

  var formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('category', category);
  formData.append('live', live);
  formData.append('details', details);
  formData.append('description', description);
  formData.append('options', JSON.stringify(options));
  formData.append('resetImages', resetImages);

  for (let l = 1; l <= images.length; l++) {
    formData.append('images-' + l, images[l - 1]);
  }

  var headers = { 'Content-Type': 'multipart/form-data' };

  var productId = document.querySelector('#product-id').innerHTML;

  axios
    .post('/admin/products/update/' + productId, formData, headers)
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

var images = [];
var resetImages = false;

var imagesELs = document.querySelector('#image-previews').children;

for (let i = 0; i < imagesELs.length; i++) {
  images.push('current');
}

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

document.querySelector('#remove-images-btn').addEventListener('click', e => {
  e.preventDefault();

  resetImages = true;
  images = [];
  document.querySelector('#image-previews').innerHTML = '';
  document.querySelector('#file').value = '';
});
