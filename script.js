// ============================================================
// GLOBAL ERROR HANDLING
// ============================================================
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', message, source, lineno, colno, error);
    showToast('⚠️ Something went wrong. Please try again.', true);
    document.getElementById('debugMsg').innerHTML = 'Error: ' + message;
    return true;
};

async function safeAsync(fn, fallback = null) {
    try {
        return await fn();
    } catch (error) {
        console.error('SafeAsync Error:', error);
        showToast('⚠️ ' + (error.message || 'Something went wrong'), true);
        return fallback;
    }
}

// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
    apiKey: "AIzaSyAvbSJkEH3NDNy_SIaf0bJk0hkhknTRhno",
    authDomain: "globalbazaar-2c6cb.firebaseapp.com",
    projectId: "globalbazaar-2c6cb",
    storageBucket: "globalbazaar-2c6cb.firebasestorage.app",
    messagingSenderId: "734113870757",
    appId: "1:734113870757:web:653ac103c064685cbaee4c"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ============================================================
// IMAGE COMPRESSION - DO NOT CHANGE
// ============================================================
function compressImage(file, maxSizeMB = 0.5, maxWidth = 1024, maxHeight = 1024) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                let quality = 0.7;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                let attempt = 0;
                const maxAttempts = 5;
                const tryQuality = (q) => {
                    canvas.toBlob((blob) => {
                        const sizeMB = blob.size / (1024 * 1024);
                        if (sizeMB <= maxSizeMB || attempt >= maxAttempts) {
                            resolve(blob);
                        } else {
                            attempt++;
                            tryQuality(q * 0.85);
                        }
                    }, 'image/jpeg', q);
                };
                tryQuality(quality);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

async function uploadCompressedImage(file, type = 'image') {
    try {
        const compressedBlob = await compressImage(file);
        const formData = new FormData();
        formData.append('image', compressedBlob, `${type}_compressed.jpg`);
        formData.append('key', '99fb186efa7e996b0ce95f1ea83f90ab');
        const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) return data.data.url;
        else throw new Error('ImgBB upload failed');
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ============================================================
// SHIPPING ZONE SYSTEM - COMPLETE WITH FALLBACKS
// ============================================================

const SHIPPING_ZONES = {
    gcc: {
        name: "GCC",
        countries: ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Oman"],
        defaultCharge: 20,
        defaultFreeAbove: 150
    },
    southAsia: {
        name: "South Asia", 
        countries: ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka"],
        defaultCharge: 25,
        defaultFreeAbove: 200
    },
    southeastAsia: {
        name: "Southeast Asia",
        countries: ["Malaysia", "Indonesia", "Philippines", "Thailand", "Vietnam", "Singapore"],
        defaultCharge: 30,
        defaultFreeAbove: 250
    },
    eastAsia: {
        name: "East Asia",
        countries: ["China", "Japan", "South Korea", "Taiwan"],
        defaultCharge: 35,
        defaultFreeAbove: 300
    },
    europe: {
        name: "Europe",
        countries: ["Germany", "France", "UK", "Italy", "Spain", "Switzerland", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Belgium", "Austria", "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Greece", "Turkey"],
        defaultCharge: 30,
        defaultFreeAbove: 250
    },
    americas: {
        name: "Americas",
        countries: ["USA", "Canada", "Mexico", "Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay"],
        defaultCharge: 40,
        defaultFreeAbove: 350
    },
    oceania: {
        name: "Oceania",
        countries: ["Australia", "New Zealand"],
        defaultCharge: 45,
        defaultFreeAbove: 400
    }
};

function getCountryZone(countryName) {
    if (!countryName) return 'international';
    for (let [zoneKey, zone] of Object.entries(SHIPPING_ZONES)) {
        if (zone.countries.some(c => c.toLowerCase() === countryName.toLowerCase())) {
            return zoneKey;
        }
    }
    return 'international';
}

function getShippingCharge(sellerZones, buyerCountry, cartTotal = 0) {
    try {
        if (!sellerZones || Object.keys(sellerZones).length === 0) {
            if (buyerCountry === "SA" || buyerCountry === "Saudi Arabia") {
                return cartTotal > 100 ? 0 : 15;
            }
            return cartTotal > 200 ? 0 : 25;
        }
        
        let buyerZone = null;
        let zoneCharge = 25;
        let freeAbove = Infinity;
        
        if (sellerZones.local && sellerZones.local.countries) {
            const localMatch = sellerZones.local.countries.some(c => 
                c.toLowerCase() === buyerCountry.toLowerCase()
            );
            if (localMatch) {
                buyerZone = 'local';
                zoneCharge = parseFloat(sellerZones.local.charge) || 15;
                freeAbove = parseFloat(sellerZones.local.freeAbove) || 100;
            }
        }
        
        if (!buyerZone && sellerZones.regional && sellerZones.regional.countries) {
            const regionalMatch = sellerZones.regional.countries.some(c => 
                c.toLowerCase() === buyerCountry.toLowerCase()
            );
            if (regionalMatch) {
                buyerZone = 'regional';
                zoneCharge = parseFloat(sellerZones.regional.charge) || 25;
                freeAbove = parseFloat(sellerZones.regional.freeAbove) || 200;
            }
        }
        
        if (!buyerZone && sellerZones.international) {
            buyerZone = 'international';
            zoneCharge = parseFloat(sellerZones.international.charge) || 40;
            freeAbove = parseFloat(sellerZones.international.freeAbove) || 300;
        }
        
        if (!buyerZone) {
            return cartTotal > 200 ? 0 : 25;
        }
        
        if (cartTotal >= freeAbove && freeAbove > 0) {
            return 0;
        }
        
        return zoneCharge;
        
    } catch (error) {
        console.error('Shipping calculation error:', error);
        return cartTotal > 200 ? 0 : 25;
    }
}

function setupShippingZonesForSeller(country) {
    try {
        if (!country) {
            return {
                local: { countries: ["Saudi Arabia"], charge: 15, freeAbove: 100 },
                regional: { countries: ["UAE", "Qatar", "Kuwait", "Bahrain", "Oman"], charge: 25, freeAbove: 200 },
                international: { countries: [], charge: 40, freeAbove: 300 }
            };
        }
        
        const zoneKey = getCountryZone(country);
        const zones = {
            local: { countries: [country], charge: 15, freeAbove: 100 },
            regional: { countries: [], charge: 25, freeAbove: 200 },
            international: { countries: [], charge: 40, freeAbove: 300 }
        };
        
        if (zoneKey && SHIPPING_ZONES[zoneKey]) {
            const regionalCountries = SHIPPING_ZONES[zoneKey].countries.filter(c => 
                c.toLowerCase() !== country.toLowerCase()
            );
            zones.regional.countries = regionalCountries;
        }
        
        const allCountries = [];
        for (let zone of Object.values(SHIPPING_ZONES)) {
            allCountries.push(...zone.countries);
        }
        
        const internationalCountries = allCountries.filter(c => 
            c.toLowerCase() !== country.toLowerCase() && 
            !zones.regional.countries.some(rc => rc.toLowerCase() === c.toLowerCase())
        );
        zones.international.countries = internationalCountries;
        
        return zones;
        
    } catch (error) {
        console.error('Setup shipping zones error:', error);
        return {
            local: { countries: [country || "Saudi Arabia"], charge: 15, freeAbove: 100 },
            regional: { countries: [], charge: 25, freeAbove: 200 },
            international: { countries: [], charge: 40, freeAbove: 300 }
        };
    }
}

// ============================================================
// PRICE CALCULATION WITH SHIPPING
// ============================================================

function calculateFinalPrice(basePrice, sellerId, buyerCountry, cartTotal = 0, sellerObj = null) {
    try {
        let seller = sellerObj;
        if (!seller && sellerId) {
            seller = sellers.find(s => s.id === sellerId);
        }
        
        if (!seller || sellerId === 0 || sellerId === '0') {
            let shippingCharge = 0;
            if (buyerCountry === "SA" || buyerCountry === "Saudi Arabia") {
                shippingCharge = cartTotal > 100 ? 0 : 15;
            } else {
                shippingCharge = cartTotal > 200 ? 0 : 25;
            }
            
            let gatewayFee = (basePrice * GATEWAY_FEE_PERCENT) + GATEWAY_FEE_FIXED;
            let commission = basePrice * PLATFORM_COMMISSION;
            let total = basePrice + gatewayFee + commission + HANDLING_FEE + shippingCharge;
            
            return {
                total: total,
                basePrice: basePrice,
                shipping: shippingCharge,
                commission: commission,
                gateway: gatewayFee,
                handling: HANDLING_FEE,
                sellerEarning: basePrice - commission - HANDLING_FEE
            };
        }
        
        const shippingCharge = getShippingCharge(
            seller.shippingZones || setupShippingZonesForSeller(seller.country),
            buyerCountry,
            cartTotal
        );
        
        let gatewayFee = (basePrice * GATEWAY_FEE_PERCENT) + GATEWAY_FEE_FIXED;
        let commission = basePrice * PLATFORM_COMMISSION;
        let total = basePrice + gatewayFee + commission + HANDLING_FEE + shippingCharge;
        
        return {
            total: total,
            basePrice: basePrice,
            shipping: shippingCharge,
            commission: commission,
            gateway: gatewayFee,
            handling: HANDLING_FEE,
            sellerEarning: basePrice - commission - HANDLING_FEE
        };
        
    } catch (error) {
        console.error('Price calculation error:', error);
        let total = basePrice + (basePrice * 0.10) + 1.50;
        return {
            total: total,
            basePrice: basePrice,
            shipping: 0,
            commission: basePrice * 0.10,
            gateway: 0.49,
            handling: HANDLING_FEE,
            sellerEarning: basePrice * 0.90
        };
    }
}

// ============================================================
// DEFAULT PRODUCTS - 5 CATEGORIES, 15 PRODUCTS
// ============================================================

const defaultProducts = [
    // ===== ELECTRONICS (3) =====
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Wireless Headphones Pro", price: 89.99, category: "Electronics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"], description: "Premium wireless headphones with active noise cancellation and 30hr battery life.", stock: 15, weight: 0.5, size: { length: 20, width: 15, height: 8 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Smart Watch Series 8", price: 199.99, category: "Electronics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"], description: "Advanced smart watch with heart rate monitor, GPS, and 7-day battery life.", stock: 8, weight: 0.3, size: { length: 12, width: 8, height: 3 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Bluetooth Speaker X3", price: 49.99, category: "Electronics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"], description: "Portable waterproof Bluetooth speaker with 360° sound and 20hr playtime.", stock: 20, weight: 0.4, size: { length: 18, width: 10, height: 10 } },

    // ===== FASHION (3) =====
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Classic Cotton T-Shirt", price: 24.99, category: "Fashion", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"], description: "100% combed cotton t-shirt, available in multiple colors. Regular fit.", stock: 30, weight: 0.3, size: { length: 25, width: 20, height: 5 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Leather Jacket Premium", price: 149.99, category: "Fashion", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"], description: "Genuine leather jacket with premium zippers and warm inner lining.", stock: 5, weight: 1.2, size: { length: 30, width: 25, height: 10 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Running Shoes Air Max", price: 79.99, category: "Fashion", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], description: "Lightweight running shoes with air cushioning technology.", stock: 12, weight: 0.8, size: { length: 30, width: 15, height: 12 } },

    // ===== HOME & KITCHEN (3) =====
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Non-Stick Cookware Set", price: 129.99, category: "Home & Kitchen", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1584991106646-4fb6fb2d1485?w=400", images: ["https://images.unsplash.com/photo-1584991106646-4fb6fb2d1485?w=400"], description: "5-piece non-stick cookware set with induction compatible base.", stock: 10, weight: 3.5, size: { length: 40, width: 30, height: 20 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Coffee Maker Deluxe", price: 89.99, category: "Home & Kitchen", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1565205610303-11fe6b1f9a35?w=400", images: ["https://images.unsplash.com/photo-1565205610303-11fe6b1f9a35?w=400"], description: "Programmable coffee maker with thermal carafe and 12-cup capacity.", stock: 7, weight: 2.5, size: { length: 35, width: 20, height: 25 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Kitchen Knife Set", price: 59.99, category: "Home & Kitchen", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1576521890258-0d8e8e67a5cc?w=400", images: ["https://images.unsplash.com/photo-1576521890258-0d8e8e67a5cc?w=400"], description: "Premium 6-piece kitchen knife set with wooden storage block.", stock: 15, weight: 1.5, size: { length: 30, width: 15, height: 8 } },

    // ===== BEAUTY & COSMETICS (3) =====
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Facial Cleanser Set", price: 34.99, category: "Beauty & Cosmetics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"], description: "Natural facial cleanser set with vitamin C and hyaluronic acid.", stock: 25, weight: 0.2, size: { length: 10, width: 8, height: 5 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Makeup Kit Professional", price: 49.99, category: "Beauty & Cosmetics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400", images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400"], description: "Complete 42-piece professional makeup kit with case.", stock: 10, weight: 0.5, size: { length: 20, width: 15, height: 8 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Perfume Collection", price: 79.99, category: "Beauty & Cosmetics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"], description: "Luxury perfume collection with 5 different fragrances.", stock: 8, weight: 0.3, size: { length: 15, width: 10, height: 8 } },

    // ===== BOOKS & STATIONERY (3) =====
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Business Book Collection", price: 39.99, category: "Books & Stationery", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", images: ["https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"], description: "Set of 5 best-selling business and self-development books.", stock: 20, weight: 1.2, size: { length: 25, width: 18, height: 12 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Premium Notebook Set", price: 19.99, category: "Books & Stationery", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400", images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400"], description: "3-pack premium leather-bound notebooks with fountain pen.", stock: 30, weight: 0.4, size: { length: 22, width: 15, height: 3 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Art Supplies Kit", price: 29.99, category: "Books & Stationery", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"], description: "Complete art supplies kit with 120 pieces including sketch pens, pencils, and paints.", stock: 15, weight: 0.8, size: { length: 28, width: 20, height: 6 } }
];

async function seedProductsIfEmpty() {
    try {
        const snapshot = await db.collection("products").get();
        if (snapshot.empty) {
            console.log('🌱 Seeding 15 default products...');
            for (let p of defaultProducts) {
                const calc = calculateProductPrice(p.price);
                await db.collection("products").add({
                    ...p,
                    price: calc.publicPrice,
                    publicPrice: calc.publicPrice,
                    gatewayFee: calc.gatewayFee,
                    handlingFee: calc.handlingFee,
                    commission: calc.commission,
                    sellerEarning: calc.sellerEarning,
                    platformRevenue: calc.platformRevenue,
                    createdAt: new Date().toISOString()
                });
            }
            console.log("✅ Seeded 15 default products");
        }
    } catch (e) { console.error('Seed error:', e); }
}
seedProductsIfEmpty();

// ============================================================
// GLOBAL VARIABLES
// ============================================================
let products = [];
let sellers = [];
let currentSeller = null;
let cart = JSON.parse(localStorage.getItem('gb_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('gb_wishlist')) || [];
let orders = JSON.parse(localStorage.getItem('gb_orders')) || [];
let platformEarnings = parseFloat(localStorage.getItem('gb_platform_earnings')) || 0;
let pendingWithdrawals = JSON.parse(localStorage.getItem('gb_pending_withdrawals')) || [];
let savedCards = JSON.parse(localStorage.getItem('gb_saved_cards')) || [];
let savedAddresses = JSON.parse(localStorage.getItem('gb_saved_addresses')) || [];
let notifications = JSON.parse(localStorage.getItem('gb_notifications')) || [];
let selectedCurrency = localStorage.getItem('selectedCurrency') || 'SAR';
let buyerCountry = localStorage.getItem('buyerCountry') || 'SA';
let sellerRevenueChart = null;
let currentBuyer = null;
let isAdminLoggedIn = false;
let verificationCheckInterval = null;

// ============================================================
// TELEGRAM NOTIFICATIONS
// ============================================================
const TELEGRAM_BOT_TOKEN = "8328824652:AAE-b4o6DaFDa9WPtZfrOfM7SYGU9gUa9HQ";
const TELEGRAM_CHAT_ID = "7111653640";
async function sendTelegramMessage(msg) {
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'HTML' })
        });
    } catch(e) { console.error('Telegram error:', e); }
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function addNotification(msg, type = 'info') {
    let n = { id: Date.now(), message: msg, type, date: new Date().toLocaleString(), read: false };
    notifications.unshift(n);
    if (notifications.length > 50) notifications.pop();
    localStorage.setItem('gb_notifications', JSON.stringify(notifications));
    updateNotificationUI();
    showToast(msg, false);
}

