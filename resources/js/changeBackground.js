import axios from 'axios';

const imageUploadLabelEL = document.querySelector('.custom-file-label');
const imageUploadFileEL = document.querySelector('#image-upload-file');
const uploadButtonEL = document.querySelector('button#upload-images');
const currentBackgroundEL = document.querySelector('img#current-bg-image');
const progressDivEL = document.querySelector('#upload-progress-div');
const progressBarEL = document.querySelector('#upload-progress-bar');

var count = 0;

const imagePreviewAreaEL = document.querySelector('#image-preview-area');

let fileToUpload;

imageUploadFileEL.addEventListener('change', e => {
  var file = e.target.files[0];

  if (!file) {
    // imageUploadLabelEL.innerHTML = 'Choose file';
    // fileToUpload = null;
    // imagePreviewArea.innerHTML = '';

    return;
  }

  imageUploadLabelEL.innerHTML = file.name;
  fileToUpload = file;

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    var imageEL = document.createElement('img');
    imageEL.className = 'image-upload-preview';
    imageEL.setAttribute('src', reader.result);
    imageEL.style.width = '100%';
    imageEL.style.borderRadius = '5px';
    imageEL.style.height = '150px';

    var labelEL = document.createElement('strong');
    labelEL.innerHTML = 'Image Preview';

    imagePreviewAreaEL.innerHTML = '';
    imagePreviewAreaEL.appendChild(labelEL);
    imagePreviewAreaEL.appendChild(imageEL);
  });

  reader.readAsDataURL(fileToUpload);
});

uploadButtonEL.addEventListener('click', e => {
  if (!fileToUpload) {
    return toastr.error("You haven't uploaded a file");
  }
  const formData = new FormData();

  formData.append('image', fileToUpload);

  const headers = {
    'Content-Type': 'multipart/form-data'
  };

  // const onUploadProgress = ProgressEvent => {
  //   progressDivEL.style.display = 'block';

  //   const percent = parseInt(
  //     Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
  //   );

  //   console.log(percent);

  //   progressBarEL.style.width = percent;
  //   progressBarEL.innerHTML = percent;
  // };

  axios
    .post('/admin/settings/background', formData, headers)
    .then(res => {
      imageUploadLabelEL.innerHTML = 'Choose file';
      fileToUpload = null;
      imagePreviewAreaEL.innerHTML = '';

      var src = currentBackgroundEL.getAttribute('src');
      currentBackgroundEL.setAttribute('src', src + '?q=' + count);
      toastr.success(res.data.success_msg);

      // progressDivEL.display = 'none';
    })
    .catch(err => {
      if (err.response.data.err_msg) {
        toastr.error(err.response.data.err_msg);
      }
      console.log(err);
    });

  count += 1;
});
