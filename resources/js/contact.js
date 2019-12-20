import axios from "axios";

const contactFormEL = document.querySelector(".contact-form");

if (contactFormEL) {
  const nameInputEL = document.querySelector("#name-input");
  const emailInputEL = document.querySelector("#email-input");
  const subjectInputEL = document.querySelector("#subject-input");
  const messageInputEL = document.querySelector("#message-input");

  contactFormEL.addEventListener("submit", e => {
    e.preventDefault();

    const name = nameInputEL.value;
    const email = emailInputEL.value;
    const subject = subjectInputEL.value;
    const message = messageInputEL.value;

    if (!name || !email || !subject || !message) {
      return toastr.error("Please enter all fields");
    }

    toastr.info("Sending...");

    axios
      .post("/contact", { name, email, subject, message })
      .then(res => {
        nameInputEL.value = "";
        emailInputEL.value = "";
        subjectInputEL.value = "";
        messageInputEL.value = "";
        toastr.remove();
        toastr.success(res.data.success_msg);
      })
      .catch(err => {
        if (err.response.data.error_msg) {
          toastr.remove();
          toastr.error(err.response.data.error_msg);
        }
      });
  });
}
