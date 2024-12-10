const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;

// Add to Cart Function
function addToCart(productName, price, sizeId, quantityId, imageUrl) {
    const size = parseInt(document.getElementById(sizeId).value);
    const quantity = parseInt(document.getElementById(quantityId).value);

    if (quantity < 1) {
        alert("Quantity must be at least 1.");
        return;
    }

    if (size < 36 || size > 45) {
        alert("Please select a valid shoe size (36–45).");
        return;
    }

    const existingItem = cart.find(
        (item) => item.productName === productName && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productName, price, size, quantity, imageUrl });
    }

    totalPrice += price * quantity;

    saveCartToLocalStorage();
    alert(`${quantity} x ${productName} (Size: ${size}) added to your cart.`);
}

// Update Cart Display Function
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const orderTotalElement = document.getElementById("order-total");
    const shippingElement = document.getElementById("shipping");

    if (cartItems) {
        cartItems.innerHTML = ""; // Clear existing cart items

        if (cart.length === 0) {
            cartItems.innerHTML = "<li>Your cart is empty.</li>";
            if (subtotalElement) subtotalElement.textContent = formatter.format(0);
            if (shippingElement) shippingElement.textContent = "₱0.00";
            if (orderTotalElement) orderTotalElement.textContent = formatter.format(0);
            return;
        }

        let subtotal = 0;

        // Populate cart with current items
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                <div class="cart-item">
                    <img src="${item.imageUrl}" alt="${item.productName}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span>${item.quantity} x ${item.productName} (Size: ${item.size})</span>
                        <span>${formatter.format(item.price * item.quantity)}</span>
                        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(li);
        });

        if (subtotalElement) subtotalElement.textContent = formatter.format(subtotal);
        if (shippingElement) shippingElement.textContent = formatter.format(100); // Flat shipping fee
        if (orderTotalElement) orderTotalElement.textContent = formatter.format(subtotal + 100);
        totalPrice = subtotal + 100;
    }
}

// Remove Individual Item from Cart
function removeItem(index) {
    const removedItem = cart.splice(index, 1)[0];
    totalPrice -= removedItem.price * removedItem.quantity;
    saveCartToLocalStorage();
    updateCart();
    alert(`${removedItem.productName} (Size: ${removedItem.size}) removed from your cart.`);
}

// Clear Cart Function
function clearCart() {
    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    if (confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        totalPrice = 0;
        saveCartToLocalStorage();
        updateCart();
        alert("Your cart has been cleared.");
    }
}

// Save Cart Data to Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
}

// Handle Checkout Form Submission
document.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding.");
        return;
    }

    const email = e.target.querySelector('input[type="email"]').value;
    const firstName = e.target.querySelector('input[placeholder="Enter your first name"]').value;
    const lastName = e.target.querySelector('input[placeholder="Enter your last name"]').value;

    if (!email || !firstName || !lastName) {
        alert("Please complete all required fields.");
        return;
    }

    alert(`Thank you, ${firstName}! Your order has been placed successfully.`);
    localStorage.setItem("checkoutStatus", "completed");
    saveCartToLocalStorage();

    // Redirect to the confirmation page
    window.location.href = "confirmation.html";
});

// Initialize Cart on Page Load
document.addEventListener("DOMContentLoaded", () => {
    updateCart();
});