function updateNotificationUI() {
    let unread = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.innerText = unread > 0 ? unread : '0';
        badge.style.display = 'inline-block';
        badge.style.background = '#ef4444';
    }
    let html = notifications.map(n => `<div class="notification-item" data-id="${n.id}" style="${n.read ? 'opacity:0.6' : ''}"><strong>${n.type === 'order' ? '🛍️' : (n.type === 'payment' ? '💰' : 'ℹ️')}</strong> ${n.message}<br><small>${n.date}</small></div>`).join('');
    if (notifications.length === 0) html = '<div style="padding:20px;text-align:center;">No notifications</div>';
    document.getElementById('notificationsList').innerHTML = html;
    document.querySelectorAll('.notification-item').forEach(el => el.addEventListener('click', () => {
        let id = parseInt(el.dataset.id);
        let nf = notifications.find(n => n.id === id);
        if (nf) nf.read = true;
        localStorage.setItem('gb_notifications', JSON.stringify(notifications));
        updateNotificationUI();
    }));
}

document.getElementById('notificationBell')?.addEventListener('click', () => {
    let p = document.getElementById('notificationPanel');
    if (p) p.style.display = p.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-bell') && !e.target.closest('#notificationPanel')) {
        let p = document.getElementById('notificationPanel');
        if (p) p.style.display = 'none';
    }
});

let isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) document.body.classList.add('dark-mode');
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
document.getElementById('drawerDarkModeToggle')?.addEventListener('click', () => { toggleDarkMode(); closeDrawer(); });

let productReviews = JSON.parse(localStorage.getItem('gb_reviews')) || {};
function renderReviewStars(containerId, onRatingSelect) {
    let cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        let s = document.createElement('span');
        s.innerHTML = '☆';
        s.style.cssText = 'font-size:28px;cursor:pointer;color:#cbd5e1;';
        s.addEventListener('mouseenter', () => {
            for (let ch of cont.children) ch.innerHTML = '☆';
            for (let j = 0; j < i; j++) cont.children[j].innerHTML = '★';
        });
        s.addEventListener('mouseleave', () => {
            let cur = onRatingSelect.currentRating || 0;
            for (let j = 0; j < cont.children.length; j++) cont.children[j].innerHTML = j < cur ? '★' : '☆';
        });
        s.addEventListener('click', () => {
            onRatingSelect.currentRating = i;
            onRatingSelect(i);
        });
        cont.appendChild(s);
    }
}
function addReview(pid, rating, text, name) {
    if (!productReviews[pid]) productReviews[pid] = [];
    productReviews[pid].push({ rating, review: text, userName: name, date: new Date().toLocaleString() });
    localStorage.setItem('gb_reviews', JSON.stringify(productReviews));
    addNotification('New review added!', 'info');
    if (currentProduct) openProduct(pid);
}
function shareOnWhatsApp(p, price) {
    let text = `Check out ${p.name} on GlobalBazaar!\nPrice: ${getCurrencySymbol()}${convertPrice(price)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
function renderTrackingMap(o) {
    let steps = [
        { name: 'Order Placed', status: o.status !== 'Processing' ? 'completed' : (o.status === 'Processing' ? 'active' : 'pending') },
        { name: 'Processing', status: o.status !== 'Processing' ? 'completed' : 'active' },
        { name: 'Shipped', status: o.status === 'Shipped' || o.status === 'Delivered' || o.status === 'Completed' ? 'completed' : 'pending' },
        { name: 'Delivered', status: o.status === 'Delivered' || o.status === 'Completed' ? 'completed' : 'pending' }
    ];
    return `<div class="tracking-map"><div class="tracking-steps">${steps.map(s => `<div class="tracking-step ${s.status === 'completed' ? 'active' : (s.status === 'active' ? 'active' : '')}">${s.name}</div>`).join('')}</div><div style="margin-top:15px;">📮 Tracking #: ${o.trackingNumber || 'Generating...'}</div></div>`;
}
function showDocumentModal(docData, docType, sellerName) {
    let modalImg = document.getElementById('documentModalImg'), modalText = document.getElementById('documentModalText');
    if (docData && docData.startsWith('data:image')) {
        modalImg.style.display = 'block';
        modalImg.src = docData;
        modalText.innerHTML = `<strong>${sellerName}</strong><br>Document Type: ${docType}`;
    } else {
        modalImg.style.display = 'none';
        modalText.innerHTML = `<strong>${sellerName}</strong><br>Document Type: ${docType}<br>No image.`;
    }
    document.getElementById('documentModal').style.display = 'block';
}
function closeDocumentModal() { document.getElementById('documentModal').style.display = 'none'; }

const countryCodes = [
    {code:"+91",name:"India",flag:"🇮🇳"},{code:"+92",name:"Pakistan",flag:"🇵🇰"},{code:"+880",name:"Bangladesh",flag:"🇧🇩"},{code:"+977",name:"Nepal",flag:"🇳🇵"},{code:"+94",name:"Sri Lanka",flag:"🇱🇰"},{code:"+60",name:"Malaysia",flag:"🇲🇾"},{code:"+62",name:"Indonesia",flag:"🇮🇩"},{code:"+63",name:"Philippines",flag:"🇵🇭"},{code:"+66",name:"Thailand",flag:"🇹🇭"},{code:"+84",name:"Vietnam",flag:"🇻🇳"},{code:"+86",name:"China",flag:"🇨🇳"},{code:"+81",name:"Japan",flag:"🇯🇵"},{code:"+82",name:"South Korea",flag:"🇰🇷"},
    {code:"+49",name:"Germany",flag:"🇩🇪"},{code:"+33",name:"France",flag:"🇫🇷"},{code:"+44",name:"UK",flag:"🇬🇧"},{code:"+39",name:"Italy",flag:"🇮🇹"},{code:"+34",name:"Spain",flag:"🇪🇸"},{code:"+41",name:"Switzerland",flag:"🇨🇭"},{code:"+31",name:"Netherlands",flag:"🇳🇱"},{code:"+46",name:"Sweden",flag:"🇸🇪"},{code:"+47",name:"Norway",flag:"🇳🇴"},{code:"+45",name:"Denmark",flag:"🇩🇰"},{code:"+358",name:"Finland",flag:"🇫🇮"},{code:"+32",name:"Belgium",flag:"🇧🇪"},{code:"+43",name:"Austria",flag:"🇦🇹"},{code:"+48",name:"Poland",flag:"🇵🇱"},{code:"+420",name:"Czech Republic",flag:"🇨🇿"},{code:"+36",name:"Hungary",flag:"🇭🇺"},{code:"+40",name:"Romania",flag:"🇷🇴"},{code:"+359",name:"Bulgaria",flag:"🇧🇬"},{code:"+30",name:"Greece",flag:"🇬🇷"},{code:"+90",name:"Turkey",flag:"🇹🇷"},
    {code:"+966",name:"Saudi Arabia",flag:"🇸🇦"},{code:"+971",name:"UAE",flag:"🇦🇪"},{code:"+974",name:"Qatar",flag:"🇶🇦"},{code:"+968",name:"Oman",flag:"🇴🇲"},{code:"+965",name:"Kuwait",flag:"🇰🇼"},{code:"+973",name:"Bahrain",flag:"🇧🇭"},
    {code:"+1",name:"USA",flag:"🇺🇸"},{code:"+1",name:"Canada",flag:"🇨🇦"},{code:"+52",name:"Mexico",flag:"🇲🇽"},
    {code:"+55",name:"Brazil",flag:"🇧🇷"},{code:"+54",name:"Argentina",flag:"🇦🇷"},{code:"+57",name:"Colombia",flag:"🇨🇴"},{code:"+56",name:"Chile",flag:"🇨🇱"},{code:"+51",name:"Peru",flag:"🇵🇪"},{code:"+58",name:"Venezuela",flag:"🇻🇪"},{code:"+593",name:"Ecuador",flag:"🇪🇨"},{code:"+591",name:"Bolivia",flag:"🇧🇴"},{code:"+595",name:"Paraguay",flag:"🇵🇾"},{code:"+598",name:"Uruguay",flag:"🇺🇾"},
    {code:"+61",name:"Australia",flag:"🇦🇺"},{code:"+64",name:"New Zealand",flag:"🇳🇿"}
];
const shippingCountries = ["India","Pakistan","Bangladesh","Nepal","Sri Lanka","Malaysia","Indonesia","Philippines","Thailand","Vietnam","China","Japan","South Korea","Germany","France","UK","Italy","Spain","Switzerland","Netherlands","Sweden","Norway","Denmark","Finland","Belgium","Austria","Poland","Czech Republic","Hungary","Romania","Bulgaria","Greece","Turkey","Saudi Arabia","UAE","Qatar","Oman","Kuwait","Bahrain","USA","Canada","Mexico","Brazil","Argentina","Colombia","Chile","Peru","Venezuela","Ecuador","Bolivia","Paraguay","Uruguay","Australia","New Zealand"];
function initCountrySearch(inputId,dropdownId,selectId){
    let inp=document.getElementById(inputId), dd=document.getElementById(dropdownId), sel=document.getElementById(selectId);
    if(!inp||!dd) return;
    countryCodes.forEach(c=>{ let opt=document.createElement('option'); opt.value=c.code; opt.text=`${c.flag} ${c.name} (${c.code})`; sel.appendChild(opt); });
    function show(){
        let search=inp.value.toLowerCase();
        let filt=countryCodes.filter(c=>c.name.toLowerCase().includes(search)||c.code.includes(search));
        dd.innerHTML=filt.map(c=>`<div data-code="${c.code}">${c.flag} ${c.name} (${c.code})</div>`).join('');
        dd.style.display='block';
        dd.querySelectorAll('div').forEach(div=>div.addEventListener('click',()=>{ inp.value=div.innerText; sel.value=div.dataset.code; dd.style.display='none'; }));
    }
    inp.addEventListener('focus',show); inp.addEventListener('input',show);
    document.addEventListener('click',(e)=>{ if(!inp.contains(e.target)&&!dd.contains(e.target)) dd.style.display='none'; });
}
initCountrySearch('deliveryCountrySearch','deliveryCountryDropdown','deliveryCountryCode');
initCountrySearch('sellerCountrySearch','sellerCountryDropdown','sellerCountryCode');
let delCountry=document.getElementById('deliveryCountry'); if(delCountry) shippingCountries.forEach(c=>{ let opt=document.createElement('option'); opt.value=c; opt.textContent=c; delCountry.appendChild(opt); });
let sellerCountryReg=document.getElementById('sellerCountryReg'); if(sellerCountryReg) shippingCountries.forEach(c=>{ let opt=document.createElement('option'); opt.value=c; opt.textContent=c; sellerCountryReg.appendChild(opt); });

// ============================================================
// CURRENCY
// ============================================================
const fxRates={SAR:3.75,USD:1,EUR:0.92,GBP:0.78,INR:83.5,PKR:278,NPR:133.5,BDT:117,LKR:305,AED:3.67,CAD:1.36,AUD:1.52,SGD:1.35,MYR:4.70,THB:36.5,JPY:150.2,CNY:7.25};
const currencySymbols={SAR:"SAR ",USD:"$",EUR:"€",GBP:"£",INR:"₹",PKR:"₨",NPR:"रू ",BDT:"৳",LKR:"Rs ",AED:"د.إ ",CAD:"$",AUD:"$",SGD:"$",MYR:"RM ",THB:"฿",JPY:"¥",CNY:"¥"};
function convertPrice(usd){ return (usd*fxRates[selectedCurrency]).toFixed(2); }
function getCurrencySymbol(){ return currencySymbols[selectedCurrency]; }
document.getElementById('currencySelect').value=selectedCurrency;
document.getElementById('currencySelect').addEventListener('change',(e)=>{ selectedCurrency=e.target.value; localStorage.setItem('selectedCurrency',selectedCurrency); renderProducts(); updateCartUI(); renderCartPage(); if(currentSeller) renderSellerDashboard(); showToast(`Currency: ${selectedCurrency}`,false); });

// ============================================================
// DYNAMIC PRICE CALCULATION - WITH SHIPPING
// ============================================================
const PLATFORM_COMMISSION = 0.10;
const GATEWAY_FEE_PERCENT = 0.0299;
const GATEWAY_FEE_FIXED = 0.49;
const HANDLING_FEE = 1.50;

function calculateProductPrice(basePrice) {
    let gatewayFee = (basePrice * GATEWAY_FEE_PERCENT) + GATEWAY_FEE_FIXED;
    let handlingFee = HANDLING_FEE;
    let publicPrice = basePrice + gatewayFee + handlingFee;
    let commission = basePrice * PLATFORM_COMMISSION;
    let sellerEarning = basePrice - commission - handlingFee;
    let platformRevenue = gatewayFee + commission + handlingFee;
    return { basePrice, gatewayFee, handlingFee, publicPrice, commission, sellerEarning, platformRevenue };
}

// ============================================================
// EMAIL VERIFICATION MODAL FUNCTIONS
// ============================================================
function showVerifyModal() {
    document.getElementById('verifyModal').style.display = 'flex';
    startVerificationCheck();
}

function enableResend() {
    const checkbox = document.getElementById('checkSpam');
    const btn = document.getElementById('resendBtn');
    if(checkbox.checked) {
        btn.disabled = false;
        btn.className = 'resend-btn active';
    } else {
        btn.disabled = true;
        btn.className = 'resend-btn';
    }
}

async function resendEmail() {
    const user = auth.currentUser;
    if (user) {
        try {
            await user.sendEmailVerification();
            alert("✅ Verification link resent! Please check your inbox and spam folder.");
        } catch (error) {
            alert("❌ Error sending email: " + error.message);
        }
    } else {
        alert("Please login first.");
    }
}

function checkEmailVerificationStatus() {
    const user = auth.currentUser;
    if (user) {
        user.reload().then(() => {
            if (user.emailVerified) {
                document.getElementById('verifyModal').style.display = 'none';
                stopVerificationCheck();
                showToast("✅ Email verified! You can now access your shop.", false);
                showMyShopLogin();
            }
        }).catch(err => console.error('Reload error:', err));
    }
}

function startVerificationCheck() {
    if (verificationCheckInterval) clearInterval(verificationCheckInterval);
    verificationCheckInterval = setInterval(checkEmailVerificationStatus, 5000);
}

function stopVerificationCheck() {
    if (verificationCheckInterval) {
        clearInterval(verificationCheckInterval);
        verificationCheckInterval = null;
    }
}

// ============================================================
// AUTHENTICATION - FIXED: SELLER LOGIN
// ============================================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentBuyer = user;
        
        const sellerSnapshot = await db.collection("sellers").where("uid", "==", user.uid).get();
        
        if (!sellerSnapshot.empty) {
            const sellerData = sellerSnapshot.docs[0].data();
            const sellerId = sellerSnapshot.docs[0].id;
            
            if (user.emailVerified && !sellerData.emailVerified) {
                await db.collection("sellers").doc(sellerId).update({
                    emailVerified: true,
                    kycStatus: 'pending'
                });
                showToast("✅ Email verified! Your account is now active. Waiting for admin KYC approval.", false);
                addNotification(`Seller ${sellerData.shopName} verified email! Now pending KYC.`, 'info');
                await sendTelegramMessage(`✅ Email verified: ${sellerData.shopName}\nNow pending KYC approval.`);
                
                currentSeller = {
                    name: sellerData.fullName,
                    email: sellerData.email,
                    role: 'seller',
                    sellerId: sellerId,
                    phone: sellerData.phone,
                    kycStatus: 'pending',
                    shopName: sellerData.shopName
                };
                localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
                document.getElementById('sellerRegisterBox').style.display = 'none';
                document.getElementById('sellerDashboard').style.display = 'block';
                renderSellerDashboard();
                return;
            }
            
            if (sellerData.emailVerified) {
                const freshSellerData = sellerSnapshot.docs[0].data();
                
                currentSeller = {
                    name: freshSellerData.fullName,
                    email: freshSellerData.email,
                    role: 'seller',
                    sellerId: sellerId,
                    phone: freshSellerData.phone,
                    kycStatus: freshSellerData.kycStatus || 'pending',
                    shopName: freshSellerData.shopName,
                    earnings: freshSellerData.earnings || 0
                };
                localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
                
                if (freshSellerData.kycStatus === 'verified') {
                    document.getElementById('sellerRegisterBox').style.display = 'none';
                    document.getElementById('sellerDashboard').style.display = 'block';
                    renderSellerDashboard();
                    showToast(`Welcome back ${freshSellerData.shopName}!`, false);
                } else if (freshSellerData.kycStatus === 'pending') {
                    document.getElementById('sellerRegisterBox').style.display = 'none';
                    document.getElementById('sellerDashboard').style.display = 'block';
                    renderSellerDashboard();
                    showToast("⏳ Your KYC is pending verification. Please wait for admin approval.", true);
                } else if (freshSellerData.kycStatus === 'rejected') {
                    document.getElementById('sellerRegisterBox').style.display = 'block';
                    document.getElementById('sellerDashboard').style.display = 'none';
                    showToast("❌ Your KYC was rejected. Please contact support.", true);
                }
            }
        } else {
            if (currentSeller) {
                currentSeller = null;
                localStorage.removeItem('gb_current_seller');
                document.getElementById('sellerRegisterBox').style.display = 'block';
                document.getElementById('sellerDashboard').style.display = 'none';
            }
        }
    } else {
        currentBuyer = null;
        currentSeller = null;
        localStorage.removeItem('gb_current_seller');
        cart = [];
        updateCartUI();
        document.getElementById('sellerRegisterBox').style.display = 'block';
        document.getElementById('sellerDashboard').style.display = 'none';
    }
    renderProducts();
});

