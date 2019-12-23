import axios from 'axios';

var currentMode = "json";
var currentTheme = "twilight";
var currentTabSize = 2;
var currentFontSize = 20;

var textEditor = ace.edit("config-editor");
textEditor.session.setMode(`ace/mode/${currentMode}`)
textEditor.setTheme(`ace/theme/${currentTheme}`);
textEditor.setFontSize(currentFontSize);
textEditor.session.setTabSize(currentTabSize);

const configFormEL = document.querySelector('#update-config-form');

configFormEL.addEventListener('submit', e => {
	e.preventDefault();

	var data = textEditor.getValue();

	axios
		.post('/admin/settings/config/update', { data })
		.then(res => {
			if(res.data.success_msg) {
				toastr.success(res.data.success_msg);
			}
		})
		.catch(err => {
			if(err.response.data.error_msg) {
				toastr.error(err.response.data.error_msg);
			}
		})
})