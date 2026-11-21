/*
 * questionnaire.js  (questionnaire.html)
 * Custom JavaScript validation for the customer feedback form.
 *
 * Four fields are validated, each with a DIFFERENT rule and a regular expression
 * (a regular expression = a pattern the text must match):
 *   1. Full name  -> at least two words, letters only (English or Arabic)
 *   2. Email      -> must look like name@domain.ext
 *   3. Phone      -> Omani mobile number (starts with 7 or 9, 8 digits)
 *   4. Comment    -> 20 to 300 characters, no link, no character repeated 4+ times
 * Radio buttons are also checked (one answer must be chosen).
 *
 * HOW FEEDBACK IS SHOWN: Bootstrap classes "is-valid" (green) and "is-invalid" (red)
 * are added to the input; the text of the error is written in the .invalid-feedback div.
 */

// ---------- The validation rules (one small function per field) ----------
// Every function returns "" when the value is OK, or an error message when it is not.

function checkName(value) {
  // ^ start, then a word of letters, then ONE OR MORE (space / ' / -) + word, $ end.
  // \u0600-\u06FF is the Arabic letters range, so Arabic names are accepted too.
  var pattern = /^[A-Za-z\u0600-\u06FF]{2,}(?:[ '\-][A-Za-z\u0600-\u06FF]{2,})+$/;
  return pattern.test(value.trim())
    ? '' : 'Enter your full name (at least two words, letters only).';
}

function checkEmail(value) {
  // local part @ domain name(s) . extension of 2+ letters; no spaces allowed.
  var pattern = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/;
  return pattern.test(value.trim())
    ? '' : 'Enter a valid email such as name@example.com.';
}

function checkPhone(value) {
  // Optional +968 or 00968 prefix, then 7 or 9, then 7 more digits (spaces allowed in the middle).
  var pattern = /^(?:\+968|00968)?\s?[79]\d{3}\s?\d{4}$/;
  return pattern.test(value.trim())
    ? '' : 'Enter an Omani mobile number, e.g. 9123 4567 or +968 7123 4567.';
}

function checkComment(value) {
  var text = value.trim();
  if (text.length < 20 || text.length > 300) {
    return 'The comment must be between 20 and 300 characters (now ' + text.length + ').';
  }
  // (.)\1{3,}  means: any character followed by the SAME character 3 more times (e.g. "aaaa")
  if (/(.)\1{3,}/.test(text)) {
    return 'Please avoid repeating the same character 4 times or more.';
  }
  // Block links so the feedback cannot be used for advertising
  if (/(https?:\/\/|www\.)/i.test(text)) {
    return 'Links are not allowed in the comment.';
  }
  return '';
}

// ---------- Helper: show or clear the result of one field ----------
function showResult(input, message) {
  var feedback = document.getElementById(input.id + 'Feedback'); // the red message box
  if (message === '') {                       // no error
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {                                    // there is an error
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.textContent = message;
  }
  return message === '';                      // true when valid
}

// Connect each input to its rule: validate while typing and when leaving the field
var rules = [
  { id: 'fullName', check: checkName },
  { id: 'email',    check: checkEmail },
  { id: 'phone',    check: checkPhone },
  { id: 'comment',  check: checkComment }
];
rules.forEach(function (rule) {
  var input = document.getElementById(rule.id);
  var run = function () { showResult(input, rule.check(input.value)); };
  input.addEventListener('input', run);
  input.addEventListener('blur', run);
});

// Live character counter for the comment box
document.getElementById('comment').addEventListener('input', function (e) {
  document.getElementById('commentCount').textContent = e.target.value.length + ' / 300';
});

// Show the slider value next to the range control
document.getElementById('satisfaction').addEventListener('input', function (e) {
  document.getElementById('satisfactionValue').textContent = e.target.value + ' / 10';
});

// ---------- When the form is submitted ----------
document.getElementById('questionnaireForm').addEventListener('submit', function (event) {
  event.preventDefault(); // we handle the submit ourselves (nothing leaves the page)
  var allValid = true;

  // 1. Run every text rule. We use "&&" after the call so ALL fields get checked and coloured.
  rules.forEach(function (rule) {
    var input = document.getElementById(rule.id);
    var ok = showResult(input, rule.check(input.value));
    allValid = allValid && ok;
  });

  // 2. Radio buttons: one option of "heard" must be selected
  var heard = document.querySelector('input[name="heard"]:checked');
  var heardError = document.getElementById('heardError');
  if (!heard) { heardError.classList.remove('d-none'); allValid = false; }
  else        { heardError.classList.add('d-none'); }

  // 3. Checkbox agreement is required
  var agree = document.getElementById('agree');
  agree.classList.toggle('is-invalid', !agree.checked);
  if (!agree.checked) { allValid = false; }

  if (!allValid) { return; } // stop here, the user must fix the red fields

  // ---- Everything is valid: collect the answers and show them in a Bootstrap modal ----
  var likes = [];
  document.querySelectorAll('input[name="likes"]:checked').forEach(function (box) {
    likes.push(box.value);
  });
  var summary =
    '<li><strong>Name:</strong> ' + document.getElementById('fullName').value.trim() + '</li>' +
    '<li><strong>Heard about us:</strong> ' + heard.value + '</li>' +
    '<li><strong>Favourite category:</strong> ' + document.getElementById('category').value + '</li>' +
    '<li><strong>Liked:</strong> ' + (likes.length ? likes.join(', ') : 'nothing selected') + '</li>' +
    '<li><strong>Satisfaction:</strong> ' + document.getElementById('satisfaction').value + ' / 10</li>';
  document.getElementById('summaryList').innerHTML = summary;
  new bootstrap.Modal(document.getElementById('thanksModal')).show();

  event.target.reset();                                   // clear the form
  document.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
    el.classList.remove('is-valid', 'is-invalid');        // remove green/red marks
  });
  document.getElementById('commentCount').textContent = '0 / 300';
  document.getElementById('satisfactionValue').textContent = '5 / 10';
});
