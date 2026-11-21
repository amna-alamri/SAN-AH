/*
 * validation.js
 * Bootstrap form validation used by all simple forms on the site
 * (login, register, contact, seller application, review, checkout).
 *
 * HOW IT WORKS:
 * 1. Every <form> that has the class "needs-validation" is found.
 * 2. When the user clicks submit, we ask the browser to check the rules written
 *    in the HTML attributes (required, type="email", minlength, pattern ...)
 *    by calling form.checkValidity().
 * 3. If something is wrong we STOP the submit (preventDefault) so nothing is sent.
 * 4. We add the Bootstrap class "was-validated" to the form. Bootstrap then
 *    shows green/red borders and the .invalid-feedback messages automatically.
 */
(function () {
  'use strict'; // strict mode catches common coding mistakes

  // Select all forms that asked for Bootstrap validation
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over each form and listen for its submit event
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {   // at least one field breaks a rule
        event.preventDefault();      // do not send the form
        event.stopPropagation();     // stop other submit handlers
      }
      form.classList.add('was-validated'); // make Bootstrap show the feedback
    }, false);

    // When the Clear (reset) button is pressed, remove the green/red marks too
    form.addEventListener('reset', function () {
      form.classList.remove('was-validated');
    });
  });
})();
