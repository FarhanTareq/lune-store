const products = [
  {
    id: 1,
    name: "Stoneware Mug",
    price: 24,
    color: "#c9b8a3",
    art: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 30h36v34a18 18 0 0 1-18 18 18 18 0 0 1-18-18V30Z" stroke="#3b3530" stroke-width="2.5"/><path d="M64 40h6a9 9 0 0 1 0 18h-6" stroke="#3b3530" stroke-width="2.5"/><path d="M36 22c0-3 3-4 3-7M46 22c0-3 3-4 3-7" stroke="#3b3530" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>`,
  },
  {
    id: 2,
    name: "Linen Throw",
    price: 68,
    color: "#aebba8",
    art: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="24" width="50" height="56" rx="6" stroke="#3b3530" stroke-width="2.5"/><path d="M25 36h50M25 50h50M25 64h50" stroke="#3b3530" stroke-width="1.5" opacity=".4"/><path d="M36 80l-4 8M50 80l0 8M64 80l4 8" stroke="#3b3530" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 3,
    name: "Oak Board",
    price: 42,
    color: "#d3b789",
    art: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="34" width="56" height="34" rx="8" stroke="#3b3530" stroke-width="2.5"/><circle cx="30" cy="51" r="4" stroke="#3b3530" stroke-width="2"/><path d="M42 42c8 4 8 14 0 18M58 42c-8 4-8 14 0 18" stroke="#3b3530" stroke-width="1.5" opacity=".45"/></svg>`,
  },
  {
    id: 4,
    name: "Clay Vase",
    price: 36,
    color: "#c4a8a0",
    art: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 20h20v10c0 6 10 10 10 26 0 16-9 26-20 26S30 72 30 56c0-16 10-20 10-26V20Z" stroke="#3b3530" stroke-width="2.5"/><path d="M36 54c8 4 20 4 28 0" stroke="#3b3530" stroke-width="1.5" opacity=".45"/></svg>`,
  },
];

const cart = new Map();
const grid = document.getElementById("grid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

grid.innerHTML = products
  .map(
    (p) => `
  <article class="product">
    <div class="thumb" style="background:${p.color}">${p.art}</div>
    <div class="meta">
      <h3>${p.name}</h3>
      <span class="price">$${p.price}</span>
    </div>
    <button class="add" data-id="${p.id}">Add to cart</button>
  </article>`
  )
  .join("");

function renderCart() {
  let total = 0;
  let count = 0;
  cart.forEach((qty, id) => {
    const p = products.find((x) => x.id === id);
    total += p.price * qty;
    count += qty;
  });

  cartCount.textContent = count;
  cartTotal.textContent = `$${total}`;

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = [...cart.entries()]
    .map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return `
      <div class="cart-item">
        <div>${p.name}<small>Qty ${qty}</small></div>
        <div>$${p.price * qty} <button class="remove" data-id="${id}" aria-label="Remove">×</button></div>
      </div>`;
    })
    .join("");
}

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}

let toastTimer;
function showToast() {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

document.addEventListener("click", (e) => {
  const add = e.target.closest(".add");
  if (add) {
    const id = Number(add.dataset.id);
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast();
    return;
  }

  const remove = e.target.closest(".remove");
  if (remove) {
    cart.delete(Number(remove.dataset.id));
    renderCart();
  }
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());

renderCart();
