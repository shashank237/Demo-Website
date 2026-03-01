// ===========================
// CART STATE
// ===========================
let cart = [];

// DOM refs
const cartIcon        = document.getElementById('cart-icon');
const cartSidebar     = document.getElementById('cart-sidebar');
const cartBackdrop    = document.getElementById('cart-backdrop');
const closeCartBtn    = document.getElementById('close-cart');
const cartCountBadge  = document.getElementById('cart-count');
const cartItemsEl     = document.getElementById('cart-items');
const cartTotalEl     = document.getElementById('cart-total');

// ===========================
// CART OPEN / CLOSE
// ===========================
function openCart() {
    cartSidebar.classList.add('open');
    cartBackdrop.classList.add('show');
}
function closeCart() {
    cartSidebar.classList.remove('open');
    cartBackdrop.classList.remove('show');
}
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

// ===========================
// ADD TO CART
// ===========================
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const name  = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const img   = btn.dataset.img;
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }
        renderCart();
        openCart();
        // Bounce animation on cart icon
        cartIcon.classList.remove('bounce');
        void cartIcon.offsetWidth; // reflow
        cartIcon.classList.add('bounce');
    });
});

// ===========================
// RENDER CART
// ===========================
function renderCart() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    cartCountBadge.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart cart-empty-ico"></i>
                <p>Ihr Warenkorb ist leer</p>
                <a href="#categories" class="btn-start-shop">Jetzt einkaufen</a>
            </div>`;
        cartTotalEl.innerHTML = `<span>Zwischensumme</span><strong>0,00 €</strong>`;
        return;
    }

    cartItemsEl.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} €</div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12px;color:#6b7280;">
                    Menge:
                    <input type="number" min="1" value="${item.qty}"
                        style="width:46px;padding:3px 6px;border:1px solid #e5e7eb;border-radius:4px;font-size:12px;text-align:center;"
                        onchange="updateQty(${idx}, this.value)">
                </div>
            </div>
            <button onclick="removeItem(${idx})"
                style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:16px;padding:4px;align-self:flex-start;transition:color .2s;"
                onmouseenter="this.style.color='#cc0000'" onmouseleave="this.style.color='#9ca3af'">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotalEl.innerHTML = `<span>Zwischensumme</span><strong>${total.toFixed(2).replace('.', ',')} €</strong>`;
}

function updateQty(idx, val) {
    val = parseInt(val);
    if (val <= 0) { removeItem(idx); }
    else { cart[idx].qty = val; renderCart(); }
}
function removeItem(idx) {
    cart.splice(idx, 1);
    renderCart();
}

// ===========================
// CHECKOUT BUTTON
// ===========================
document.querySelector('.cart-checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ihr Warenkorb ist leer.');
        return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    alert(`Zur Kasse:\nZwischensumme: ${total.toFixed(2).replace('.', ',')} €`);
});

// ===========================
// HERO SLIDER
// ===========================
const heroTrack = document.getElementById('hero-track');
const heroDots  = document.querySelectorAll('.hdot');
const heroPrev  = document.getElementById('hero-prev');
const heroNext  = document.getElementById('hero-next');
const TOTAL_SLIDES = heroDots.length;
let currentSlide = 0;
let autoplayTimer;

function goToSlide(n) {
    currentSlide = (n + TOTAL_SLIDES) % TOTAL_SLIDES;
    heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    heroDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5500);
}

heroPrev.addEventListener('click', () => { prevSlide(); startAutoplay(); });
heroNext.addEventListener('click', () => { nextSlide(); startAutoplay(); });
heroDots.forEach(d => {
    d.addEventListener('click', () => { goToSlide(parseInt(d.dataset.i)); startAutoplay(); });
});

// Pause on hover
const heroEl = document.querySelector('.hero');
heroEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
heroEl.addEventListener('mouseleave', startAutoplay);

startAutoplay();

// Touch / swipe support
let touchStartX = 0;
heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
heroEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); startAutoplay(); }
});

// ===========================
// MOBILE MENU
// ===========================
const mobileMenuBtn    = document.getElementById('mobile-menu-btn');
const mobileMenu       = document.getElementById('mobile-menu');
const mobileOverlay    = document.getElementById('mobile-overlay');
const closeMobileBtn   = document.getElementById('close-mobile-menu');

function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMobileBtn.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-links a').forEach(a => a.addEventListener('click', closeMobileMenu));

// ===========================
// SEARCH
// ===========================
const searchInput = document.getElementById('search-input');
const searchBtn   = document.querySelector('.search-btn');

function doSearch() {
    const q = searchInput.value.trim();
    if (q) alert(`Suche nach: "${q}"`);
}
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

// ===========================
// NEWSLETTER FORMS
// ===========================
[document.getElementById('newsletter-form'), document.getElementById('footer-newsletter-form')]
    .filter(Boolean)
    .forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                alert(`Danke für deine Anmeldung!\n\nE-Mail: ${email}`);
                form.reset();
            }
        });
    });

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id.length > 1 && document.querySelector(id)) {
            e.preventDefault();
            document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });

const revealEls = '.product-card, .blog-card, .feat-card, .brand-tile, .pop-cat, .cat-main, .promo-card';
document.querySelectorAll(revealEls).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .5s ease ${(i % 8) * 0.05}s, transform .5s ease ${(i % 8) * 0.05}s`;
    revealObserver.observe(el);
});

// ===========================
// CART BADGE BOUNCE ANIMATION
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes cartBounce { 0%,100%{transform:scale(1)} 40%{transform:scale(1.4)} 70%{transform:scale(.9)} }
    #cart-icon.bounce .cart-badge { animation: cartBounce .45s ease; }
`;
document.head.appendChild(style);

// Initialize
renderCart();
