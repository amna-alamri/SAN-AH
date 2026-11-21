/*
 * sellers.js  (share_your_experience.html)
 * Dynamic "Top-Rated Sellers" table built from an array of Seller objects.
 *
 *  1. Seller constructor      -> the object type
 *  2. sellers array           -> initialised with the real sellers of the site
 *  3. displaySellers()        -> builds the table rows dynamically
 *  4. Add form                -> adds a Seller to the array and redraws
 *  5. Search form             -> filters by seller name or city
 */

// ---------- 1. Constructor function ----------
function Seller(name, city, category, rating) {
  this.name = name;         // seller / shop name
  this.city = city;         // city of the seller
  this.category = category; // product category
  this.rating = rating;     // whole number from 1 to 5
}
// Turns the number rating into stars, e.g. 4 -> ★★★★☆
Seller.prototype.getStars = function () {
  return '\u2605'.repeat(this.rating) + '\u2606'.repeat(5 - this.rating);
};

// ---------- 2. Array initialised with real data ----------
var sellers = [
  new Seller('Teen and Athar', 'Bahla', 'Art & Crafts', 5),
  new Seller('Yarn and Stories', 'Muscat', 'Art & Crafts', 4),
  new Seller("Nature's Taste", 'Suhar', 'Food', 4)
];

// ---------- 3. Function that displays an array of sellers in the empty table ----------
function displaySellers(list) {
  var body = document.getElementById('sellersBody');
  body.innerHTML = ''; // clear old rows

  // Sort a COPY of the list so the best rating comes first (the original order is kept)
  var sorted = list.slice().sort(function (a, b) { return b.rating - a.rating; });

  if (sorted.length === 0) {
    var emptyRow = body.insertRow();
    var cell = emptyRow.insertCell();
    cell.colSpan = 5;
    cell.className = 'text-center text-secondary py-3';
    cell.textContent = 'No sellers found.';
    return;
  }

  for (var i = 0; i < sorted.length; i++) {
    var row = body.insertRow();
    row.insertCell().textContent = i + 1;                 // rank = position after sorting
    row.insertCell().textContent = sorted[i].name;
    row.insertCell().textContent = sorted[i].city;
    row.insertCell().textContent = sorted[i].category;
    var starCell = row.insertCell();
    starCell.textContent = sorted[i].getStars();
    starCell.className = 'text-warning';                  // Bootstrap colour class for the stars
  }
}

// ---------- 4. Add form ----------
document.getElementById('addSellerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var form = event.target;
  form.classList.add('was-validated');
  if (!form.checkValidity()) { return; }

  // Build a new Seller object from the form values and push it into the array
  sellers.push(new Seller(
    document.getElementById('sellerName').value.trim(),
    document.getElementById('sellerCity').value.trim(),
    document.getElementById('sellerCategory').value,
    Number(document.getElementById('sellerRating').value)
  ));
  displaySellers(sellers);     // refresh the table
  form.reset();
  form.classList.remove('was-validated');
});

// ---------- 5. Search ----------
function searchSellers() {
  var text = document.getElementById('sellerSearch').value.trim().toLowerCase();
  var matches = sellers.filter(function (s) {
    return s.name.toLowerCase().indexOf(text) !== -1 ||
           s.city.toLowerCase().indexOf(text) !== -1;
  });
  displaySellers(matches);
}
document.getElementById('sellerSearchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  searchSellers();
});
document.getElementById('sellerSearch').addEventListener('input', searchSellers);

displaySellers(sellers); // draw the table when the page loads