const storedSeller = localStorage.getItem('gb_current_seller');
if (storedSeller) {
    currentSeller = JSON.parse(storedSeller);
}

// ============================================================
// LOGIN
// ============================================================
document.getElementById('doLoginBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showToast("Please enter email and password", true); return; }
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showToast(`Welcome back ${userCredential.user.email}!`, false);
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        const sellerSnapshot = await db.collection("sellers").where("uid", "==", userCredential.user.uid).get();
        if (!sellerSnapshot.empty) {
            const sellerData = sellerSnapshot.docs[0].data();
            if (sellerData.kycStatus === 'verified') {
                setTimeout(() => {
                    showSection('seller');
                }, 1000);
            }
        }
        
        const pendingCheckout = sessionStorage.getItem('pendingCheckout');
        if (pendingCheckout === 'true') {
            sessionStorage.removeItem('pendingCheckout');
            const pendingCart = sessionStorage.getItem('pendingCart');
            if (pendingCart) {
                cart = JSON.parse(pendingCart);
                sessionStorage.removeItem('pendingCart');
                updateCartUI();
            }
            showSection('checkout');
            loadSavedAddresses();
        }
        await loadUserCart(userCredential.user.uid);
        renderCartPage();
    } catch (error) {
        if (error.code === 'auth/user-not-found') showToast("No account found", true);
        else if (error.code === 'auth/wrong-password') showToast("Wrong password", true);
        else showToast("Login failed: " + error.message, true);
    }
});

document.getElementById('doRegisterBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !password) { showToast("Please fill all fields", true); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters", true); return; }
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({ name, email, createdAt: new Date().toISOString(), role: 'buyer' });
        showToast("Account created successfully!", false);
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        const pendingCheckout = sessionStorage.getItem('pendingCheckout');
        if (pendingCheckout === 'true') {
            sessionStorage.removeItem('pendingCheckout');
            const pendingCart = sessionStorage.getItem('pendingCart');
            if (pendingCart) {
                cart = JSON.parse(pendingCart);
                sessionStorage.removeItem('pendingCart');
                updateCartUI();
            }
            showSection('checkout');
            loadSavedAddresses();
        }
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') showToast("Email already registered", true);
        else showToast("Registration failed: " + error.message, true);
    }
});

document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const userRef = db.collection('users').doc(result.user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({ name: result.user.displayName, email: result.user.email, createdAt: new Date().toISOString(), role: 'buyer' });
        }
        showToast(`Welcome ${result.user.displayName}!`, false);
        document.getElementById('loginModal').style.display = 'none';
        const pendingCheckout = sessionStorage.getItem('pendingCheckout');
        if (pendingCheckout === 'true') {
            sessionStorage.removeItem('pendingCheckout');
            const pendingCart = sessionStorage.getItem('pendingCart');
            if (pendingCart) {
                cart = JSON.parse(pendingCart);
                sessionStorage.removeItem('pendingCart');
                updateCartUI();
            }
            showSection('checkout');
            loadSavedAddresses();
        }
    } catch (error) { showToast("Google sign-in failed: " + error.message, true); }
});

document.getElementById('googleSignUpBtn')?.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const userRef = db.collection('users').doc(result.user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({ name: result.user.displayName, email: result.user.email, createdAt: new Date().toISOString(), role: 'buyer' });
        }
        showToast(`Welcome ${result.user.displayName}!`, false);
        document.getElementById('loginModal').style.display = 'none';
        const pendingCheckout = sessionStorage.getItem('pendingCheckout');
        if (pendingCheckout === 'true') {
            sessionStorage.removeItem('pendingCheckout');
            const pendingCart = sessionStorage.getItem('pendingCart');
            if (pendingCart) {
                cart = JSON.parse(pendingCart);
                sessionStorage.removeItem('pendingCart');
                updateCartUI();
            }
            showSection('checkout');
            loadSavedAddresses();
        }
    } catch (error) { showToast("Google sign-up failed: " + error.message, true); }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await auth.signOut();
    showToast("Logged out successfully", false);
    cart = [];
    updateCartUI();
    renderCartPage();
    showSection('buyer');
    currentSeller = null;
    localStorage.removeItem('gb_current_seller');
    document.getElementById('sellerRegisterBox').style.display = 'block';
    document.getElementById('sellerDashboard').style.display = 'none';
});

async function saveUserCart(userId) {
    if (!userId) return;
    await db.collection('carts').doc(userId).set({ items: cart, updatedAt: new Date().toISOString() });
}

async function loadUserCart(userId) {
    if (!userId) return;
    const doc = await db.collection('carts').doc(userId).get();
    if (doc.exists && doc.data().items) {
        cart = doc.data().items;
        updateCartUI();
        renderCartPage();
    }
}

