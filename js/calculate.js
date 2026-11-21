/*
 * calculate.js  (calculate.html)  -  SAN'AH Shopping Bill Calculator
 *
 * WHY THIS PAGE EXISTS: SAN'AH sells products of local makers, so a buyer wants to
 * know the final price BEFORE ordering. The page works out the bill with this formula:
 *
 *   subtotal   = (price1 x qty1) + (price2 x qty2) + (price3 x qty3)
 *   discount   = subtotal x discountRate            (rules below)
 *   afterDisc  = subtotal - discount
 *   vat        = afterDisc x 5%                     (Oman VAT)
 *   delivery   = 0 / 2 / 3 OMR                      (rules below)
 *   TOTAL      = afterDisc + vat + delivery
 *
 * DISCOUNT RULES  (uses relational  > >= <  and logical  && ||  operators)
 *   - Customer older than 60  -> 10 % discount
 *   - Subtotal 50 OMR or more -> extra 5 % discount
 *   - Registered SAN'AH member buying 3 or more pieces -> extra 2 % discount
 *   - The total discount can never be more than 15 %
 * DELIVERY RULES
 *   - "Pickup from seller" -> free
 *   - Delivery inside Muscat -> 2 OMR, other cities -> 3 OMR
 *   - Delivery is FREE if the amount after discount is 40 OMR or more
 */

var VAT_RATE = 0.05;          // 5 % value added tax
var MAX_DISCOUNT = 0.15;      // discount cap = 15 %

// Read a number from an input; return 0 when it is empty or negative
function readNumber(id) {
  var value = Number(document.getElementById(id).value);
  return (isNaN(value) || value < 0) ? 0 : value;
}

// Put a money value inside an element, with 3 decimals like the real OMR format
function showMoney(id, amount) {
  document.getElementById(id).textContent = amount.toFixed(3);
}

function calculateBill() {
  // ---- 1. Read the inputs ----
  var qty1 = readNumber('qty1'), qty2 = readNumber('qty2'), qty3 = readNumber('qty3');
  var age = readNumber('age');
  var city = document.getElementById('city').value;
  var pickup = document.getElementById('pickup').checked;
  var member = document.getElementById('member').checked;

  // ---- 2. Basic arithmetic: price x quantity for each product, then the sum ----
  var price1 = 10.0, price2 = 3.0, price3 = 40.0;      // prices of the three products
  var subtotal = (price1 * qty1) + (price2 * qty2) + (price3 * qty3);
  var totalPieces = qty1 + qty2 + qty3;                 // how many pieces in total

  // ---- 3. Discount: IF statements with relational and logical operators ----
  var discountRate = 0;
  var notes = [];                                       // reasons shown to the user

  if (age > 60) {                                       // elderly customers
    discountRate += 0.10;
    notes.push('10% elderly discount (age over 60)');
  }
  if (subtotal >= 50) {                                 // big order
    discountRate += 0.05;
    notes.push('5% discount for orders of 50 OMR or more');
  }
  if (member && totalPieces >= 3) {                     // && means BOTH conditions must be true
    discountRate += 0.02;
    notes.push('2% member discount (3 or more pieces)');
  }
  if (discountRate > MAX_DISCOUNT) {                    // never exceed the cap
    discountRate = MAX_DISCOUNT;
    notes.push('Discount capped at 15%');
  }

  var discount = subtotal * discountRate;               // money value of the discount
  var afterDiscount = subtotal - discount;
  var vat = afterDiscount * VAT_RATE;

  // ---- 4. Delivery fee: if / else if / else ----
  var delivery;
  if (subtotal === 0 || pickup) {                       // nothing bought, or customer collects it
    delivery = 0;
  } else if (afterDiscount >= 40) {                     // free delivery for big baskets
    delivery = 0;
    notes.push('Free delivery (40 OMR or more after discount)');
  } else if (city === 'muscat') {                       // inside the capital
    delivery = 2;
  } else {                                              // all other cities
    delivery = 3;
  }

  var total = afterDiscount + vat + delivery;

  // ---- 5. Show the results in the page ----
  showMoney('rSubtotal', subtotal);
  showMoney('rDiscount', discount);
  document.getElementById('rRate').textContent = (discountRate * 100).toFixed(0) + '%';
  showMoney('rAfter', afterDiscount);
  showMoney('rVat', vat);
  showMoney('rDelivery', delivery);
  showMoney('rTotal', total);

  // Build the list of applied offers
  var list = document.getElementById('rNotes');
  list.innerHTML = '';
  if (notes.length === 0) {
    notes.push('No discounts applied yet.');
  }
  notes.forEach(function (text) {
    var li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = text;
    list.appendChild(li);
  });
}

// Validate the age field, then calculate (called by the form submit)
document.getElementById('calcForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var form = event.target;
  form.classList.add('was-validated');          // Bootstrap validation styling
  if (form.checkValidity()) { calculateBill(); }
});

// Recalculate automatically whenever the user changes a value
document.getElementById('calcForm').addEventListener('input', function () {
  if (document.getElementById('calcForm').checkValidity()) { calculateBill(); }
});
document.getElementById('calcForm').addEventListener('reset', function () {
  setTimeout(calculateBill, 0);                 // wait until the form is cleared, then recalculate
  document.getElementById('calcForm').classList.remove('was-validated');
});

calculateBill(); // show a first result when the page opens
