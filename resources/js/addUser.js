import axios from 'axios';

const addUserFormEL = document.querySelector('#add-user-form');

const firstnameEL = document.querySelector('#firstname-input');
const lastnameEL = document.querySelector('#lastname-input');
const usernameEL = document.querySelector('#username-input');
const emailEL = document.querySelector('#email-input');
const typeEL = document.querySelector('#user-type-input');
const pass1EL = document.querySelector('#password-1-input');
const pass2EL = document.querySelector('#password-2-input');


addUserFormEL.addEventListener('submit', e => {
	e.preventDefault();

	const firstname = firstnameEL.value;
	const lastname = lastnameEL.value;
	const username = usernameEL.value;
	const email = emailEL.value;
	const pass1 = pass1EL.value;
	const pass2 = pass2EL.value;
	var type = typeEL.value;

	if(!firstname || !lastname || !username || !email || !type || !pass1 || !pass2) {
		return toastr.error('Please enter all fields');
	}

	if(pass1 !== pass2) {
		return toastr.error('Password\'s do not match');
	}

	if(pass1.length < 6) {
		return toastr.error('Passwords must be at least 6 characters long');
	}


	axios
		.post('/admin/users/store', {
			firstname, 
			lastname, 
			username, 
			email, 
			type, 
			password: pass1
		})
		.then(res => {
			toastr.clear();

			if(res.data.success_msg) {
				toastr.success(res.data.success_msg);
			}
		})
		.catch(err => {
			toastr.clear();

			if(err.response.data.error_msg) {
				toastr.error(err.response.data.error_msg);
			}
		})
});