function showMyOrdersPage() {
    const user = auth.currentUser;
    if (!user) {
        showToast("Please login to view your orders", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    const myOrders = orders.filter(o => o.buyerEmail === user.email);
    if (myOrders.length === 0) {
        document.getElementById('buyerOrdersList').innerHTML = '<div class="premium-card"><p>No orders yet. Start shopping!</p></div>';
    } else {
        let ordersHtml = myOrders.map(o => `<div class="order-card"><strong>🔖 ${o.trackingNumber}</strong><br>${o.productName} x${o.qty}<br>${getCurrencySymbol()}${convertPrice(o.amount)}<br>Status: ${o.status}<br>${renderTrackingMap(o)}${o.trackingInfo ? `<br>📮 Tracking: ${o.trackingInfo.trackingNumber || o.trackingInfo}` : ''}<br>${o.status === "Shipped" ? `<button class="confirmReceivedBtn" data-id="${o.id}" style="background:#10b981;">✅ Received</button>` : ''}${o.status === "Processing" ? `<button class="cancelOrderBtn" data-id="${o.id}" style="background:#dc2626;">❌ Cancel Order</button>` : ''}</div>`).join('');
        document.getElementById('buyerOrdersList').innerHTML = ordersHtml;
        document.querySelectorAll('.confirmReceivedBtn').forEach(btn => btn.addEventListener('click', () => confirmOrderReceived(parseFloat(btn.dataset.id))));
        document.querySelectorAll('.cancelOrderBtn').forEach(btn => btn.addEventListener('click', () => cancelOrder(parseFloat(btn.dataset.id))));
    }
    showSection('profile');
}

// ============================================================
// FIRESTORE LISTENERS
// ============================================================
db.collection("products").onSnapshot(snapshot => {
    products = [];
    snapshot.forEach(doc => { products.push({ id: doc.id, ...doc.data() }); });
    renderProducts(); renderCats();
    document.getElementById('debugMsg').innerText = `Products: ${products.length}`;
});

db.collection("sellers").onSnapshot(snapshot => {
    sellers = [];
    snapshot.forEach(doc => { 
        sellers.push({ id: doc.id, ...doc.data() }); 
    });
    
    if (currentSeller) {
        const freshSeller = sellers.find(s => s.id === currentSeller.sellerId);
        if (freshSeller) {
            const oldStatus = currentSeller.kycStatus;
            currentSeller = { 
                ...currentSeller, 
                kycStatus: freshSeller.kycStatus, 
                earnings: freshSeller.earnings || 0,
                emailVerified: freshSeller.emailVerified
            };
            localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
            
            if (oldStatus !== 'verified' && freshSeller.kycStatus === 'verified') {
                showToast("✅ Your KYC has been verified! You can now access your shop.", false);
                addNotification('🎉 Your KYC has been approved!', 'info');
                sendTelegramMessage(`✅ KYC Approved: ${freshSeller.shopName}`);
                
                document.getElementById('sellerRegisterBox').style.display = 'none';
                document.getElementById('sellerDashboard').style.display = 'block';
                renderSellerDashboard();
            }
            
            if (freshSeller.kycStatus === 'pending' && currentSeller.kycStatus === 'pending') {
                document.getElementById('sellerRegisterBox').style.display = 'none';
                document.getElementById('sellerDashboard').style.display = 'block';
                renderSellerDashboard();
            }
            
            if (freshSeller.kycStatus === 'rejected') {
                document.getElementById('sellerRegisterBox').style.display = 'block';
                document.getElementById('sellerDashboard').style.display = 'none';
                currentSeller = null;
                localStorage.removeItem('gb_current_seller');
                showToast("❌ Your KYC was rejected. Please contact support.", true);
            }
        }
    }
    
    updateAdminPendingBadge();
    updateAdminMenuBadges();
    if (isAdminLoggedIn) loadAdminData();
});

function updateAdminPendingBadge() {
    const pendingSellers = sellers.filter(s => s.kycStatus === 'pending');
    const count = pendingSellers.length;
    const badge = document.getElementById('adminPendingBadge');
    if (badge) {
        if (count > 0) {
            badge.style.display = 'inline-block';
            badge.innerText = count;
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateAdminMenuBadges() {
    const pending = sellers.filter(s => s.kycStatus === 'pending').length;
    const verified = sellers.filter(s => s.kycStatus === 'verified').length;
    const withdrawals = pendingWithdrawals.filter(w => w.status === 'Pending').length;
    const pendingBadge = document.getElementById('pendingCountBadge');
    const verifiedBadge = document.getElementById('verifiedCountBadge');
    const withdrawalBadge = document.getElementById('withdrawalCountBadge');
    if (pendingBadge) pendingBadge.textContent = pending;
    if (verifiedBadge) verifiedBadge.textContent = verified;
    if (withdrawalBadge) withdrawalBadge.textContent = withdrawals;
}

document.getElementById('adminMenuBtn')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const menu = document.getElementById('adminDropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function(e) {
    const menu = document.getElementById('adminDropdownMenu');
    if (menu && !e.target.closest('#adminMenuBtn') && !e.target.closest('#adminDropdownMenu')) {
        menu.style.display = 'none';
    }
});

document.querySelectorAll('.admin-menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const section = this.dataset.section;
        document.getElementById('pendingKycList').style.display = 'none';
        document.getElementById('verifiedSellersList').style.display = 'none';
        document.getElementById('pendingWithdrawals').style.display = 'none';
        document.getElementById('adminOrdersList').style.display = 'none';
        const targetId = section === 'pending' ? 'pendingKycList' : 
                         section === 'verified' ? 'verifiedSellersList' : 'pendingWithdrawals';
        const target = document.getElementById(targetId);
        if (target) {
            target.style.display = 'block';
            if (section === 'pending') loadPendingSellers();
            else if (section === 'verified') loadVerifiedSellers();
            else if (section === 'withdrawals') loadWithdrawalsList();
        }
        document.getElementById('adminDropdownMenu').style.display = 'none';
    });
});

// ============================================================
// ADMIN - FIXED: VERIFICATION ONCE ONLY
// ============================================================

function loadPendingSellers() {
    const pending = sellers.filter(s => s.kycStatus === 'pending');
    const container = document.getElementById('pendingKycList');
    if (pending.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; background:#f8fafc; border-radius:12px;">✅ No pending KYC requests</div>';
        return;
    }
    let html = `<div style="margin-bottom:15px;"><strong>Total Pending: ${pending.length}</strong></div><div style="display:flex; flex-direction:column; gap:12px;">`;
    pending.forEach((seller, idx) => {
        html += `
            <div style="background:#f8fafc; border-radius:16px; padding:12px; border-left:4px solid #fbbf24;">
                <div style="font-weight:bold;">${idx+1}. ${seller.shopName}</div>
                <div>👤 ${seller.fullName}</div>
                <div>📧 ${seller.email}</div>
                <div>📞 ${seller.phone}</div>
                <div>📄 ${seller.docType} - ${seller.docNumber}</div>
                <div style="margin-top:8px;">
                    <button class="btn-approve" data-id="${seller.id}" style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:20px; margin-right:8px;">✅ Approve</button>
                    <button class="btn-reject" data-id="${seller.id}" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:20px;">❌ Reject</button>
                    <button class="btn-view-doc" onclick='viewSellerDocument("${seller.docImage}","${seller.docType}","${seller.shopName}")' style="background:#3b82f6; color:white; border:none; padding:4px 10px; border-radius:15px; margin-left:8px;">📄 View</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    container.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const sellerId = this.dataset.id;
            if (!sellerId) { showToast("Seller ID not found", true); return; }
            try {
                if (!isAdminLoggedIn) { showToast("Please login as admin", true); return; }
                
                const sellerRef = db.collection("sellers").doc(sellerId);
                const sellerDoc = await sellerRef.get();
                if (sellerDoc.exists && sellerDoc.data().kycStatus === 'verified') {
                    showToast("⚠️ This seller is already verified!", true);
                    return;
                }
                
                await sellerRef.update({ 
                    kycStatus: 'verified', 
                    verifiedAt: new Date().toISOString() 
                });
                
                showToast("✅ Seller approved successfully!", false);
                addNotification(`Seller KYC verified`, 'info');
                await sendTelegramMessage(`✅ KYC Verified: ${sellerDoc.data().shopName}`);
                
                const snapshot = await db.collection("sellers").get();
                sellers = [];
                snapshot.forEach(doc => { sellers.push({ id: doc.id, ...doc.data() }); });
                updateAdminPendingBadge();
                updateAdminMenuBadges();
                loadPendingSellers();
                document.getElementById('platformEarnings').innerHTML = `<h2>${getCurrencySymbol()}${convertPrice(platformEarnings)}</h2>`;
                
            } catch (error) {
                console.error("Approve error:", error);
                showToast("Error approving seller: " + error.message, true);
            }
        });
    });
    
    container.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const sellerId = this.dataset.id;
            if (!sellerId) { showToast("Seller ID not found", true); return; }
            const reason = prompt("Enter rejection reason:");
            if (reason === null) return;
            if (!reason.trim()) { showToast("Please enter a reason", true); return; }
            try {
                if (!isAdminLoggedIn) { showToast("Please login as admin", true); return; }
                
                const sellerRef = db.collection("sellers").doc(sellerId);
                const sellerDoc = await sellerRef.get();
                if (sellerDoc.exists && sellerDoc.data().kycStatus === 'rejected') {
                    showToast("⚠️ This seller is already rejected!", true);
                    return;
                }
                
                await sellerRef.update({ 
                    kycStatus: 'rejected', 
                    rejectionReason: reason.trim(),
                    rejectedAt: new Date().toISOString()
                });
                
                showToast("❌ Seller rejected", false);
                addNotification(`Seller KYC rejected: ${reason}`, 'info');
                await sendTelegramMessage(`❌ KYC Rejected: ${reason}`);
                
                const snapshot = await db.collection("sellers").get();
                sellers = [];
                snapshot.forEach(doc => { sellers.push({ id: doc.id, ...doc.data() }); });
                updateAdminPendingBadge();
                updateAdminMenuBadges();
                loadPendingSellers();
                document.getElementById('platformEarnings').innerHTML = `<h2>${getCurrencySymbol()}${convertPrice(platformEarnings)}</h2>`;
            } catch (error) {
                console.error("Reject error:", error);
                showToast("Error rejecting seller: " + error.message, true);
            }
        });
    });
}

function loadVerifiedSellers() {
    const verified = sellers.filter(s => s.kycStatus === 'verified');
    const container = document.getElementById('verifiedSellersList');
    if (verified.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; background:#f8fafc; border-radius:12px;">No verified sellers yet</div>';
        return;
    }
    let html = `<table class="kyc-table"><thead><tr><th>Shop</th><th>Owner</th><th>Email</th><th>Shipping Zones</th><th>Joined</th></tr></thead><tbody>`;
    verified.forEach(s => {
        let zones = '❌ Not set';
        if (s.shippingZones) {
            const local = s.shippingZones.local?.countries?.length || 0;
            const regional = s.shippingZones.regional?.countries?.length || 0;
            const international = s.shippingZones.international?.countries?.length || 0;
            zones = `📍${local} 🌏${regional} 🌐${international}`;
        }
        html += `<tr><td>🏪 ${s.shopName}</td><td>${s.fullName}</td><td>${s.email}</td><td style="font-size:12px;">${zones}</td><td>${new Date(s.createdAt).toLocaleDateString()}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function loadWithdrawalsList() {
    const container = document.getElementById('pendingWithdrawals');
    if (pendingWithdrawals.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; background:#f8fafc; border-radius:12px;">No pending withdrawals</div>';
        return;
    }
    let html = pendingWithdrawals.map(w => `<div class="order-card"><span>💰 ${getCurrencySymbol()}${convertPrice(w.amount)} - ${w.sellerName}</span><button class="approveBtn" data-id="${w.id}" style="background:#10b981; color:white; border:none; padding:4px 12px; border-radius:20px;">Approve</button></div>`).join('');
    container.innerHTML = html;
    container.querySelectorAll('.approveBtn').forEach(btn => {
        btn.addEventListener('click', async () => {
            let w = pendingWithdrawals.find(w => w.id === parseInt(btn.dataset.id));
            if(w){ w.status = 'Approved'; saveAllLocal(); showToast(`Approved ${getCurrencySymbol()}${convertPrice(w.amount)}`, false); await sendTelegramMessage(`💰 Withdrawal Approved: ${w.sellerName} - ${getCurrencySymbol()}${convertPrice(w.amount)}`); addNotification(`Withdrawal approved for ${w.sellerName}`, 'payment'); loadWithdrawalsList(); }
        });
    });
}

document.getElementById('adminLoginBtn')?.addEventListener('click', () => {
    const enteredKey = document.getElementById('adminKey').value;
    if (enteredKey === 'Haque0786@') {
        isAdminLoggedIn = true;
        document.getElementById('adminLoginBox').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminData();
        showToast("Admin logged in successfully!", false);
        document.getElementById('adminKey').value = '';
    } else {
        showToast("Wrong admin key!", true);
    }
});

document.getElementById('adminBackBtn')?.addEventListener('click', function() {
    document.getElementById('pendingKycList').style.display = 'none';
    document.getElementById('verifiedSellersList').style.display = 'none';
    document.getElementById('pendingWithdrawals').style.display = 'none';
    document.getElementById('adminOrdersList').style.display = 'none';
    showToast("Back to dashboard", false);
});

function loadAdminData() {
    if (!isAdminLoggedIn) {
        document.getElementById('adminLoginBox').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
        return;
    }
    document.getElementById('platformEarnings').innerHTML = `<h2>${getCurrencySymbol()}${convertPrice(platformEarnings)}</h2>`;
    updateAdminMenuBadges();
    updateAdminPendingBadge();
    document.getElementById('pendingKycList').style.display = 'none';
    document.getElementById('verifiedSellersList').style.display = 'none';
    document.getElementById('pendingWithdrawals').style.display = 'none';
    document.getElementById('adminOrdersList').style.display = 'none';
}

// ============================================================
// RENDER PRODUCTS WITH SHIPPING & SOLD OUT LABEL
// ============================================================
let currentCategory = "All";

function renderProductCard(p) {
    try {
        const seller = sellers.find(s => s.id === p.sellerId) || { 
            shopName: "GlobalBazaar", 
            country: "SA",
            shippingZones: null 
        };
        
        const final = calculateFinalPrice(
            p.price, 
            p.sellerId, 
            buyerCountry, 
            p.price,
            seller
        );
        
        const isSoldOut = p.stock <= 0;
        const stockBadge = isSoldOut ? 
            `<div style="background:#dc2626; color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; position:absolute; top:10px; right:10px; z-index:10;">
                🔴 SOLD OUT
            </div>` :
            (p.stock < 5 ? 
                `<div style="background:#f59e0b; color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; position:absolute; top:10px; right:10px; z-index:10;">
                    ⚠️ Only ${p.stock} left
                </div>` : '');
        
        const shippingBadge = final.shipping > 0 ? 
            `<div style="font-size:11px; color:#64748b;">🚚 ${getCurrencySymbol()}${convertPrice(final.shipping)} shipping</div>` :
            `<div style="font-size:11px; color:#10b981;">🚚 Free Shipping</div>`;
        
        let thumbnailsHtml = '';
        if (p.images && p.images.length > 1) {
            thumbnailsHtml = p.images.slice(0,4).map(img => 
                `<img src="${img}" onclick="event.stopPropagation(); changeProductImage('${p.id}','${img}')">`
            ).join('');
        }
        
        return `<div class="product-card" data-id="${p.id}" style="position:relative; ${isSoldOut ? 'opacity:0.7;' : ''}">
            ${stockBadge}
            <div class="image-wrapper">
                <img class="main-img" src="${p.mainImage}" id="mainImg_${p.id}">
                <div class="product-thumbnails">${thumbnailsHtml}</div>
            </div>
            <div class="seller-name-tag">🏪 ${seller.shopName}</div>
            <h4 style="font-size:13px; margin:2px 0; ${isSoldOut ? 'text-decoration:line-through;' : ''}">${p.name}</h4>
            <div class="prod-price">${getCurrencySymbol()}${convertPrice(final.total)}</div>
            ${shippingBadge}
            <div class="card-actions">
                ${isSoldOut ? 
                    `<button style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:30px; font-weight:600; cursor:not-allowed; width:100%;">⛔ Out of Stock</button>` :
                    `<button class="btn-sm btn-buy addCartBtn" data-id="${p.id}" style="width:100%;">🛒 Buy</button>`
                }
            </div>
        </div>`;
    } catch (error) {
        console.error('Render product error:', error);
        return `<div class="product-card">Error loading product</div>`;
    }
}

function renderCats(){
    let cats = ["All", ...new Set(products.map(p => p.category))];
    document.getElementById('catList').innerHTML = cats.map(c => `<div class="cat-pill ${currentCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`).join('');
    document.querySelectorAll('.cat-pill').forEach(el => el.addEventListener('click', (e) => { currentCategory = e.target.dataset.cat; renderCats(); renderProducts(); }));
}

function renderProducts(){
    let search = document.getElementById('searchInput')?.value.toLowerCase() || "";
    let filtered = products.filter(p => (currentCategory === "All" || p.category === currentCategory) && p.name.toLowerCase().includes(search) && p.stock > 0);
    if (filtered.length === 0) {
        document.getElementById('productsGrid').innerHTML = '<div style="text-align:center;padding:40px;grid-column:1/-1;">No products found</div>';
        return;
    }
    const firstTwo = filtered.slice(0, 2);
    const rest = filtered.slice(2);
    let html = firstTwo.map(p => renderProductCard(p)).join('');
    html += `
        <div class="offer-banner">
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <span style="font-size:18px; font-weight:800;">🎉 50 Sellers — Free Registration!</span>
                <span style="font-size:13px; opacity:0.9;">Zero commission for 1 month + Free shop setup</span>
                <button onclick="showSection('seller')" style="background:#fbbf24; color:#1e293b; border:none; padding:6px 20px; border-radius:30px; font-weight:700; font-size:13px; cursor:pointer; margin-top:4px;">
                    🚀 Register Now
                </button>
            </div>
        </div>
    `;
    html += rest.map(p => renderProductCard(p)).join('');
    document.getElementById('productsGrid').innerHTML = html;
    document.querySelectorAll('.addCartBtn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(btn.dataset.id); }));
    document.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', () => openProduct(card.dataset.id)));
    renderBuyerOrders(); renderBuyerWishlist();
}

function changeProductImage(pid, url){
    let modalImg = document.getElementById('mainImg_' + pid);
    if (modalImg) {
        modalImg.src = url;
        document.querySelectorAll('.product-thumbnails img').forEach(img => {
            img.classList.toggle('active', img.src === url);
        });
    }
}

let currentProduct = null, currentRatingHandler = { currentRating: 0 };

function openProduct(id) {
    try {
        let p = products.find(x => x.id == id);
        if (!p) return;
        
        currentProduct = p;
        const seller = sellers.find(s => s.id === p.sellerId) || { 
            shopName: "GlobalBazaar", 
            country: "SA",
            shippingZones: null 
        };
        
        const final = calculateFinalPrice(
            p.price, 
            p.sellerId, 
            buyerCountry, 
            p.price,
            seller
        );
        
        document.getElementById('modalMainImg').src = p.mainImage;
        document.getElementById('modalTitle').innerText = p.name;
        document.getElementById('modalDesc').innerText = p.description;
        
        document.getElementById('modalPriceBreakdown').innerHTML = `
            Base: ${getCurrencySymbol()}${convertPrice(p.price)}<br>
            + Gateway Fee (2.99% + $0.49): ${getCurrencySymbol()}${convertPrice(final.gateway)}<br>
            + Handling Fee: ${getCurrencySymbol()}${convertPrice(HANDLING_FEE)}<br>
            + Commission: ${getCurrencySymbol()}${convertPrice(final.commission)}<br>
            + Shipping: ${final.shipping > 0 ? getCurrencySymbol() + convertPrice(final.shipping) : 'FREE 🎉'}
        `;
        
        document.getElementById('modalPrice').innerHTML = `
            <strong>Total: ${getCurrencySymbol()}${convertPrice(final.total)}</strong>
            ${final.shipping > 0 ? `<br><span style="font-size:12px; color:#64748b;">🚚 Shipping: ${getCurrencySymbol()}${convertPrice(final.shipping)}</span>` : 
            `<br><span style="font-size:12px; color:#10b981;">🎉 Free Shipping</span>`}
        `;
        
        let thumb = document.getElementById('modalThumbnails');
        if (thumb && p.images && p.images.length) {
            thumb.innerHTML = p.images.map(img => 
                `<img src="${img}" onclick="changeProductImage('${p.id}','${img}')">`
            ).join('');
        }
        
        let reviews = productReviews[p.id] || [];
        let avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
        document.getElementById('modalRatingStars').innerHTML = 
            `<div class="rating-display"><span class="rating-badge">⭐ ${avg}</span><span>(${reviews.length} reviews)</span></div>`;
        
        document.getElementById('productReviews').innerHTML = reviews.map(r => 
            `<div class="review-item"><strong>${r.userName || 'User'}</strong> ⭐${r.rating}<br>${r.review}<br><small>${r.date}</small></div>`
        ).join('');
        
        currentRatingHandler.currentRating = 0;
        renderReviewStars('reviewStars', currentRatingHandler);
        
        document.getElementById('whatsappShareBtn').onclick = () => shareOnWhatsApp(p, final.total);
        document.getElementById('submitReviewBtn').onclick = () => {
            let txt = document.getElementById('reviewText').value;
            if (!txt) { showToast("Write review", true); return; }
            if (currentRatingHandler.currentRating === 0) { showToast("Select rating", true); return; }
            addReview(p.id, currentRatingHandler.currentRating, txt, currentBuyer ? currentBuyer.email : "Guest User");
            document.getElementById('reviewText').value = '';
            currentRatingHandler.currentRating = 0;
            renderReviewStars('reviewStars', currentRatingHandler);
        };
        
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        console.error('Open product error:', error);
        showToast('Error opening product', true);
    }
}

function addToCart(id){
    let p = products.find(x => x.id == id); if(!p) return;
    if(p.stock <= 0){ showToast("Out of stock!",true); return; }
    let existing = cart.find(i => i.id == id);
    if(existing){ if(existing.qty < p.stock) existing.qty++; else { showToast(`Only ${p.stock} in stock`,true); return; } }
    else { cart.push({ id: p.id, name: p.name, price: p.price, sellerId: p.sellerId, sellerCountry: p.sellerCountry || "SA", qty: 1, image: p.mainImage }); }
    saveAllLocal(); updateCartUI(); renderCartPage(); showToast("Added to cart", false); addNotification(`${p.name} added to cart`,'info');
    if (currentBuyer) saveUserCart(currentBuyer.uid);
}
function updateCartUI(){ document.getElementById('cartCountBadge').innerText = cart.reduce((a,b)=>a+b.qty,0); }
function toggleWish(id){
    if(wishlist.includes(id)) wishlist = wishlist.filter(i => i != id);
    else wishlist.push(id);
    saveAllLocal(); renderProducts(); renderBuyerWishlist();
}

// ============================================================
// CART PAGE WITH SHIPPING
// ============================================================

function renderCartPage() {
    try {
        if (cart.length === 0) {
            document.getElementById('cartItemsList').innerHTML = '<p style="text-align:center;padding:40px;">Cart empty</p>';
            document.getElementById('cartTotalAmount').innerHTML = `${getCurrencySymbol()}0.00`;
            document.getElementById('cartShippingTotal').innerHTML = `${getCurrencySymbol()}0.00`;
            document.getElementById('cartSubtotal').innerHTML = `${getCurrencySymbol()}0.00`;
            return;
        }
        
        let totalUSD = 0;
        let totalShipping = 0;
        
        let html = cart.map((item, idx) => {
            const seller = sellers.find(s => s.id == item.sellerId) || { 
                country: "SA",
                shippingZones: null 
            };
            
            const itemTotal = item.price * item.qty;
            const final = calculateFinalPrice(
                item.price, 
                item.sellerId, 
                buyerCountry, 
                itemTotal,
                seller
            );
            
            const itemTotalWithShipping = final.total * item.qty;
            totalUSD += itemTotalWithShipping;
            totalShipping += final.shipping * item.qty;
            
            return `<div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ${getCurrencySymbol()}${convertPrice(final.total)} each
                    ${final.shipping > 0 ? `<br><span style="font-size:11px; color:#64748b;">🚚 +${getCurrencySymbol()}${convertPrice(final.shipping)} shipping</span>` : 
                    `<br><span style="font-size:11px; color:#10b981;">🚚 Free shipping</span>`}
                </div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" data-idx="${idx}" data-dir="dec">-</button>
                    <span>${item.qty}</span>
                    <button class="cart-qty-btn" data-idx="${idx}" data-dir="inc">+</button>
                    <button class="cart-remove" data-idx="${idx}">Remove</button>
                </div>
            </div>`;
        }).join('');
        
        document.getElementById('cartItemsList').innerHTML = html;
        document.getElementById('cartTotalAmount').innerHTML = `${getCurrencySymbol()}${convertPrice(totalUSD)}`;
        document.getElementById('cartShippingTotal').innerHTML = `${getCurrencySymbol()}${convertPrice(totalShipping)}`;
        document.getElementById('cartSubtotal').innerHTML = `${getCurrencySymbol()}${convertPrice(totalUSD - totalShipping)}`;
        
        document.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let idx = parseInt(btn.dataset.idx);
                if (btn.dataset.dir === 'inc') {
                    let prod = products.find(p => p.id == cart[idx].id);
                    if (cart[idx].qty < prod.stock) cart[idx].qty++;
                    else showToast(`Only ${prod.stock} in stock`, true);
                } else if (btn.dataset.dir === 'dec' && cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else if (btn.dataset.dir === 'dec' && cart[idx].qty === 1) {
                    cart.splice(idx, 1);
                }
                saveAllLocal();
                updateCartUI();
                renderCartPage();
                renderProducts();
                if (currentBuyer) saveUserCart(currentBuyer.uid);
            });
        });
        
        document.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(parseInt(btn.dataset.idx), 1);
                saveAllLocal();
                updateCartUI();
                renderCartPage();
                renderProducts();
                if (currentBuyer) saveUserCart(currentBuyer.uid);
            });
        });
        
    } catch (error) {
        console.error('Render cart error:', error);
        document.getElementById('cartItemsList').innerHTML = '<p style="text-align:center;padding:40px;color:#dc2626;">Error loading cart</p>';
    }
}

let currentDelivery = null;

