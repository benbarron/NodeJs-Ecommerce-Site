import axios from 'axios';

const addOptionButtonEL = document.querySelector('#add-option-btn');
const optionsAreaEL = document.querySelector('#options-area');
const removeOptionButtonEL = document.querySelector('#remove-option-btn');
const removeImagesButtonEL = document.querySelector('#remove-images-btn');
const addProductForm = document.querySelector('#add-form');
var productImageUploads = [];

var optionCount = 0;

addOptionButtonEL.addEventListener('click', e => {
  e.preventDefault();

  var newOptionRow = document.createElement('div');
  newOptionRow.className = `row row-${optionCount}`;

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
            <option value="buttons" class="form-control  form-control-sm">Buttons</option>
            <option value="radio-buttons" class="form-control  form-control-sm">Radio Buttons</option>
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

  newOptionRow.innerHTML = out;

  optionsAreaEL.appendChild(newOptionRow);

  out = '';
  optionCount += 1;
});

removeOptionButtonEL.addEventListener('click', e => {
  e.preventDefault();

  if (optionCount === 0) {
    return;
  }

  document.querySelector(`.row-${optionCount - 1}`).remove();

  optionCount -= 1;
});

removeImagesButtonEL.addEventListener('click', e => {
  e.preventDefault();

  productImageUploads = [];
  document.querySelector('#image-previews').innerHTML = '';
  document.querySelector('#file').value = '';
});

document.querySelector('input#file').addEventListener('change', e => {
  e.preventDefault();

  const file = e.target.files[0];

  if (!file) {
    return;
  }

  productImageUploads.push(file);

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    var imageEL = document.createElement('img');
    imageEL.className = 'image-upload-preview col-sm-2';
    imageEL.setAttribute('src', reader.result);
    document.querySelector('#image-previews').appendChild(imageEL);
  });

  reader.readAsDataURL(file);
});

addProductForm.addEventListener('submit', e => {
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

  if (productImageUploads.length < 3) {
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

  for (let l = 1; l <= productImageUploads.length; l++) {
    formData.append('images-' + l, productImageUploads[l - 1]);
  }

  var headers = { 'Content-Type': 'multipart/form-data' };

  axios
    .post('/admin/products/store', formData, headers)
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
