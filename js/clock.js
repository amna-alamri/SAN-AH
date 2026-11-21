/*
 * clock.js  (home page banner)
 * Fills the moving welcome banner with the CURRENT date and time and keeps
 * the time live by refreshing it every second.
 */
function updateDateTime(){
    var now = new Date();
    var dateText = now.toLocaleDateString('en-GB',{
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    var timeText = now.toLocaleTimeString('en-GB');
    document.getElementById('currentDateTime').textContent =
    dateText + ', and the time is ' + timeText;
}
updateDateTime();
setInterval(updateDateTime, 1000);