// ============================================================
// CHECKOUT
// ============================================================
document.getElementById('proceedToCheckoutBtn')?.addEventListener('click', () => {
    if(cart.length === 0){ showToast("Cart empty",true); return; }
    const user = auth.currentUser;
    if (!user) {
        sessionStorage.setItem('pendingCheckout', 'true');
        sessionStorage.setItem('pendingCart', JSON.stringify(cart));
        showToast("Please login to continue checkout", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    showSection('checkout');
    let savedAddr = savedAddresses.find(a => a.email === user.email);
    if(savedAddr){ 
        document.getElementById('deliveryFullName').value = savedAddr.fullName || '';
        document.getElementById('deliveryPhone').value = savedAddr.phone || '';
        document.getElementById('deliveryCountry').value = savedAddr.country || '';
        document.getElementById('deliveryCity').value = savedAddr.city || '';
        document.getElementById('deliveryPostcode').value = savedAddr.postcode || '';
        document.getElementById('deliveryStreet').value = savedAddr.street || '';
        document.getElementById('deliveryHouseNo').value = savedAddr.houseNo || '';
        document.getElementById('saveAddressCheckbox').checked = true;
    }
});

document.getElementById('confirmDeliveryBtn')?.addEventListener('click', async function() {
    const user = auth.currentUser;
    if (!user) {
        sessionStorage.setItem('pendingCheckout', 'true');
        sessionStorage.setItem('pendingCart', JSON.stringify(cart));
        showToast("Please login to continue", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    let fn = document.getElementById('deliveryFullName').value;
    let ph = document.getElementById('deliveryPhone').value;
    let c = document.getElementById('deliveryCountry').value;
    let ci = document.getElementById('deliveryCity').value;
    let pc = document.getElementById('deliveryPostcode').value;
    let st = document.getElementById('deliveryStreet').value;
    if (!fn || !ph || !c || !ci || !pc || !st) {
        showToast("Fill all fields!", true);
        return;
    }
    buyerCountry = c;
    localStorage.setItem('buyerCountry', buyerCountry);
    currentDelivery = {
        fullName: fn,
        phone: ph,
        country: c,
        city: ci,
        postcode: pc,
        street: st,
        houseNo: document.getElementById('deliveryHouseNo').value,
        fullAddress: `${document.getElementById('deliveryHouseNo').value || ''}, ${st}, ${ci}, ${pc}, ${c}`,
        email: user.email,
        state: document.getElementById('deliveryState')?.value || ''
    };
    if (document.getElementById('saveAddressCheckbox').checked) {
        let idx = savedAddresses.findIndex(a => a.email === user.email);
        let addr = {
            email: user.email,
            fullName: fn,
            phone: ph,
            country: c,
            city: ci,
            postcode: pc,
            street: st,
            houseNo: document.getElementById('deliveryHouseNo').value,
            state: document.getElementById('deliveryState')?.value || ''
        };
        if (idx >= 0) savedAddresses[idx] = addr;
        else savedAddresses.push(addr);
        saveAllLocal();
    }
    showToast("Proceeding to payment...", false);
    setTimeout(() => {
        showSection('payment');
        loadSavedCards();
    }, 500);
});

function loadSavedCards(){ let userCards = savedCards.filter(c => c.userEmail === "guest@globalbazaar.com"); if(userCards.length > 0){ document.getElementById('savedCardsSection').style.display = 'block'; document.getElementById('savedCardsList').innerHTML = userCards.map((card,idx) => `<div class="flex-between"><span>💳 ****${card.cardNumber.slice(-4)} - ${card.cardHolderName}</span><button class="useSavedCardBtn" data-idx="${idx}">Use</button></div>`).join(''); document.querySelectorAll('.useSavedCardBtn').forEach(btn => btn.addEventListener('click', () => { let card = userCards[parseInt(btn.dataset.idx)]; document.getElementById('cardNumber').value = card.cardNumber; document.getElementById('cardHolderName').value = card.cardHolderName; document.getElementById('expiryDate').value = card.expiryDate; document.getElementById('cvv').value = ''; showToast("Card loaded", false); })); } }

// ============================================================
// PAYMENT WITH SHIPPING & BUYER PHONE IN ORDER
// ============================================================

document.getElementById('payNowBtn')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';
    
    try {
        let cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
        let cardName = document.getElementById('cardHolderName').value;
        let expiry = document.getElementById('expiryDate').value;
        let cvv = document.getElementById('cvv').value;
        
        if (!cardNum || !cardName || !expiry || !cvv) {
            showToast("Fill card details", true);
            btn.disabled = false;
            btn.textContent = 'Pay with Card (Dummy)';
            return;
        }
        if (cardNum.length < 15) {
            showToast("Invalid card", true);
            btn.disabled = false;
            btn.textContent = 'Pay with Card (Dummy)';
            return;
        }
        if (cvv.length < 3) {
            showToast("Invalid CVV", true);
            btn.disabled = false;
            btn.textContent = 'Pay with Card (Dummy)';
            return;
        }
        
        if (document.getElementById('saveCardCheckbox').checked) {
            let existing = savedCards.findIndex(c => 
                c.userEmail === "guest@globalbazaar.com" && c.cardNumber === cardNum
            );
            let cardData = {
                userEmail: "guest@globalbazaar.com",
                cardNumber: cardNum,
                cardHolderName: cardName,
                expiryDate: expiry
            };
            if (existing >= 0) savedCards[existing] = cardData;
            else savedCards.push(cardData);
            saveAllLocal();
        }
        
        let totalUSD = 0;
        let totalShipping = 0;
        let shippingBreakdown = [];
        
        for (let item of cart) {
            const seller = sellers.find(s => s.id == item.sellerId);
            const itemTotal = item.price * item.qty;
            const final = calculateFinalPrice(
                item.price, 
                item.sellerId, 
                buyerCountry, 
                itemTotal,
                seller
            );
            
            totalUSD += final.total * item.qty;
            totalShipping += final.shipping * item.qty;
            
            shippingBreakdown.push({
                product: item.name,
                seller: seller?.shopName || 'GlobalBazaar',
                shipping: final.shipping,
                qty: item.qty
            });
        }
        
        let tracking = "GB" + Date.now();
        let cartCopy = [...cart];
        
        for (let item of cart) {
            const seller = sellers.find(s => s.id == item.sellerId);
            const itemTotal = item.price * item.qty;
            const final = calculateFinalPrice(
                item.price, 
                item.sellerId, 
                buyerCountry, 
                itemTotal,
                seller
            );
            
            let product = products.find(p => p.id == item.id);
            
            let newOrder = {
                id: Date.now() + Math.random(),
                trackingNumber: tracking,
                sellerId: item.sellerId,
                sellerName: seller?.shopName || "GlobalBazaar",
                buyerEmail: currentDelivery.email,
                buyerName: currentDelivery.fullName,
                buyerPhone: currentDelivery.phone || 'N/A',
                productName: item.name,
                amount: final.total,
                basePrice: item.price,
                address: currentDelivery.fullAddress,
                date: new Date().toLocaleString(),
                status: "Processing",
                qty: item.qty,
                shippingCost: final.shipping,
                shippingCharge: final.shipping,
                commission: final.commission,
                gatewayFee: final.gateway,
                handlingFee: HANDLING_FEE,
                trackingInfo: null,
                buyerCountry: buyerCountry
            };
            
            orders.push(newOrder);
            
            platformEarnings += (final.commission * item.qty) + 
                               (final.gateway * item.qty) + 
                               (HANDLING_FEE * item.qty);
            
            
                if (product) {
            product.stock -= item.qty;
            db.collection("products").doc(product.id).update({ stock: product.stock });
            
            if (product.stock <= 0) {
                addNotification(`Product ${product.name} is now SOLD OUT!`, 'info');
                sendTelegramMessage(`⚠️ Product ${product.name} out of stock.`);
            }
        }

        saveAllLocal();
        
        await sendTelegramMessage(`🛍️ NEW ORDER!\nOrder: ${tracking}\nCustomer: ${currentDelivery.fullName}\nPhone: ${currentDelivery.phone}\nAmount: ${getCurrencySymbol()}${convertPrice(totalUSD)}\nShipping: ${getCurrencySymbol()}${convertPrice(totalShipping)}`);
        addNotification(`Order placed! #${tracking}`, 'order');
        
        cart = [];
        saveAllLocal();
        updateCartUI();
        if (currentBuyer) await saveUserCart(currentBuyer.uid);
        
        let last4 = cardNum.slice(-4);
        let itemsHtml = cartCopy.map(i => `<li>${i.name} x${i.qty} = ${getCurrencySymbol()}${convertPrice(i.price * i.qty)}</li>`).join('');
        let shippingHtml = shippingBreakdown.map(s => 
            `<li>${s.product} (${s.seller}): ${s.shipping > 0 ? getCurrencySymbol() + convertPrice(s.shipping) : 'FREE'} x${s.qty}</li>`
        ).join('');
        
        document.getElementById('orderSummaryContent').innerHTML = `
            <p><strong>Order ID:</strong> ${tracking}</p>
            <h3>📦 Items</h3>
            <ul>${itemsHtml}</ul>
            <h3>🚚 Shipping</h3>
            <ul>${shippingHtml}</ul>
            <h3>💰 Total Paid: ${getCurrencySymbol()}${convertPrice(totalUSD)}</h3>
            <p><small>(Includes ${getCurrencySymbol()}${convertPrice(totalShipping)} shipping)</small></p>
            <h3>👤 Delivery Details</h3>
            <p>${currentDelivery.fullName}<br>📞 ${currentDelivery.phone}<br>${currentDelivery.fullAddress}</p>
            <h3>💳 Payment</h3>
            <p>Card ending: ${last4}</p>
            <p>🔮 We'll notify you when your order ships.</p>
        `;
        
        document.getElementById('orderSummaryModal').style.display = 'block';
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardHolderName').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';
        
        renderProducts();
        btn.disabled = false;
        btn.textContent = 'Pay with Card (Dummy)';
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Payment failed: ' + error.message, true);
        btn.disabled = false;
        btn.textContent = 'Pay with Card (Dummy)';
    }
});

function confirmOrderReceived(orderId){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Shipped"){ order.status = "Delivered"; saveAllLocal(); showToast("Order marked Delivered", false); renderBuyerOrders(); addNotification(`Order ${order.trackingNumber} delivered`,'order'); setTimeout(()=>{ let ord = orders.find(o => o.id === orderId); if(ord && ord.status === "Delivered"){ ord.status = "Completed"; let seller = sellers.find(s => s.id == ord.sellerId); if(seller){ let sellerEarning = ord.basePrice - ord.commission - HANDLING_FEE; seller.earnings = (seller.earnings||0) + (sellerEarning * ord.qty); saveAllLocal(); showToast(`Payment released to seller`,false); if(currentSeller) renderSellerDashboard(); } } },5000); } else showToast("Order not shipped yet",true); }
function cancelOrder(orderId){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Processing"){ let prod = products.find(p => p.name === order.productName && p.sellerId === order.sellerId); if(prod){ prod.stock += order.qty; saveAllLocal(); } order.status = "Cancelled"; saveAllLocal(); showToast("Order cancelled successfully",false); renderBuyerOrders(); renderProducts(); addNotification(`Order ${order.trackingNumber} cancelled`,'order'); if(currentSeller) renderSellerDashboard(); } else { showToast("Only orders in 'Processing' status can be cancelled",true); } }

// ============================================================
// MARK ORDER SHIPPED WITH NOTIFICATIONS
// ============================================================

function markOrderShipped(orderId, trackingNum) {
    let order = orders.find(o => o.id === orderId);
    if (order && order.status === "Processing") {
        order.status = "Shipped";
        order.trackingInfo = { trackingNumber: trackingNum };
        saveAllLocal();
        
        addNotification(`📦 Your order ${order.trackingNumber} has been shipped! Tracking: ${trackingNum}`, 'order');
        sendTelegramMessage(`📦 Order Shipped: ${order.trackingNumber}\nProduct: ${order.productName}\nBuyer: ${order.buyerName}\nTracking: ${trackingNum}`);
        
        showToast(`✅ Order Shipped! Tracking: ${trackingNum}`, false);
        renderSellerDashboard();
        renderBuyerOrders();
    } else {
        showToast("Order not found or already shipped", true);
    }
}

function requestWithdrawal(sellerId){ let seller = sellers.find(s => s.id == sellerId); if(seller && seller.earnings > 0){ let newWithdrawal = { id: Date.now(), sellerId: seller.id, sellerName: seller.shopName, amount: seller.earnings, date: new Date().toLocaleString(), status: "Pending" }; pendingWithdrawals.push(newWithdrawal); seller.earnings = 0; saveAllLocal(); showToast("Withdrawal request submitted",false); renderSellerDashboard(); sendTelegramMessage(`💰 Withdrawal Request: ${seller.shopName} - ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`); addNotification(`Withdrawal request for ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`,'payment'); } else showToast("No balance",true); }
function processWeeklyWithdrawals(){ let last = localStorage.getItem('gb_last_withdrawal'); let now = new Date(); let day = now.getDay(); if((day===1||day===5) && (!last || new Date(last).getDate() !== now.getDate())){ pendingWithdrawals.forEach(w => { if(w.status === "Pending") w.status = "Approved"; }); saveAllLocal(); localStorage.setItem('gb_last_withdrawal', now.toString()); } }
setInterval(processWeeklyWithdrawals, 3600000); processWeeklyWithdrawals();

// ============================================================
// SELLER REGISTRATION WITH SHIPPING ZONES - UNCHANGED
// ============================================================

document.getElementById('sellerRegForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('sellerSubmitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Registering...';
    
    try {
        if (!document.getElementById('sellerAgreement').checked) {
            showToast("Accept agreement", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let dob = document.getElementById('sellerDob').value;
        if (calculateAge(dob) < 18) {
            showToast("18+ required", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let docImgFile = document.getElementById('sellerDocImage').files[0];
        if (!docImgFile) {
            showToast("KYC document image required", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let docNum = document.getElementById('sellerDocNumber').value;
        if (!docNum.trim()) {
            showToast("Document number required", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let docType = document.getElementById('sellerDocType').value;
        if (!docType) {
            showToast("Select document type", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let sellerCountry = document.getElementById('sellerCountryReg').value;
        if (!sellerCountry) {
            showToast("Select your country", true);
            btn.disabled = false;
            btn.textContent = '✅ Register Shop';
            return;
        }
        
        let localCharge = parseFloat(document.getElementById('localShippingCharge')?.value) || 15;
        let localFreeAbove = parseFloat(document.getElementById('localFreeAbove')?.value) || 100;
        let regionalCharge = parseFloat(document.getElementById('regionalShippingCharge')?.value) || 25;
        let regionalFreeAbove = parseFloat(document.getElementById('regionalFreeAbove')?.value) || 200;
        let internationalCharge = parseFloat(document.getElementById('internationalShippingCharge')?.value) || 40;
        let internationalFreeAbove = parseFloat(document.getElementById('internationalFreeAbove')?.value) || 300;
        
        let regionalCountries = [];
        let internationalCountries = [];
        
        const regionalSelect = document.getElementById('regionalCountries');
        const internationalSelect = document.getElementById('internationalCountries');
        
        if (regionalSelect) {
            regionalCountries = Array.from(regionalSelect.selectedOptions || []).map(opt => opt.value);
        }
        
        if (internationalSelect) {
            internationalCountries = Array.from(internationalSelect.selectedOptions || []).map(opt => opt.value);
        }
        
        const shippingZones = {
            local: { countries: [sellerCountry], charge: localCharge, freeAbove: localFreeAbove },
            regional: { countries: regionalCountries.length > 0 ? regionalCountries : [], charge: regionalCharge, freeAbove: regionalFreeAbove },
            international: { countries: internationalCountries.length > 0 ? internationalCountries : [], charge: internationalCharge, freeAbove: internationalFreeAbove }
        };
        
        let avatarFile = document.getElementById('sellerAvatar').files[0];
        const email = document.getElementById('sellerEmail').value;
        const password = document.getElementById('sellerPassword').value;

        showToast("Creating account...", false);
        document.getElementById('debugMsg').innerText = "Creating account...";

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.sendEmailVerification();
        // DO NOT sign out - user should remain logged in

        let avatarUrl = "https://randomuser.me/api/portraits/lego/1.jpg";
        if (avatarFile) {
            avatarUrl = await uploadCompressedImage(avatarFile, 'avatar');
            if (!avatarUrl) throw new Error("Avatar upload failed");
        }
        
        let docImageUrl = await uploadCompressedImage(docImgFile, 'kyc');
        if (!docImageUrl) throw new Error("KYC document upload failed");

        let newSeller = {
            fullName: document.getElementById('sellerFullName').value,
            shopName: document.getElementById('sellerShopName').value,
            email: email,
            phone: document.getElementById('sellerCountryCode').value + document.getElementById('sellerPhone').value,
            password: password,
            dob: document.getElementById('sellerDob').value,
            houseNo: document.getElementById('sellerHouseNo').value,
            street: document.getElementById('sellerStreet').value,
            city: document.getElementById('sellerCity').value,
            state: document.getElementById('sellerState').value,
            pincode: document.getElementById('sellerPincode').value,
            country: sellerCountry,
            docType: docType,
            docNumber: docNum,
            docImage: docImageUrl,
            earnings: 0,
            kycStatus: "pending",
            totalSales: 0,
            totalWithdrawn: 0,
            createdAt: new Date().toISOString(),
            avatar: avatarUrl,
            emailVerified: false,
            uid: user.uid,
            shippingZones: shippingZones
        };
        
        await db.collection("sellers").doc(user.uid).set(newSeller);
        document.getElementById('sellerRegForm').reset();
        
        sendTelegramMessage(`📧 New Seller: ${newSeller.shopName}\nEmail: ${newSeller.email}\nWaiting for email verification`).catch(e => console.warn);
        addNotification(`📧 Verification link sent to ${email}`, 'info');
        
        let modal = document.getElementById('sellerSummaryModal');
        if (modal) {
            modal.style.display = 'block';
            modal.querySelector('p').innerHTML = '📧 <strong>Please check your email!</strong><br><br>We have sent a verification link to your email address.<br><br>Click the link to verify your email and activate your seller account.<br><br>⏳ Waiting for email verification...';
        }
        
        document.getElementById('debugMsg').innerText = "Registration successful - Email verification sent";
        
        const snapshot = await db.collection("sellers").get();
        sellers = [];
        snapshot.forEach(doc => {
            sellers.push({ id: doc.id, ...doc.data() });
        });
        
        updateAdminPendingBadge();
        updateAdminMenuBadges();
        if (isAdminLoggedIn) loadAdminData();
        
        btn.disabled = false;
        btn.textContent = '✅ Register Shop';
        
    } catch (err) {
        console.error(err);
        showToast("Registration failed: " + err.message, true);
        document.getElementById('debugMsg').innerText = "Error: " + err.message;
        btn.disabled = false;
        btn.textContent = '✅ Register Shop';
    }
});

// ============================================================
// MY SHOP LOGIN - FIXED
// ============================================================

async function showMyShopLogin(){
    const user = auth.currentUser;
    if (!user) {
        showToast("Please login first", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    if (!user.emailVerified) {
        showVerifyModal();
        return;
    }
    
    const sellerSnapshot = await db.collection("sellers").where("uid", "==", user.uid).get();
    if (!sellerSnapshot.empty) {
        const sellerData = sellerSnapshot.docs[0].data();
        const sellerId = sellerSnapshot.docs[0].id;
        
        if (sellerData.kycStatus === 'verified') {
            currentSeller = {
                name: sellerData.fullName,
                email: sellerData.email,
                role: 'seller',
                sellerId: sellerId,
                phone: sellerData.phone,
                kycStatus: sellerData.kycStatus,
                shopName: sellerData.shopName,
                earnings: sellerData.earnings || 0
            };
            localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
            document.getElementById('sellerRegisterBox').style.display = 'none';
            document.getElementById('sellerDashboard').style.display = 'block';
            renderSellerDashboard();
            showToast(`Welcome ${sellerData.shopName}!`, false);
            addNotification(`Welcome back ${sellerData.shopName}`, 'info');
            closeDrawer();
            showSection('seller');
            return;
        } else if (sellerData.kycStatus === 'pending') {
            document.getElementById('sellerRegisterBox').style.display = 'none';
            document.getElementById('sellerDashboard').style.display = 'block';
            renderSellerDashboard();
            showToast("⏳ Your KYC is pending verification. Please wait for admin approval.", true);
            closeDrawer();
            showSection('seller');
            return;
        } else if (sellerData.kycStatus === 'rejected') {
            document.getElementById('sellerRegisterBox').style.display = 'block';
            document.getElementById('sellerDashboard').style.display = 'none';
            showToast("❌ Your KYC was rejected. Please contact support.", true);
            return;
        }
    }
    
    const email = user.email;
    const password = prompt("Enter your password to access your shop:");
    if (!password) return;
    
    try {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        await user.reauthenticateWithCredential(credential);
        
        const newSnapshot = await db.collection("sellers").where("uid", "==", user.uid).get();
        if (newSnapshot.empty) {
            showToast("No seller account found with this email. Please register first.", true);
            return;
        }
        
        const seller = newSnapshot.docs[0].data();
        const sellerId = newSnapshot.docs[0].id;
        
        if (seller.kycStatus !== 'verified') {
            showToast(`⏳ Your KYC is ${seller.kycStatus}. Please wait for admin approval.`, true);
            return;
        }
        
        currentSeller = {
            name: seller.fullName,
            email: seller.email,
            role: 'seller',
            sellerId: sellerId,
            phone: seller.phone,
            kycStatus: seller.kycStatus,
            shopName: seller.shopName,
            earnings: seller.earnings || 0
        };
        localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
        document.getElementById('sellerRegisterBox').style.display = 'none';
        document.getElementById('sellerDashboard').style.display = 'block';
        renderSellerDashboard();
        showToast(`Welcome ${seller.shopName}!`, false);
        addNotification(`Welcome back ${seller.shopName}`, 'info');
        closeDrawer();
        showSection('seller');
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            showToast("Wrong password! Please try again.", true);
        } else {
            showToast("Login failed: " + error.message, true);
        }
    }
}

document.getElementById('drawerMyShop')?.addEventListener('click', function() {
    const user = auth.currentUser;
    
    if (!user) {
        showToast("Please login first", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    if (!user.emailVerified) {
        showVerifyModal();
        return;
    }
    
    if (currentSeller && currentSeller.kycStatus === 'verified') {
        document.getElementById('sellerRegisterBox').style.display = 'none';
        document.getElementById('sellerDashboard').style.display = 'block';
        renderSellerDashboard();
        showSection('seller');
        closeDrawer();
    } else {
        showMyShopLogin();
    }
});

// ============================================================
// ORDER DETAILS MODAL
// ============================================================

function showOrderDetailsModal(order) {
    const existingModal = document.querySelector('.order-details-modal-overlay');
    if (existingModal) existingModal.remove();
    
    const modalHtml = `
        <div class="order-details-modal-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(4px);">
            <div style="background:white; border-radius:20px; padding:30px; max-width:650px; width:95%; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.3); position:relative;">
                <button onclick="this.closest('.order-details-modal-overlay').remove()" style="position:absolute; top:15px; right:20px; background:#ef4444; color:white; border:none; width:40px; height:40px; border-radius:50%; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
                
                <h2 style="margin:0 0 20px 0; font-size:24px; border-bottom:2px solid #e2e8f0; padding-bottom:15px;">📋 Order Details</h2>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-bottom:20px;">
                    <div style="background:#f8fafc; padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:11px; color:#64748b;">Order ID</div>
                        <div style="font-weight:700; font-size:14px;">${order.trackingNumber}</div>
                    </div>
                    <div style="background:#f8fafc; padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:11px; color:#64748b;">Status</div>
                        <div style="font-weight:700; font-size:14px; color:${order.status === 'Processing' ? '#f59e0b' : order.status === 'Shipped' ? '#3b82f6' : '#10b981'};">${order.status}</div>
                    </div>
                    <div style="background:#f8fafc; padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:11px; color:#64748b;">Date</div>
                        <div style="font-weight:600; font-size:13px;">${order.date}</div>
                    </div>
                </div>
                
                <h3 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; font-size:16px;">📦 Product Details</h3>
                <div style="background:#f1f5f9; padding:16px; border-radius:12px; margin-bottom:16px;">
                    <div style="font-size:18px; font-weight:600;">${order.productName}</div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
                        <div><span style="color:#64748b;">Unit Price:</span> ${getCurrencySymbol()}${convertPrice(order.amount / order.qty)}</div>
                        <div><span style="color:#64748b;">Quantity:</span> ${order.qty}</div>
                        <div><span style="color:#64748b;">Subtotal:</span> ${getCurrencySymbol()}${convertPrice(order.amount)}</div>
                        <div><span style="color:#64748b;">Shipping:</span> ${order.shippingCost > 0 ? getCurrencySymbol() + convertPrice(order.shippingCost) : 'FREE'}</div>
                    </div>
                    <div style="margin-top:10px; padding-top:10px; border-top:2px solid #e2e8f0; font-size:18px; font-weight:700; color:#1e293b;">
                        Total: ${getCurrencySymbol()}${convertPrice(order.amount + (order.shippingCost || 0))}
                    </div>
                </div>
                
                <h3 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; font-size:16px;">👤 Buyer Details</h3>
                <div style="background:#f0fdf4; padding:16px; border-radius:12px; border:2px solid #bbf7d0; margin-bottom:16px;">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                        <div><span style="color:#64748b;">Name:</span> <strong>${order.buyerName}</strong></div>
                        <div><span style="color:#64748b;">Email:</span> ${order.buyerEmail || 'N/A'}</div>
                        <div><span style="color:#64748b;">Phone:</span> ${order.buyerPhone || 'N/A'}</div>
                        <div><span style="color:#64748b;">Country:</span> ${order.buyerCountry || 'N/A'}</div>
                    </div>
                    <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0;">
                        <div style="color:#64748b; font-weight:500;">📍 Delivery Address</div>
                        <div style="background:white; padding:12px; border-radius:8px; margin-top:6px; font-size:14px; line-height:1.6; border:1px solid #e2e8f0;">
                            ${order.address || 'Address not available'}
                        </div>
                    </div>
                </div>
                
                ${order.trackingInfo ? `
                    <h3 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; font-size:16px;">📮 Tracking</h3>
                    <div style="background:#dbeafe; padding:12px; border-radius:8px; margin-bottom:16px;">
                        Tracking Number: <strong>${order.trackingInfo.trackingNumber || order.trackingInfo}</strong>
                    </div>
                ` : ''}
                
                <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
                    ${order.status === "Processing" ? `
                        <button onclick="markOrderShipped(${order.id}, prompt('Enter tracking number:'))" style="background:#3b82f6; color:white; border:none; padding:10px 20px; border-radius:25px; cursor:pointer; font-weight:500; flex:1;">
                            📦 Mark Shipped
                        </button>
                    ` : ''}
                    <button onclick="this.closest('.order-details-modal-overlay').remove()" style="background:#64748b; color:white; border:none; padding:10px 20px; border-radius:25px; cursor:pointer; font-weight:500; flex:1;">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    const overlay = document.querySelector('.order-details-modal-overlay');
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// ============================================================
// SELLER DASHBOARD - COMPLETE
// ============================================================

function renderSellerDashboard() {
    if (!currentSeller?.sellerId) return;
    let seller = sellers.find(s => s.id === currentSeller.sellerId);
    if (!seller) {
        const stored = localStorage.getItem('gb_current_seller');
        if (stored) {
            currentSeller = JSON.parse(stored);
            seller = sellers.find(s => s.id === currentSeller.sellerId);
        }
        if (!seller) {
            document.getElementById('sellerDashboard').innerHTML = `
                <div class="kyc-blocked-message">
                    <h2>⚠️ Account Not Found</h2>
                    <p>Please login again or contact support.</p>
                    <button onclick="showMyShopLogin()" class="btn-primary">🔄 Login Again</button>
                </div>
            `;
            return;
        }
    }
    
    if (seller.kycStatus !== 'verified') {
        document.getElementById('sellerDashboard').innerHTML = `
            <div class="kyc-blocked-message">
                <h2>${seller.kycStatus === 'pending' ? '⏳' : '🔒'} KYC ${seller.kycStatus === 'pending' ? 'Pending' : 'Required'}</h2>
                <p>Your KYC status is <strong>${seller.kycStatus}</strong>.<br>
                ${seller.kycStatus === 'pending' ? 'Please wait for admin approval.' : 'Please contact support.'}<br>
                <br>📧 support@globalbazaar.com</p>
                ${seller.kycStatus === 'pending' ? '<p style="color:#f59e0b;">⏳ We will notify you once your KYC is approved.</p>' : ''}
            </div>
        `;
        return;
    }
    
    let myProducts = products.filter(p => p.sellerId == seller.id);
    let myOrders = orders.filter(o => o.sellerId == seller.id);
    
    const totalOrders = myOrders.length;
    const processingOrders = myOrders.filter(o => o.status === "Processing").length;
    const shippedOrders = myOrders.filter(o => o.status === "Shipped").length;
    const deliveredOrders = myOrders.filter(o => o.status === "Delivered" || o.status === "Completed").length;
    
    let totalSales = 0, monthlyRevenue = {};
    myOrders.forEach(o => {
        if (o.status === "Completed" || o.status === "Delivered") {
            let earning = (o.basePrice - o.commission - HANDLING_FEE) * o.qty;
            totalSales += earning;
            let date = new Date(o.date);
            let my = `${date.getMonth()+1}/${date.getFullYear()}`;
            monthlyRevenue[my] = (monthlyRevenue[my] || 0) + earning;
        }
    });
    
    let chartLabels = Object.keys(monthlyRevenue);
    let chartData = Object.values(monthlyRevenue);
    if (chartLabels.length === 0) {
        chartLabels = ["No Data"];
        chartData = [0];
    }
    
    let kycClass = seller.kycStatus === "pending" ? "kyc-pending" : 
                   (seller.kycStatus === "verified" ? "kyc-verified" : "kyc-rejected");
    let kycText = seller.kycStatus === "pending" ? "⏳ KYC Pending - Wait for Admin" : 
                  (seller.kycStatus === "verified" ? "✅ KYC Verified" : "❌ KYC Rejected");
    
    let shippingHtml = '';
    if (seller.shippingZones) {
        shippingHtml = `
            <div style="margin-top:12px; padding:12px; background:#f1f5f9; border-radius:8px;">
                <h4>🌍 Your Shipping Zones</h4>
                <div style="font-size:13px;">
                    <div><strong>📍 Local:</strong> ${seller.shippingZones.local?.countries?.join(', ') || 'Not set'} 
                        - ${getCurrencySymbol()}${convertPrice(seller.shippingZones.local?.charge || 0)} 
                        ${seller.shippingZones.local?.freeAbove ? `(Free above ${getCurrencySymbol()}${convertPrice(seller.shippingZones.local.freeAbove)})` : ''}</div>
                    <div><strong>🌏 Regional:</strong> ${seller.shippingZones.regional?.countries?.join(', ') || 'Not set'} 
                        - ${getCurrencySymbol()}${convertPrice(seller.shippingZones.regional?.charge || 0)}
                        ${seller.shippingZones.regional?.freeAbove ? `(Free above ${getCurrencySymbol()}${convertPrice(seller.shippingZones.regional.freeAbove)})` : ''}</div>
                    <div><strong>🌐 International:</strong> ${seller.shippingZones.international?.countries?.join(', ') || 'Not set'} 
                        - ${getCurrencySymbol()}${convertPrice(seller.shippingZones.international?.charge || 0)}
                        ${seller.shippingZones.international?.freeAbove ? `(Free above ${getCurrencySymbol()}${convertPrice(seller.shippingZones.international.freeAbove)})` : ''}</div>
                </div>
            </div>
        `;
    }
    
    let topProducts = {};
    myOrders.forEach(o => {
        topProducts[o.productName] = (topProducts[o.productName] || 0) + o.qty;
    });
    let topList = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    let prodListHtml = myProducts.map(p => {
        const isSoldOut = p.stock <= 0;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #e2e8f0; ${isSoldOut ? 'background:#fef2f2;' : ''}">
                <div style="display:flex; align-items:center; gap:12px; flex:1;">
                    <img src="${p.mainImage}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                    <div>
                        <div style="font-weight:500;">${p.name}</div>
                        <div style="font-size:13px; color:#64748b;">
                            ${getCurrencySymbol()}${convertPrice(p.price)} 
                            <span style="margin:0 8px;">|</span> 
                            ${isSoldOut ? 
                                `<span style="color:#dc2626; font-weight:700;">🔴 SOLD OUT</span>` : 
                                `<span style="color:#10b981;">✅ ${p.stock} in stock</span>`
                            }
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="editProdBtn" data-id="${p.id}" style="background:#3b82f6; color:white; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-size:12px;">
                        ✏️ Edit & Restock
                    </button>
                    <button class="delProd" data-id="${p.id}" style="background:#dc2626; color:white; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-size:12px;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    let ordersHtml = myOrders.map(o => `
        <div style="border:1px solid #e2e8f0; padding:16px; border-radius:12px; margin-bottom:12px; background:white;">
            <div style="display:flex; justify-content:space-between; align-items:start; flex-wrap:wrap; gap:10px;">
                <div>
                    <strong style="font-size:16px;">🔖 ${o.trackingNumber}</strong>
                    <span style="background:${o.status === 'Processing' ? '#fef3c7' : o.status === 'Shipped' ? '#dbeafe' : '#d1fae5'}; 
                                   color:${o.status === 'Processing' ? '#92400e' : o.status === 'Shipped' ? '#1e40af' : '#065f46'}; 
                                   padding:2px 12px; border-radius:20px; font-size:12px; margin-left:10px;">
                        ${o.status}
                    </span>
                </div>
                <div style="font-size:13px; color:#64748b;">
                    📅 ${o.date}
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:12px;">
                <div style="background:#f8fafc; padding:12px; border-radius:8px;">
                    <div style="font-weight:600; color:#475569; font-size:13px;">📦 Product</div>
                    <div style="font-size:15px; font-weight:500;">${o.productName}</div>
                    <div style="color:#64748b; font-size:13px;">Qty: ${o.qty} × ${getCurrencySymbol()}${convertPrice(o.amount/o.qty)}</div>
                    <div style="font-weight:600; color:#1e293b; font-size:15px; margin-top:4px;">
                        Total: ${getCurrencySymbol()}${convertPrice(o.amount * o.qty)}
                    </div>
                    ${o.shippingCost > 0 ? `<div style="font-size:12px; color:#64748b;">🚚 +${getCurrencySymbol()}${convertPrice(o.shippingCost)} shipping</div>` : 
                    `<div style="font-size:12px; color:#10b981;">🚚 Free Shipping</div>`}
                </div>
                
                <div style="background:#f0fdf4; padding:12px; border-radius:8px; border:1px solid #bbf7d0;">
                    <div style="font-weight:600; color:#475569; font-size:13px;">👤 Buyer</div>
                    <div style="font-weight:500;">${o.buyerName}</div>
                    <div style="color:#64748b; font-size:13px;">📧 ${o.buyerEmail || 'N/A'}</div>
                    <div style="color:#64748b; font-size:13px;">📞 ${o.buyerPhone || 'N/A'}</div>
                    <div style="color:#64748b; font-size:13px; margin-top:4px; word-break:break-word;">
                        📍 ${o.address || 'Address not available'}
                    </div>
                    ${o.buyerCountry ? `<div style="color:#64748b; font-size:12px;">🌍 ${o.buyerCountry}</div>` : ''}
                </div>
            </div>
            
            ${o.trackingInfo ? `
                <div style="margin-top:10px; padding:8px; background:#dbeafe; border-radius:6px; font-size:13px;">
                    📮 Tracking #: ${o.trackingInfo.trackingNumber || o.trackingInfo}
                </div>
            ` : ''}
            
            <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; gap:8px; flex-wrap:wrap;">
                ${o.status === "Processing" ? `
                    <button class="shipBtn" data-id="${o.id}" style="background:#3b82f6; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-weight:500;">
                        📦 Mark Shipped
                    </button>
                    <button onclick='showOrderDetailsModal(${JSON.stringify(o).replace(/'/g, "&#39;")})' style="background:#8b5cf6; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-weight:500;">
                        👁️ View Order
                    </button>
                ` : ''}
                ${o.status === "Shipped" ? `
                    <button onclick='showOrderDetailsModal(${JSON.stringify(o).replace(/'/g, "&#39;")})' style="background:#8b5cf6; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-weight:500;">
                        👁️ View Order
                    </button>
                    <span style="background:#dbeafe; color:#1e40af; padding:8px 16px; border-radius:20px; font-size:13px;">
                        ⏳ Waiting for buyer confirmation
                    </span>
                ` : ''}
                ${o.status === "Delivered" || o.status === "Completed" ? `
                    <button onclick='showOrderDetailsModal(${JSON.stringify(o).replace(/'/g, "&#39;")})' style="background:#8b5cf6; color:white; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-weight:500;">
                        👁️ View Order
                    </button>
                    <span style="background:#d1fae5; color:#065f46; padding:8px 16px; border-radius:20px; font-size:13px;">
                        ✅ Completed
                    </span>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    let sellerDashboardHtml = `
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin-bottom:20px;">
            <div style="background:#3b82f6; color:white; padding:15px; border-radius:12px; text-align:center;">
                <div style="font-size:28px; font-weight:bold;">${totalOrders}</div>
                <div style="font-size:12px; opacity:0.9;">📦 Total Orders</div>
            </div>
            <div style="background:#f59e0b; color:white; padding:15px; border-radius:12px; text-align:center;">
                <div style="font-size:28px; font-weight:bold;">${processingOrders}</div>
                <div style="font-size:12px; opacity:0.9;">⏳ Processing</div>
            </div>
            <div style="background:#3b82f6; color:white; padding:15px; border-radius:12px; text-align:center;">
                <div style="font-size:28px; font-weight:bold;">${shippedOrders}</div>
                <div style="font-size:12px; opacity:0.9;">🚚 Shipped</div>
            </div>
            <div style="background:#10b981; color:white; padding:15px; border-radius:12px; text-align:center;">
                <div style="font-size:28px; font-weight:bold;">${deliveredOrders}</div>
                <div style="font-size:12px; opacity:0.9;">✅ Delivered</div>
            </div>
        </div>
        
        <div class="premium-card">
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                <img src="${seller.avatar}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:3px solid #e2e8f0;">
                <div>
                    <h3 style="margin:0;">${seller.shopName}</h3>
                    <p style="margin:4px 0; color:#64748b;">${seller.fullName}<br>📞 ${seller.phone}<br>📧 ${seller.email}<br>📍 ${seller.city}, ${seller.country}</p>
                </div>
                <div style="margin-left:auto;">
                    <span class="kyc-status ${kycClass}">${kycText}</span>
                </div>
            </div>
            <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                <div>💰 Balance: <strong style="font-size:20px;">${getCurrencySymbol()}${convertPrice(seller.earnings)}</strong></div>
                <button id="withdrawBtn" style="background:#10b981; color:white; border:none; padding:8px 20px; border-radius:25px; cursor:pointer; font-weight:600;">💸 Withdraw</button>
            </div>
            ${shippingHtml}
        </div>
        
        <div class="chart-container"><h3>📊 Revenue</h3><canvas id="revenueChart"></canvas></div>
        
        <div class="premium-card">
            <h3>📈 Top Products</h3>
            ${topList.map(p=>`${p[0]}: ${p[1]} sold`).join('<br>') || 'No sales yet'}
        </div>
        
        <div class="premium-card"><h3>➕ Add Product</h3>
            <input type="text" id="prodName" placeholder="Product Name" class="input" required>
            <input type="number" id="prodPrice" placeholder="Price (USD)" class="input" required>
            <select id="prodCat" class="input" required>
                <option>Electronics</option><option>Fashion</option><option>Home & Kitchen</option><option>Beauty & Cosmetics</option><option>Books & Stationery</option>
            </select>
            <input type="number" id="prodStock" placeholder="Stock Quantity" class="input" required>
            <div style="background:#f8fafc; padding:16px; border-radius:16px; margin-top:12px; border:1px solid #e2e8f0;">
                <h4 style="margin-bottom:10px;">📦 Product Details</h4>
                <div style="margin-bottom:12px;">
                    <label style="font-size:13px; font-weight:600;">Weight (kg) *</label>
                    <input type="number" id="prodWeight" placeholder="e.g., 2.5" class="input" required step="0.1" min="0.1">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                    <div><label style="font-size:13px; font-weight:600;">Length (cm) *</label><input type="number" id="prodLength" placeholder="e.g., 30" class="input" required min="1"></div>
                    <div><label style="font-size:13px; font-weight:600;">Width (cm) *</label><input type="number" id="prodWidth" placeholder="e.g., 20" class="input" required min="1"></div>
                    <div><label style="font-size:13px; font-weight:600;">Height (cm) *</label><input type="number" id="prodHeight" placeholder="e.g., 10" class="input" required min="1"></div>
                </div>
            </div>
            <label style="margin-top:12px; display:block;">Main Image (upload)</label>
            <input type="file" id="prodMainImg" accept="image/*" class="input" required>
            <label>Additional Images (optional, max 4)</label>
            <input type="file" id="prodImagesFiles" accept="image/*" multiple class="input">
            <textarea id="prodDesc" placeholder="Description" class="input" rows="2"></textarea>
            <button id="publishBtn" class="btn-primary">📢 Publish</button>
        </div>
        
        <div class="premium-card">
            <h3>📋 My Products (${myProducts.length})</h3>
            <div id="myProductsList">${prodListHtml}</div>
        </div>
        
        <div class="premium-card">
            <h3>📦 Orders (${totalOrders})</h3>
            <div id="ordersList">${ordersHtml}</div>
        </div>
    `;
    
    document.getElementById('sellerDashboard').innerHTML = sellerDashboardHtml;
    
    let ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (ctx) {
        if (sellerRevenueChart) sellerRevenueChart.destroy();
        sellerRevenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Revenue',
                    data: chartData.map(v => parseFloat(convertPrice(v))),
                    backgroundColor: '#3b82f6'
                }]
            }
        });
    }
    
    // Event Listeners
    document.getElementById('publishBtn')?.addEventListener('click', async function() {
        const btn = this;
        btn.disabled = true;
        btn.textContent = '⏳ Publishing...';
        
        try {
            const name = document.getElementById('prodName').value;
            const price = parseFloat(document.getElementById('prodPrice').value);
            const cat = document.getElementById('prodCat').value;
            const stock = parseInt(document.getElementById('prodStock').value);
            const desc = document.getElementById('prodDesc').value;
            
            if (!name) { showToast("Product name required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            if (!price || price <= 0) { showToast("Valid price required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            if (!stock || stock <= 0) { showToast("Valid stock required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            
            const mainFile = document.getElementById('prodMainImg').files[0];
            if (!mainFile) { showToast("Main image required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            
            const weight = parseFloat(document.getElementById('prodWeight').value);
            const length = parseFloat(document.getElementById('prodLength').value);
            const width = parseFloat(document.getElementById('prodWidth').value);
            const height = parseFloat(document.getElementById('prodHeight').value);
            
            if (!weight || weight <= 0) { showToast("Valid weight required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            if (!length || length <= 0 || !width || width <= 0 || !height || height <= 0) {
                showToast("Valid dimensions required", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish';
                return;
            }
            
            if (!currentSeller || !currentSeller.sellerId) {
                showToast("Please login as seller first", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish';
                return;
            }
            
            const seller = sellers.find(s => s.id === currentSeller.sellerId);
            if (!seller || seller.kycStatus !== 'verified') {
                showToast("Your KYC is not verified.", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish';
                return;
            }
            
            showToast("Uploading image...", false);
            const mainUrl = await uploadCompressedImage(mainFile);
            if (!mainUrl) { showToast("Image upload failed. Try again.", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            
            const additionalFiles = document.getElementById('prodImagesFiles').files;
            const additionalUrls = [];
            for (let f of additionalFiles) {
                if (additionalUrls.length >= 4) break;
                const url = await uploadCompressedImage(f);
                if (url) additionalUrls.push(url);
            }
            
            const images = [mainUrl, ...additionalUrls];
            
            const newProduct = {
                sellerId: seller.id,
                sellerName: seller.shopName || "GlobalBazaar",
                name: name,
                price: price,
                category: cat,
                mainImage: mainUrl,
                images: images,
                description: desc || "",
                sellerCountry: seller.country || "SA",
                rating: 0,
                stock: stock,
                weight: weight,
                size: { length: length, width: width, height: height },
                createdAt: new Date().toISOString()
            };
            
            await db.collection("products").add(newProduct);
            showToast("✅ Product published successfully!", false);
            addNotification(`Product "${name}" published`, 'info');
            await sendTelegramMessage(`📦 New product: ${name} by ${seller.shopName}`);
            
            document.getElementById('prodName').value = '';
            document.getElementById('prodPrice').value = '';
            document.getElementById('prodStock').value = '';
            document.getElementById('prodMainImg').value = '';
            document.getElementById('prodImagesFiles').value = '';
            document.getElementById('prodDesc').value = '';
            document.getElementById('prodWeight').value = '';
            document.getElementById('prodLength').value = '';
            document.getElementById('prodWidth').value = '';
            document.getElementById('prodHeight').value = '';
            
            renderSellerDashboard();
            renderProducts();
            btn.disabled = false;
            btn.textContent = '📢 Publish';
            
        } catch (error) {
            console.error("Publish error:", error);
            showToast("Error: " + error.message, true);
            btn.disabled = false;
            btn.textContent = '📢 Publish';
        }
    });
    
    document.querySelectorAll('.delProd').forEach(btn => btn.addEventListener('click', async () => {
        let id = btn.dataset.id;
        await db.collection("products").doc(id).delete();
        renderSellerDashboard();
        renderProducts();
        showToast("Product deleted", false);
    }));
    
    document.querySelectorAll('.editProdBtn').forEach(btn => btn.addEventListener('click', () => {
        let prod = products.find(p => p.id == btn.dataset.id);
        if (prod) {
            renderEditProductModal(prod);
        }
    }));
    
    document.querySelectorAll('.shipBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            let track = prompt("Enter tracking number:");
            if (track) markOrderShipped(parseFloat(btn.dataset.id), track);
        });
    });
    
    document.getElementById('withdrawBtn')?.addEventListener('click', () => requestWithdrawal(seller.id));
}

// ============================================================
// RENDER EDIT PRODUCT MODAL WITH RESTOCK
// ============================================================

function renderEditProductModal(prod) {
    document.getElementById('editProdId').value = prod.id;
    document.getElementById('editProdName').value = prod.name;
    document.getElementById('editProdPrice').value = prod.price;
    document.getElementById('editProdCat').value = prod.category;
    document.getElementById('editProdStock').value = prod.stock;
    document.getElementById('editProdDesc').value = prod.description || '';
    
    let currImgHtml = prod.images.map(img => 
        `<div style="display:inline-block; margin:4px;"><img src="${img}" width="60" style="border-radius:8px; border:2px solid #e2e8f0;"></div>`
    ).join('');
    document.getElementById('editCurrentImages').innerHTML = `<strong>Current Images:</strong><br>${currImgHtml}`;
    
    const stockStatus = prod.stock <= 0 ? 
        `<span style="color:#dc2626; font-weight:700;">🔴 SOLD OUT - Please restock!</span>` :
        `<span style="color:#10b981; font-weight:700;">✅ ${prod.stock} units available</span>`;
    document.getElementById('editStockStatus').innerHTML = stockStatus;
    
    document.getElementById('quickRestockBtn').onclick = function() {
        const addStock = prompt(`Add how many units to ${prod.name}? (Current: ${prod.stock})`);
        if (addStock && !isNaN(addStock) && parseInt(addStock) > 0) {
            const newStock = prod.stock + parseInt(addStock);
            document.getElementById('editProdStock').value = newStock;
            showToast(`✅ Stock updated to ${newStock} units`, false);
        } else if (addStock !== null) {
            showToast('Please enter a valid number', true);
        }
    };
    
    document.getElementById('editProductModal').style.display = 'block';
}

// ============================================================
// UPDATE PRODUCT WITH RESTOCK
// ============================================================

document.getElementById('updateProductBtn')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Updating...';
    
    try {
        let pid = document.getElementById('editProdId').value;
        let prodRef = db.collection("products").doc(pid);
        let currentProd = products.find(p => p.id === pid);
        
        let newStock = parseInt(document.getElementById('editProdStock').value);
        let oldStock = currentProd ? currentProd.stock : 0;
        
        let updates = {
            name: document.getElementById('editProdName').value,
            price: parseFloat(document.getElementById('editProdPrice').value),
            category: document.getElementById('editProdCat').value,
            stock: newStock,
            description: document.getElementById('editProdDesc').value
        };
        
        if (oldStock <= 0 && newStock > 0) {
            addNotification(`🔄 Product "${updates.name}" has been restocked!`, 'info');
            await sendTelegramMessage(`🔄 Product Restocked: ${updates.name}\nNew Stock: ${newStock}`);
            showToast('✅ Product restocked successfully!', false);
        }
        
        let newMain = document.getElementById('editMainImg').files[0];
        if (newMain) {
            let mainUrl = await uploadCompressedImage(newMain);
            if (mainUrl) {
                updates.mainImage = mainUrl;
                updates.images = [mainUrl, ...(updates.images || [])];
            }
        }
        
        let newExtra = document.getElementById('editExtraImgs').files;
        if (newExtra.length > 0) {
            let extraUrls = [];
            for (let i = 0; i < Math.min(newExtra.length, 4); i++) {
                let url = await uploadCompressedImage(newExtra[i]);
                if (url) extraUrls.push(url);
            }
            if (extraUrls.length) {
                updates.images = [updates.mainImage || (await prodRef.get()).data().mainImage, ...extraUrls];
            }
        }
        
        await prodRef.update(updates);
        
        if (currentProd) {
            Object.assign(currentProd, updates);
        }
        
        renderSellerDashboard();
        renderProducts();
        showToast("✅ Product updated successfully!", false);
        document.getElementById('editProductModal').style.display = 'none';
        btn.disabled = false;
        btn.textContent = '💾 Update Product';
        
    } catch (error) {
        console.error("Update error:", error);
        showToast("Update failed: " + error.message, true);
        btn.disabled = false;
        btn.textContent = '💾 Update Product';
    }
});

function renderBuyerOrders(){
    const user = auth.currentUser;
    if (!user) return;
    let myOrders = orders.filter(o => o.buyerEmail === user.email);
    document.getElementById('buyerOrdersList').innerHTML = myOrders.map(o => `<div class="order-card"><strong>🔖 ${o.trackingNumber}</strong><br>${o.productName} x${o.qty}<br>${getCurrencySymbol()}${convertPrice(o.amount)}<br>Status: ${o.status}<br>${renderTrackingMap(o)}${o.trackingInfo ? `<br>📮 Tracking: ${o.trackingInfo.trackingNumber || o.trackingInfo}` : ''}<br>${o.status === "Shipped" ? `<button class="confirmReceivedBtn" data-id="${o.id}" style="background:#10b981;">✅ Received</button>` : ''}${o.status === "Processing" ? `<button class="cancelOrderBtn" data-id="${o.id}" style="background:#dc2626;">❌ Cancel Order</button>` : ''}</div>`).join('');
    document.querySelectorAll('.confirmReceivedBtn').forEach(btn => btn.addEventListener('click', () => confirmOrderReceived(parseFloat(btn.dataset.id))));
    document.querySelectorAll('.cancelOrderBtn').forEach(btn => btn.addEventListener('click', () => cancelOrder(parseFloat(btn.dataset.id))));
}

function renderBuyerWishlist(){ let w = products.filter(p => wishlist.includes(p.id)); document.getElementById('buyerWishlistList').innerHTML = w.map(p => `<div class="order-card"><strong>${p.name}</strong><br>Price: ${getCurrencySymbol()}${convertPrice(p.price)}<br><button class="removeWishlistBtn" data-id="${p.id}" style="background:#dc2626;">Remove</button></div>`).join(''); document.querySelectorAll('.removeWishlistBtn').forEach(btn => btn.addEventListener('click', () => { wishlist = wishlist.filter(id => id != btn.dataset.id); saveAllLocal(); renderProducts(); renderBuyerWishlist(); showToast("Removed", false); })); }

document.getElementById('refreshAdminBtn')?.addEventListener('click', loadAdminData);
window.viewSellerDocument = function(docImage, docType, sellerName){ if(docImage && docImage.startsWith('http')){ window.open(docImage, '_blank'); } else { alert(`No image available for ${sellerName}`); } };

// ============================================================
// KYC DOCUMENT VALIDATION
// ============================================================

function validateKYCFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showToast("❌ Only JPG, PNG, and PDF files are allowed!", true);
        return false;
    }
    return true;
}

document.getElementById('sellerDocImage')?.addEventListener('change', function(e) {
    const file = this.files[0];
    const preview = document.getElementById('kycPreview');
    const img = document.getElementById('kycPreviewImg');
    
    if (file) {
        if (!validateKYCFileType(file)) {
            this.value = '';
            preview.style.display = 'none';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.style.display = 'block';
            img.style.display = 'block';
            img.src = event.target.result;
            showToast("✅ Document uploaded! Auto-compressing...", false);
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        img.style.display = 'none';
    }
});

// ============================================================
// POPULATE SHIPPING ZONES IN REGISTRATION FORM
// ============================================================

function populateShippingZones() {
    try {
        const sellerCountry = document.getElementById('sellerCountryReg')?.value;
        if (!sellerCountry) return;
        
        const zoneKey = getCountryZone(sellerCountry);
        const regionalSelect = document.getElementById('regionalCountries');
        const internationalSelect = document.getElementById('internationalCountries');
        
        if (!regionalSelect || !internationalSelect) return;
        
        regionalSelect.innerHTML = '';
        internationalSelect.innerHTML = '';
        
        const allCountries = [];
        for (let zone of Object.values(SHIPPING_ZONES)) {
            allCountries.push(...zone.countries);
        }
        
        const uniqueCountries = [...new Set(allCountries)];
        
        if (zoneKey && SHIPPING_ZONES[zoneKey]) {
            SHIPPING_ZONES[zoneKey].countries.forEach(country => {
                if (country.toLowerCase() !== sellerCountry.toLowerCase()) {
                    const opt = document.createElement('option');
                    opt.value = country;
                    opt.textContent = country;
                    opt.selected = true;
                    regionalSelect.appendChild(opt);
                }
            });
        }
        
        uniqueCountries.forEach(country => {
            if (country.toLowerCase() !== sellerCountry.toLowerCase()) {
                const isRegional = SHIPPING_ZONES[zoneKey]?.countries.some(c => 
                    c.toLowerCase() === country.toLowerCase()
                );
                if (!isRegional) {
                    const opt = document.createElement('option');
                    opt.value = country;
                    opt.textContent = country;
                    opt.selected = true;
                    internationalSelect.appendChild(opt);
                }
            }
        });
        
        document.getElementById('localShippingCharge').value = 15;
        document.getElementById('localFreeAbove').value = 100;
        document.getElementById('regionalShippingCharge').value = SHIPPING_ZONES[zoneKey]?.defaultCharge || 25;
        document.getElementById('regionalFreeAbove').value = SHIPPING_ZONES[zoneKey]?.defaultFreeAbove || 200;
        document.getElementById('internationalShippingCharge').value = 40;
        document.getElementById('internationalFreeAbove').value = 300;
        
    } catch (error) {
        console.error('Populate shipping zones error:', error);
    }
}

// ============================================================
// BACKWARD COMPATIBILITY - MIGRATE OLD SELLERS
// ============================================================

async function migrateOldSellers() {
    try {
        const snapshot = await db.collection("sellers").get();
        for (let doc of snapshot.docs) {
            const data = doc.data();
            if (!data.shippingZones) {
                const defaultZones = setupShippingZonesForSeller(data.country || "Saudi Arabia");
                await db.collection("sellers").doc(doc.id).update({
                    shippingZones: defaultZones
                });
                console.log(`Migrated seller: ${data.shopName}`);
            }
        }
    } catch (error) {
        console.error('Migration error:', error);
    }
}

setTimeout(migrateOldSellers, 5000);

// ============================================================
// MODALS & UI FUNCTIONS
// ============================================================

function showPrivacy() {
    document.getElementById('termsModal').style.display = 'block';
    document.getElementById('termsModal').querySelector('.modal-card').innerHTML = `
        <span class="close-modal" onclick="closeTermsModal()">&times;</span>
        <h2>Privacy Policy</h2>
        <p><strong>Last Updated:</strong> 16 June 2026</p>
        <h3>1. Information We Collect</h3>
        <ul style="text-align:left;"><li><strong>Personal Information:</strong> Name, email, phone, shipping address</li><li><strong>Payment Information:</strong> Processed securely by payment partners</li><li><strong>Device Information:</strong> IP address, browser type</li></ul>
        <h3>2. How We Use Your Information</h3>
        <ul style="text-align:left;"><li>Process orders and deliver products</li><li>Communicate with you about orders</li><li>Improve our website and user experience</li><li>Prevent fraud and ensure security</li></ul>
        <h3>3. Data Sharing</h3>
        <ul style="text-align:left;"><li><strong>Sellers:</strong> To fulfill your orders</li><li><strong>Payment Partners:</strong> To process payments</li><li><strong>Shipping Partners:</strong> To deliver orders</li></ul>
        <h3>4. Data Security</h3>
        <p>We use industry-standard security measures. All payments are encrypted via SSL.</p>
        <h3>5. Contact Us</h3>
        <p>Email: support@globalbazaar.com</p>
        <button class="btn-primary" onclick="closeTermsModal()">Close</button>
    `;
}

function showTerms() {
    document.getElementById('termsModal').style.display = 'block';
    document.getElementById('termsModal').querySelector('.modal-card').innerHTML = `
        <span class="close-modal" onclick="closeTermsModal()">&times;</span>
        <h2>Terms & Conditions</h2>
        <p><strong>Last Updated:</strong> 16 June 2026</p>
        <h3>1. Acceptance of Terms</h3>
        <p>By using GlobalBazaar, you agree to these Terms & Conditions.</p>
        <h3>2. User Accounts</h3>
        <ul style="text-align:left;"><li>You must be <strong>18 years or older</strong></li><li>You are responsible for your account security</li></ul>
        <h3>3. ⭐ Auto-Order Confirmation (2 Days Rule)</h3>
        <ul style="text-align:left;"><li><strong>Confirm within 2 days (48 hours)</strong> of receiving the product</li><li><strong>If not confirmed:</strong> Order will be <strong>automatically marked as delivered</strong></li><li><strong>Disputes:</strong> Must be filed within 2 days of delivery</li></ul>
        <h3>4. Seller Terms</h3>
        <ul style="text-align:left;"><li>Sellers must provide accurate product descriptions</li><li>Commission: <strong>10%</strong> of each sale</li><li>KYC verification required for withdrawals</li></ul>
        <h3>5. Refund and Dispute</h3>
        <ul style="text-align:left;"><li>If not received within <strong>7 days</strong>, request a refund</li><li>Disputes must be raised within <strong>2 days</strong> of delivery</li></ul>
        <h3>6. Contact Us</h3>
        <p>Email: support@globalbazaar.com</p>
        <button class="btn-primary" onclick="closeTermsModal()">Close</button>
    `;
}

function showSection(section){ document.querySelectorAll('.section').forEach(s => s.classList.remove('active')); document.getElementById(section+"Section").classList.add('active'); }
document.getElementById('drawerBuyer')?.addEventListener('click', () => { showMyOrdersPage(); closeDrawer(); });
document.getElementById('drawerSeller')?.addEventListener('click', () => { showSection('seller'); document.getElementById('sellerRegisterBox').style.display='block'; document.getElementById('sellerDashboard').style.display='none'; closeDrawer(); });
document.getElementById('drawerAdmin')?.addEventListener('click', () => { showSection('admin'); closeDrawer(); });
document.getElementById('drawerCartPage')?.addEventListener('click', () => { renderCartPage(); showSection('cartPage'); closeDrawer(); });
document.getElementById('drawerWishlist')?.addEventListener('click', () => { showSection('profile'); renderBuyerWishlist(); closeDrawer(); });
document.getElementById('drawerSupport')?.addEventListener('click', () => { showSupport(); closeDrawer(); });
document.getElementById('drawerLogout')?.addEventListener('click', () => { auth.signOut(); currentSeller = null; localStorage.removeItem('gb_current_seller'); location.reload(); });
document.getElementById('cartFloatBtn')?.addEventListener('click', () => { renderCartPage(); showSection('cartPage'); });
document.getElementById('closeModalBtn')?.addEventListener('click', () => document.getElementById('productModal').style.display='none');
document.getElementById('modalAddCartBtn')?.addEventListener('click', () => { if(currentProduct) addToCart(currentProduct.id); document.getElementById('productModal').style.display='none'; });
document.getElementById('modalAddWishBtn')?.addEventListener('click', () => { if(currentProduct) toggleWish(currentProduct.id); document.getElementById('productModal').style.display='none'; });
function openDrawer(){ document.getElementById('drawer').classList.add('open'); document.getElementById('drawerOverlay').style.display='block'; }
function closeDrawer(){ document.getElementById('drawer').classList.remove('open'); document.getElementById('drawerOverlay').style.display='none'; }
document.getElementById('menuBtn').onclick = openDrawer;
document.getElementById('drawerOverlay').onclick = closeDrawer;
document.getElementById('cardNumber')?.addEventListener('input', function(e){ let v = e.target.value.replace(/\s/g,'').replace(/(\d{4})/g,'$1 ').trim(); e.target.value = v; });
document.getElementById('expiryDate')?.addEventListener('input', function(e){ let v = e.target.value.replace(/\//g,''); if(v.length>=2) v = v.slice(0,2)+'/'+v.slice(2,4); e.target.value = v; });
function closeEditModal(){ document.getElementById('editProductModal').style.display='none'; }
function saveAllLocal(){
    localStorage.setItem('gb_cart', JSON.stringify(cart));
    localStorage.setItem('gb_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('gb_orders', JSON.stringify(orders));
    localStorage.setItem('gb_platform_earnings', JSON.stringify(platformEarnings));
    localStorage.setItem('gb_pending_withdrawals', JSON.stringify(pendingWithdrawals));
    localStorage.setItem('gb_saved_cards', JSON.stringify(savedCards));
    localStorage.setItem('gb_saved_addresses', JSON.stringify(savedAddresses));
    localStorage.setItem('gb_notifications', JSON.stringify(notifications));
    if(currentSeller) localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
}
function showToast(msg, isError){ let t = document.getElementById('toast'); t.innerText = msg; t.style.backgroundColor = isError ? '#dc2626' : '#10b981'; t.style.display = 'block'; setTimeout(()=> t.style.display='none', 3000); }
function closeTermsModal(){ document.getElementById('termsModal').style.display='none'; }
function showSellerAgreement(){ document.getElementById('sellerAgreementModal').style.display='block'; }
function closeSellerAgreementModal(){ document.getElementById('sellerAgreementModal').style.display='none'; }
function showSupport(){ document.getElementById('supportModal').style.display='block'; }
function closeSupportModal(){ document.getElementById('supportModal').style.display='none'; }
function calculateAge(dob){ return new Date().getFullYear() - new Date(dob).getFullYear(); }
function closeSellerSummary(){ document.getElementById('sellerSummaryModal').style.display='none'; showSection('buyer'); }
function closeOrderSummary(){ document.getElementById('orderSummaryModal').style.display='none'; showSection('buyer'); }
document.getElementById('goToMyShopBtn')?.addEventListener('click', () => { closeSellerSummary(); showMyShopLogin(); });

document.getElementById('showRegisterLink')?.addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('modalAuthTitle').innerText = '📝 Create Account';
});
document.getElementById('showLoginLink')?.addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('modalAuthTitle').innerText = '🔐 Login to GlobalBazaar';
});
document.getElementById('closeLoginModal')?.addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
});
document.getElementById('loginModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
});

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('sellerCountryReg');
    if (countrySelect) {
        countrySelect.addEventListener('change', populateShippingZones);
    }
    
    const cartTotalDiv = document.getElementById('cartShippingTotal');
    if (!cartTotalDiv) {
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            const subtotalDiv = document.createElement('div');
            subtotalDiv.className = 'flex-between';
            subtotalDiv.innerHTML = `<span>📦 Subtotal:</span><span id="cartSubtotal">${getCurrencySymbol()}0.00</span>`;
            cartSummary.insertBefore(subtotalDiv, cartSummary.firstChild);
            
            const shippingDiv = document.createElement('div');
            shippingDiv.className = 'flex-between';
            shippingDiv.innerHTML = `<span>🚚 Shipping:</span><span id="cartShippingTotal">${getCurrencySymbol()}0.00</span>`;
            cartSummary.insertBefore(shippingDiv, cartSummary.lastChild);
        }
    }
    
    // Fix for order details modal close
    const closeOrderDetails = document.querySelector('#orderDetailsModal .close-modal');
    if (closeOrderDetails) {
        closeOrderDetails.addEventListener('click', closeOrderDetailsModal);
    }
});

// Close order details modal function
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) modal.style.display = 'none';
}

renderCats(); updateCartUI(); updateNotificationUI(); updateAdminPendingBadge(); updateAdminMenuBadges();
document.getElementById('debugMsg').innerHTML = "GlobalBazaar Ready | 5 Categories | 15 Products | Shipping Active";
