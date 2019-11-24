tinymce.init({
  selector: '#product-details',
  branding: false,
  theme: 'modern',
  height: 200,
  plugins: [
    'table lists pagebreak link autosave image imagetools code advlist textcolor colorpicker fullscreen'
  ],
  advlist_bullet_styles: 'square circle',
  menubar: 'file format edit table insert view',
  toolbar:
    ' code | insertfile | table | numlist bullist | pagebreak | link | undo | bold | italic | image | forecolor | backcolor | fullscreen',
  image_advtab: true,

  images_upload_url: 'postAcceptor.php',
  images_upload_url: '/storage/app/public',

  formats: {
    alignleft: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
      classes: 'left'
    },
    aligncenter: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
      classes: 'center'
    },
    alignright: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
      classes: 'right'
    },
    alignjustify: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img',
      classes: 'full'
    },
    bold: {
      inline: 'span',
      classes: 'bold'
    },
    italic: {
      inline: 'span',
      classes: 'italic'
    },
    underline: {
      inline: 'span',
      classes: 'underline',
      exact: true
    },
    strikethrough: {
      inline: 'del'
    },
    forecolor: {
      inline: 'span',
      classes: 'forecolor',
      styles: {
        color: '%value'
      }
    },
    hilitecolor: {
      inline: 'span',
      classes: 'hilitecolor',
      styles: {
        backgroundColor: '%value'
      }
    },
    custom_format: {
      block: 'h1',
      attributes: {
        title: 'Header'
      },
      styles: {
        color: 'red'
      }
    }
  },

  mobile: {
    theme: 'mobile',
    plugins: ['autosave', 'lists', 'autolink'],
    toolbar: ['undo', 'bold', 'italic', 'styleselect']
  }
});
