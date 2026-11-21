/*
 * cart.js  (cart_and_order.html)
 * Dynamic cart table built from a JavaScript array of CartItem objects.
 *
 * Parts of this file:
 *  1. CartItem constructor  -> the object type (name, price, quantity ...)
 *  2. cartItems array       -> the collection, initialised with real products
 *  3. displayCart()         -> function that builds the table rows dynamically
 *  4. Add form              -> adds a new CartItem to the array, then redraws
 *  5. Search form           -> filters the array and redraws only matching items
 */

// ---------- 1. Constructor function for the object type ----------
function CartItem(image, name, price, quantity) {
  this.image = image;       // picture file name
  this.name = name;         // product name
  this.price = price;       // price of ONE piece in OMR
  this.quantity = quantity; // how many pieces the customer wants
}
// A method shared by all CartItem objects: price x quantity
CartItem.prototype.getSubtotal = function () {
  return this.price * this.quantity;
};

// ---------- 2. The array, initialised with the real products of the site ----------
var cartItems = [
  new CartItem('product1.jpg', 'Handcrafted Omani Pottery Set', 10.0, 1),
  new CartItem('product2.jpg', 'Handcrafted Crochet Amigurumi Toys', 3.0, 2)
];

// Catalogue used by the "add item" form (the value of the <select> is the index here)
var catalogue = [
  new CartItem('product1.jpg', 'Handcrafted Omani Pottery Set', 10.0, 1),
  new CartItem('product2.jpg', 'Handcrafted Crochet Amigurumi Toys', 3.0, 1),
  new CartItem('product3.jpg', 'Organic Raw Honey', 40.0, 1)
];

var DELIVERY_FEE = 2.0; // fixed delivery fee in OMR

// ---------- 3. Function that displays the array inside the (empty) table ----------
function displayCart(list) {
  var body = document.getElementById('cartBody');
  body.innerHTML = ''; // empty the table body first so rows are not repeated

  // If nothing matches (or the cart is empty) show one message row
  if (list.length === 0) {
    var emptyRow = body.insertRow();
    var cell = emptyRow.insertCell();
    cell.colSpan = 6;
    cell.className = 'text-center text-secondary py-4';
    cell.textContent = 'No items to show.';
  }

  // Loop through the array: one table row per CartItem object
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var row = body.insertRow();

    // Cell 1: picture
    row.insertCell().innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '" class="img-thumbnail" width="70">';
    // Cell 2-5: text values
    row.insertCell().textContent = item.name;
    row.insertCell().textContent = item.price.toFixed(3);
    row.insertCell().textContent = item.quantity;
    row.insertCell().textContent = item.getSubtotal().toFixed(3);

    // Cell 6: remove button. We remember the real position of the item in cartItems.
    var removeCell = row.insertCell();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-danger btn-sm';
    btn.textContent = 'Remove';
    btn.setAttribute('data-index', cartItems.indexOf(item));
    btn.addEventListener('click', removeItem);
    removeCell.appendChild(btn);
  }
  updateTotals(); // totals always use the FULL array, not only the filtered list
}

// Remove one item from the array, then redraw the table
function removeItem(event) {
  var index = Number(event.target.getAttribute('data-index'));
  cartItems.splice(index, 1);     // delete 1 element at that position
  displayCart(cartItems);
}

// Calculates items price, delivery fee and total (shown under the table)
function updateTotals() {
  var itemsPrice = 0;
  for (var i = 0; i < cartItems.length; i++) {
    itemsPrice += cartItems[i].getSubtotal();
  }
  // Delivery fee is charged only if the cart is not empty and "Delivery" is chosen
  var pickup = document.getElementById('pickup').checked;
  var fee = (cartItems.length > 0 && !pickup) ? DELIVERY_FEE : 0;
  document.getElementById('itemsPrice').textContent = itemsPrice.toFixed(3);
  document.getElementById('deliveryFee').textContent = fee.toFixed(3);
  document.getElementById('totalPrice').textContent = (itemsPrice + fee).toFixed(3) + ' OMR';
}

// ---------- 4. Add form: create a new object and push it into the array ----------
document.getElementById('addItemForm').addEventListener('submit', function (event) {
  event.preventDefault(); // stay on the page
  var form = event.target;
  form.classList.add('was-validated');
  if (!form.checkValidity()) { return; } // stop if the quantity is invalid

  var chosen = catalogue[Number(document.getElementById('addProduct').value)];
  var qty = Number(document.getElementById('addQty').value);

  // If the product is already in the cart just increase its quantity
  var existing = null;
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].name === chosen.name) { existing = cartItems[i]; }
  }
  if (existing) {
    existing.quantity += qty;
  } else {
    cartItems.push(new CartItem(chosen.image, chosen.name, chosen.price, qty)); // new element
  }
  displayCart(cartItems);        // update the table
  form.reset();
  form.classList.remove('was-validated');
});

// ---------- 5. Search form: filter the array by name ----------
function searchCart() {
  var text = document.getElementById('cartSearch').value.trim().toLowerCase();
  var matches = cartItems.filter(function (item) {   // keep items whose name contains the text
    return item.name.toLowerCase().indexOf(text) !== -1;
  });
  displayCart(matches);
}
document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  searchCart();
});
document.getElementById('cartSearch').addEventListener('input', searchCart); // live search while typing
document.getElementById('showAll').addEventListener('click', function () {
  document.getElementById('cartSearch').value = '';
  displayCart(cartItems);
});

// Recalculate the delivery fee when the receiving method changes
document.getElementById('delivery').addEventListener('change', updateTotals);
document.getElementById('pickup').addEventListener('change', updateTotals);

// Draw the table when the page loads
displayCart(cartItems);
