/*
 * products.js  (product.html)
 * Fills the Bootstrap "Quick view" modal with the data of the product the user chose.
 * The data lives in data-* attributes on each button, so no extra array is needed.
 */
var quickModal = document.getElementById('quickViewModal');

// Bootstrap fires "show.bs.modal" just before the modal opens.
// event.relatedTarget is the button that was clicked to open it.
quickModal.addEventListener('show.bs.modal', function (event) {
  var button = event.relatedTarget;
  document.getElementById('modalTitle').textContent = button.getAttribute('data-title');
  document.getElementById('modalText').textContent = button.getAttribute('data-text');
  document.getElementById('modalSeller').textContent = button.getAttribute('data-seller');
  var img = document.getElementById('modalImg');
  img.src = button.getAttribute('data-img');
  img.alt = button.getAttribute('data-title');
});
