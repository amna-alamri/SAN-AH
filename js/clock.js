/*
 * clock.js  (home page banner)
 * Fills the moving welcome banner with the CURRENT date and time and keeps
 * the time live by refreshing it every second.
 */
function updateDateTime() {
  var now = new Date();                                   // current date + time from the user's computer
  var dateText = now.toLocaleDateString('en-GB', {        // e.g. "Friday, 20 November 2026"
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  var timeText = now.toLocaleTimeString('en-GB');         // e.g. "14:05:09"
  // Put the text inside the <span id="currentDateTime"> in the banner
  document.getElementById('currentDateTime').textContent =
    dateText + ', and the time is ' + timeText;
}
updateDateTime();                  // run once immediately
setInterval(updateDateTime, 1000); // then repeat every 1000 ms (1 second)
