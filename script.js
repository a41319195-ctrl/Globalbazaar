// ============================================================
// GLOBAL BAZAAR - COMPLETE FIXED CODE
// WITH ZONE-BASED SHIPPING SYSTEM + PUBLISH FIX
// ============================================================

// ============================================================
// ⭐ ZONE-BASED SHIPPING SYSTEM
// ============================================================

// Zone Definitions
const ZONES = {
    ZONE_1_LOCAL: {
        id: 'ZONE_1_LOCAL',
        name: '🇸🇦 Local (Saudi Arabia)',
        countries: ['Saudi Arabia', 'saudi arabia', 'SA', 'sa', 'Kingdom of Saudi Arabia', 'KSA', 'ksa']
    },
    ZONE_2_GCC: {
        id: 'ZONE_2_GCC',
        name: '🌍 GCC Countries',
        countries: ['UAE', 'uae', 'United Arab Emirates', 'Qatar', 'qatar', 'Oman', 'oman', 'Kuwait', 'kuwait', 'Bahrain', 'bahrain']
    },
    ZONE_3_SOUTH_ASIA: {
        id: 'ZONE_3_SOUTH_ASIA',
        name: '🌏 South Asia',
        countries: ['India', 'indian', 'Pakistan', 'pakistani', 'Bangladesh', 'Nepal', 'Sri Lanka', 'srilanka']
    },
    ZONE_4_ASIA: {
        id: 'ZONE_4_ASIA',
        name: '🌏 Asia',
        countries: ['China', 'Japan', 'South Korea', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam', 'Singapore', 'Taiwan', 'Hong Kong']
    },
    ZONE_5_EUROPE: {
        id: 'ZONE_5_EUROPE',
        name: '🌍 Europe',
        countries: ['UK', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Switzerland', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Belgium', 'Austria', 'Poland', 'Czech', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Turkey']
    },
    ZONE_6_AMERICAS: {
        id: 'ZONE_6_AMERICAS',
        name: '🌎 Americas',
        countries: ['USA', 'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay']
    },
    ZONE_7_REST_OF_WORLD: {
        id: 'ZONE_7_REST_OF_WORLD',
        name: '🌍 Rest of World',
        countries: []
    }
};

// Default Shipping Rates per Zone
const DEFAULT_SHIPPING_RATES = {
    'ZONE_1_LOCAL': { ZONE_1_LOCAL: 10, ZONE_2_GCC: 25, ZONE_3_SOUTH_ASIA: 35, ZONE_4_ASIA: 45, ZONE_5_EUROPE: 55, ZONE_6_AMERICAS: 65, ZONE_7_REST_OF_WORLD: 75 },
    'ZONE_2_GCC': { ZONE_1_LOCAL: 15, ZONE_2_GCC: 10, ZONE_3_SOUTH_ASIA: 30, ZONE_4_ASIA: 40, ZONE_5_EUROPE: 50, ZONE_6_AMERICAS: 60, ZONE_7_REST_OF_WORLD: 70 },
    'ZONE_3_SOUTH_ASIA': { ZONE_1_LOCAL: 30, ZONE_2_GCC: 25, ZONE_3_SOUTH_ASIA: 10, ZONE_4_ASIA: 20, ZONE_5_EUROPE: 40, ZONE_6_AMERICAS: 50, ZONE_7_REST_OF_WORLD: 60 },
    'ZONE_4_ASIA': { ZONE_1_LOCAL: 35, ZONE_2_GCC: 30, ZONE_3_SOUTH_ASIA: 20, ZONE_4_ASIA: 10, ZONE_5_EUROPE: 35, ZONE_6_AMERICAS: 45, ZONE_7_REST_OF_WORLD: 55 },
    'ZONE_5_EUROPE': { ZONE_1_LOCAL: 50, ZONE_2_GCC: 45, ZONE_3_SOUTH_ASIA: 40, ZONE_4_ASIA: 35, ZONE_5_EUROPE: 10, ZONE_6_AMERICAS: 30, ZONE_7_REST_OF_WORLD: 40 },
    'ZONE_6_AMERICAS': { ZONE_1_LOCAL: 55, ZONE_2_GCC: 50, ZONE_3_SOUTH_ASIA: 45, ZONE_4_ASIA: 40, ZONE_5_EUROPE: 30, ZONE_6_AMERICAS: 10, ZONE_7_REST_OF_WORLD: 35 },
    'ZONE_7_REST_OF_WORLD': { ZONE_1_LOCAL: 60, ZONE_2_GCC: 55, ZONE_3_SOUTH_ASIA: 50, ZONE_4_ASIA: 45, ZONE_5_EUROPE: 35, ZONE_6_AMERICAS: 30, ZONE_7_REST_OF_WORLD: 10 }
};

function getShippingZone(countryName) {
    const clean = countryName?.toString().trim() || '';
    for (const [zoneId, zone] of Object.entries(ZONES)) {
        if (zone.countries.some(c => clean.includes(c) || clean === c)) {
            return zoneId;
        }
    }
    return 'ZONE_7_REST_OF_WORLD';
}

function getShippingZoneName(zoneId) {
    return ZONES[zoneId]?.name || '🌍 Rest of World';
}

async function detectSellerZoneByIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_name || 'Saudi Arabia';
        const zone = getShippingZone(country);
        return {
            country: country,
            countryCode: data.country_code || 'SA',
            zone: zone,
            zoneName: getShippingZoneName(zone)
        };
    } catch (error) {
        console.error('IP detection failed:', error);
        return {
            country: 'Saudi Arabia',
            countryCode: 'SA',
            zone: 'ZONE_1_LOCAL',
            zoneName: '🇸🇦 Local (Saudi Arabia)'
        };
    }
}

function getDefaultShippingRates(zoneId) {
    return DEFAULT_SHIPPING_RATES[zoneId] || DEFAULT_SHIPPING_RATES['ZONE_1_LOCAL'];
}

async function getShippingRateByZone(productId, buyerCountry) {
    try {
        if (!productId) return null;
        const productDoc = await db.collection('products').doc(productId).get();
        if (!productDoc.exists) return null;
        const product = productDoc.data();
        const zone = getShippingZone(buyerCountry);
        let shippingRate = 0;
        if (product.shippingRates) {
            const zoneRates = ['ZONE_1_LOCAL', 'ZONE_2_GCC', 'ZONE_3_SOUTH_ASIA', 'ZONE_4_ASIA', 'ZONE_5_EUROPE', 'ZONE_6_AMERICAS', 'ZONE_7_REST_OF_WORLD'];
            for (const z of zoneRates) {
                if (zone === z && product.shippingRates[z] > 0) {
                    shippingRate = product.shippingRates[z];
                    break;
                }
            }
            if (shippingRate === 0 && product.sellerId) {
                const sellerDoc = await db.collection('sellers').doc(product.sellerId).get();
                if (sellerDoc.exists) {
                    const seller = sellerDoc.data();
                    if (seller.shippingRates) {
                        for (const z of zoneRates) {
                            if (zone === z && seller.shippingRates[z] > 0) {
                                shippingRate = seller.shippingRates[z];
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (shippingRate <= 0 || isNaN(shippingRate)) return null;
        return { rate: shippingRate, zone: zone, zoneName: getShippingZoneName(zone), currency: 'USD' };
    } catch (error) {
        console.error('Error getting shipping rate:', error);
        return null;
    }
}

// ============================================================
// FIREBASE CONFIG
// ============================================================
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
// CONSTANTS
// ============================================================
const FIXED_CATEGORIES = ['Fashion', 'Textiles', 'Cosmetics', 'Electronics', 'Home Decor'];
const MAINTENANCE_FEE = 1.50;
const GATEWAY_PERCENT = 0.03;
const PLATFORM_COMMISSION = 0.10;
const TELEGRAM_BOT_TOKEN = "8328824652:AAE-b4o6DaFDa9WPtZfrOfM7SYGU9gUa9HQ";
const TELEGRAM_CHAT_ID = "7111653640";

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
let pendingConfirmationProduct = null;
let lastShippingFetch = 0;
let currentShippingCost = 0;

// ============================================================
// CURRENCY
// ============================================================
const fxRates = { SAR: 3.75, USD: 1, EUR: 0.92, GBP: 0.78, INR: 83.5, PKR: 278, NPR: 133.5, BDT: 117, LKR: 305, AED: 3.67, CAD: 1.36, AUD: 1.52, SGD: 1.35, MYR: 4.70, THB: 36.5, JPY: 150.2, CNY: 7.25 };
const currencySymbols = { SAR: "SAR ", USD: "$", EUR: "€", GBP: "£", INR: "₹", PKR: "₨", NPR: "रू ", BDT: "৳", LKR: "Rs ", AED: "د.إ ", CAD: "$", AUD: "$", SGD: "$", MYR: "RM ", THB: "฿", JPY: "¥", CNY: "¥" };

function convertPrice(usd) { return (usd * fxRates[selectedCurrency]).toFixed(2); }

function getCurrencySymbol() { return currencySymbols[selectedCurrency]; }

function calculateDisplayPrice(basePrice) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let total = basePrice + gatewayFee + MAINTENANCE_FEE;
    return { total, basePrice, gateway: gatewayFee, handling: MAINTENANCE_FEE };
}

function calculateDynamicPrice(basePrice, shippingCost = 0) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let maintenanceFee = MAINTENANCE_FEE;
    let grandTotal = basePrice + maintenanceFee + gatewayFee + shippingCost;
    return { basePrice, gatewayFee, maintenanceFee, shippingCost, grandTotal };
}

// ============================================================
// TOAST & NOTIFICATIONS
// ============================================================
function showToast(msg, isError) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:12px;color:white;font-weight:600;z-index:9999;display:none;max-width:90%;text-align:center;';
        document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.backgroundColor = isError ? '#dc2626' : '#10b981';
    t.style.display = 'block';
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.style.display = 'none', 3000);
}

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
    let html = notifications.map(n =>
        `<div class="notification-item" data-id="${n.id}" style="${n.read ? 'opacity:0.6' : ''}">
            <strong>${n.type === 'order' ? '🛍️' : (n.type === 'payment' ? '💰' : 'ℹ️')}</strong> 
            ${n.message}<br><small>${n.date}</small>
        </div>`
    ).join('');
    if (notifications.length === 0) html = '<div style="padding:20px;text-align:center;">No notifications</div>';
    const list = document.getElementById('notificationsList');
    if (list) list.innerHTML = html;
}

async function sendTelegramMessage(msg) {
    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'HTML' })
        });
    } catch (e) { console.error('Telegram error:', e); }
}

// ============================================================
// IMAGE COMPRESSION
// ============================================================
function compressImage(file, maxSizeMB = 0.5, maxWidth = 1024, maxHeight = 1024) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                let width = img.width,
                    height = img.height,
                    quality = 0.7;
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
                        if (sizeMB <= maxSizeMB || attempt >= maxAttempts) resolve(blob);
                        else { attempt++;
                            tryQuality(q * 0.85); }
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
// DATABASE INIT
// ============================================================
async function initializeDatabase() {
    try {
        console.log('🔍 Initializing database...');
        const productsSnapshot = await db.collection('products').limit(1).get();
        if (productsSnapshot.empty) {
            console.log('📦 Products collection empty. Seeding default products...');
            await seedProductsIfEmpty();
        }
        console.log('✅ Database initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        showToast('⚠️ Database initialization failed. Please refresh.', true);
        return false;
    }
}

// ============================================================
// DEFAULT PRODUCTS
// ============================================================
const defaultProducts = [{
    sellerId: 0,
    sellerName: "GlobalBazaar",
    name: "Matte Lipstick Set",
    price: 29.99,
    category: "Cosmetics",
    sellerCountry: "SA",
    mainImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400", "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400"],
    description: "Long-lasting matte lipstick set with 6 vibrant colors",
    stock: 10,
    weight: 0.2,
    size: { length: 10, width: 8, height: 4 },
    shippingRates: { ZONE_1_LOCAL: 10, ZONE_2_GCC: 15, ZONE_3_SOUTH_ASIA: 25, ZONE_4_ASIA: 30, ZONE_5_EUROPE: 40, ZONE_6_AMERICAS: 50, ZONE_7_REST_OF_WORLD: 60 },
    status: 'available'
}, {
    sellerId: 0,
    sellerName: "GlobalBazaar",
    name: "Wireless Headphones",
    price: 89.99,
    category: "Electronics",
    sellerCountry: "SA",
    mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"],
    description: "Premium wireless headphones with noise cancellation",
    stock: 10,
    weight: 0.5,
    size: { length: 15, width: 10, height: 5 },
    shippingRates: { ZONE_1_LOCAL: 15, ZONE_2_GCC: 20, ZONE_3_SOUTH_ASIA: 30, ZONE_4_ASIA: 35, ZONE_5_EUROPE: 45, ZONE_6_AMERICAS: 55, ZONE_7_REST_OF_WORLD: 65 },
    status: 'available'
}, {
    sellerId: 0,
    sellerName: "GlobalBazaar",
    name: "Premium Cotton T-Shirt",
    price: 24.99,
    category: "Fashion",
    sellerCountry: "SA",
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"],
    description: "100% combed cotton premium t-shirt",
    stock: 10,
    weight: 0.3,
    size: { length: 25, width: 20, height: 5 },
    shippingRates: { ZONE_1_LOCAL: 8, ZONE_2_GCC: 12, ZONE_3_SOUTH_ASIA: 20, ZONE_4_ASIA: 25, ZONE_5_EUROPE: 35, ZONE_6_AMERICAS: 45, ZONE_7_REST_OF_WORLD: 55 },
    status: 'available'
}, {
    sellerId: 0,
    sellerName: "GlobalBazaar",
    name: "Silk Scarf",
    price: 19.99,
    category: "Textiles",
    sellerCountry: "SA",
    mainImage: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400",
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
    description: "Luxury silk scarf with elegant design",
    stock: 10,
    weight: 0.15,
    size: { length: 20, width: 20, height: 2 },
    shippingRates: { ZONE_1_LOCAL: 5, ZONE_2_GCC: 8, ZONE_3_SOUTH_ASIA: 15, ZONE_4_ASIA: 20, ZONE_5_EUROPE: 30, ZONE_6_AMERICAS: 40, ZONE_7_REST_OF_WORLD: 50 },
    status: 'available'
}, {
    sellerId: 0,
    sellerName: "GlobalBazaar",
    name: "Home Decor Vase",
    price: 39.99,
    category: "Home Decor",
    sellerCountry: "SA",
    mainImage: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400",
    images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400", "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400"],
    description: "Elegant ceramic vase for modern home decor",
    stock: 10,
    weight: 0.8,
    size: { length: 20, width: 20, height: 30 },
    shippingRates: { ZONE_1_LOCAL: 18, ZONE_2_GCC: 25, ZONE_3_SOUTH_ASIA: 35, ZONE_4_ASIA: 40, ZONE_5_EUROPE: 50, ZONE_6_AMERICAS: 60, ZONE_7_REST_OF_WORLD: 70 },
    status: 'available'
}];

async function seedProductsIfEmpty() {
    try {
        const snapshot = await db.collection("products").get();
        if (snapshot.empty) {
            for (let p of defaultProducts) {
                const calc = calculateDisplayPrice(p.price);
                await db.collection("products").add({
                    ...p,
                    price: p.price,
                    publicPrice: calc.total,
                    gatewayFee: calc.gateway,
                    handlingFee: calc.handling,
                    commission: p.price * 0.10,
                    sellerEarning: p.price - (p.price * 0.10) - 1.50,
                    platformRevenue: calc.gateway + (p.price * 0.10) + 1.50,
                    createdAt: new Date().toISOString(),
                    status: 'available'
                });
            }
            console.log("✅ Seeded 5 default products");
        }
    } catch (e) { console.error('Seed error:', e); }
}

// ============================================================
// FIRESTORE LISTENERS
// ============================================================
db.collection("products").onSnapshot(snapshot => {
    products = [];
    snapshot.forEach(doc => { products.push({ id: doc.id, ...doc.data() }); });
    renderProducts();
    renderCats();
});

db.collection("sellers").onSnapshot(snapshot => {
    sellers = [];
    snapshot.forEach(doc => { sellers.push({ id: doc.id, ...doc.data() }); });
    if (currentSeller) {
        const freshSeller = sellers.find(s => s.id === currentSeller.sellerId);
        if (freshSeller) {
            currentSeller = { ...currentSeller, kycStatus: freshSeller.kycStatus, earnings: freshSeller.earnings };
            localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
            if (freshSeller.kycStatus === 'verified') {
                showToast("✅ Your KYC has been verified!", false);
                if (document.getElementById('sellerRegisterBox').style.display === 'block') {
                    document.getElementById('sellerRegisterBox').style.display = 'none';
                    document.getElementById('sellerDashboard').style.display = 'block';
                    renderSellerDashboard();
                }
            }
        }
    }
    updateAdminPendingBadge();
    updateAdminMenuBadges();
    if (isAdminLoggedIn) loadAdminData();
    if (currentSeller) {
        const stillExists = sellers.find(s => s.id === currentSeller.sellerId);
        if (stillExists && stillExists.kycStatus === 'verified') {
            currentSeller = { ...currentSeller, ...stillExists };
            localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
            if (document.getElementById('sellerDashboard').style.display === 'block') {
                renderSellerDashboard();
            }
        } else if (stillExists && stillExists.kycStatus !== 'verified') {
            if (currentSeller?.sellerId === stillExists.id) {
                document.getElementById('sellerDashboard').style.display = 'none';
                document.getElementById('sellerRegisterBox').style.display = 'block';
                currentSeller = null;
                localStorage.removeItem('gb_current_seller');
                if (stillExists.kycStatus === 'pending') {
                    showToast("Your KYC is pending verification by admin.", true);
                } else if (stillExists.kycStatus === 'rejected') {
                    showToast("Your KYC was rejected. Contact support.", true);
                }
            }
        }
    }
});

// ============================================================
// AUTHENTICATION
// ============================================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentBuyer = user;
        const sellerSnapshot = await db.collection("sellers").where("uid", "==", user.uid).get();
        if (!sellerSnapshot.empty) {
            const sellerData = sellerSnapshot.docs[0].data();
            const sellerId = sellerSnapshot.docs[0].id;
            if (user.emailVerified && !sellerData.emailVerified) {
                await db.collection("sellers").doc(sellerId).update({ emailVerified: true, kycStatus: 'pending' });
                showToast("✅ Email verified! Waiting for admin KYC approval.", false);
                addNotification(`Seller ${sellerData.shopName} verified email!`, 'info');
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
            }
            if (sellerData.emailVerified) {
                currentSeller = {
                    name: sellerData.fullName,
                    email: sellerData.email,
                    role: 'seller',
                    sellerId: sellerId,
                    phone: sellerData.phone,
                    kycStatus: sellerData.kycStatus || 'pending',
                    shopName: sellerData.shopName
                };
                localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
                if (sellerData.kycStatus === 'verified') {
                    document.getElementById('sellerRegisterBox').style.display = 'none';
                    document.getElementById('sellerDashboard').style.display = 'block';
                    renderSellerDashboard();
                }
            }
        }
    } else {
        currentBuyer = null;
        cart = [];
        updateCartUI();
    }
    renderProducts();
});

// ============================================================
// ⭐ FIXED: RENDER SELLER DASHBOARD WITH ZONE SUPPORT
// ============================================================
function renderSellerDashboard() {
    if (!currentSeller?.sellerId) return;
    let seller = sellers.find(s => s.id === currentSeller.sellerId);
    if (!seller) return;

    if (seller.kycStatus !== 'verified') {
        document.getElementById('sellerDashboard').innerHTML = `
            <div class="kyc-blocked-message">
                <h2>🔒 KYC Verification Required</h2>
                <p>Your KYC status is <strong>${seller.kycStatus}</strong>.<br>
                Please wait for admin approval or contact support.<br>
                <br>📧 support@globalbazaar.com</p>
            </div>
        `;
        updateMyShopBadge();
        return;
    }

    let myProducts = products.filter(p => p.sellerId == seller.id);
    let myOrders = orders.filter(o => o.sellerId == seller.id);
    let totalSales = 0,
        totalOrders = myOrders.length;
    let pendingOrders = myOrders.filter(o => o.status === 'Processing');
    let soldOutProducts = myProducts.filter(p => p.stock <= 0);
    let pendingCount = pendingOrders.length;

    // Revenue calculation
    let monthlyRevenue = {};
    myOrders.forEach(o => {
        if (o.status === "Completed") {
            let netRevenue = (o.basePrice - (o.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * o.qty;
            totalSales += netRevenue;
            let date = new Date(o.date);
            let my = `${date.getMonth()+1}/${date.getFullYear()}`;
            monthlyRevenue[my] = (monthlyRevenue[my] || 0) + netRevenue;
        }
    });

    let chartLabels = Object.keys(monthlyRevenue),
        chartData = Object.values(monthlyRevenue);
    if (chartLabels.length === 0) { chartLabels = ["No Data"];
        chartData = [0]; }

    let kycClass = seller.kycStatus === "pending" ? "kyc-pending" : (seller.kycStatus === "verified" ? "kyc-verified" : "kyc-rejected");
    let kycText = seller.kycStatus === "pending" ? "⏳ KYC Pending - Wait for Admin" : (seller.kycStatus === "verified" ? "✅ KYC Verified" : "❌ KYC Rejected");
    let topProducts = {};
    myOrders.forEach(o => { topProducts[o.productName] = (topProducts[o.productName] || 0) + o.qty; });
    let topList = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    let prodListHtml = myProducts.map(p => {
        const isSoldOut = p.stock <= 0;
        return `<div class="flex-between">
            <span>
                <img src="${p.mainImage}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;"> 
                ${p.name} - ${getCurrencySymbol()}${convertPrice(p.price)} 
                (Stock: ${p.stock}) 
                ${isSoldOut ? '🔴 SOLD OUT' : ''}
                ${p.soldOutAt && isSoldOut ? `⏳ Auto-delete: ${getTimeRemaining(p.soldOutAt)}` : ''}
            </span>
            <button class="editProdBtn" data-id="${p.id}" style="background:#3b82f6;border:none;padding:4px 12px;border-radius:20px;">✏️ Edit</button>
            <button class="delProd" data-id="${p.id}" style="background:#dc2626;border:none;padding:4px 12px;border-radius:20px;">Delete</button>
        </div>`;
    }).join('');

    // Get seller's zone for auto-fill
    const sellerZone = seller.shippingZone || 'ZONE_1_LOCAL';
    const defaultRates = getDefaultShippingRates(sellerZone);

    // ⭐ FIXED: ADD PRODUCT HTML - NO FORM, WITH ZONE SUPPORT
    const categoryOptions = FIXED_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    const addProductHtml = `
    <div class="premium-card">
        <h3>➕ Add Product</h3>
        
        <!-- Show seller zone info -->
        <div style="background:#f0fdf4; padding:12px; border-radius:12px; border:2px solid #22c55e; margin-bottom:15px;">
            <p style="margin:0; font-size:14px;">
                <strong>📍 Your Zone:</strong> ${getShippingZoneName(sellerZone)}
                <br><span style="font-size:12px; color:#64748b;">Shipping rates auto-filled based on your zone. You can customize below.</span>
            </p>
        </div>
        
        <div id="addProductForm">
            <input type="text" id="prodName" placeholder="Product Name" class="input" required>
            <input type="number" id="prodPrice" placeholder="Price (USD)" class="input" required>
            <select id="prodCat" class="input" required>
                <option value="">Select Category</option>
                ${categoryOptions}
            </select>
            <input type="number" id="prodStock" placeholder="Stock Quantity" class="input" required>
            
            <!-- Zone-Based Shipping Rates -->
            <div style="background:#f8fafc; padding:16px; border-radius:16px; margin-top:12px; border:1px solid #e2e8f0;">
                <h4 style="margin-bottom:10px;">📦 Zone-Based Shipping Rates</h4>
                <p style="font-size:12px; color:#64748b; margin-bottom:10px;">
                    Set shipping rates for each zone. Buyer will see rate based on their country.
                </p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div>
                        <label style="font-size:12px; font-weight:600;">🇸🇦 Zone 1 (Local - SA)</label>
                        <input type="number" id="prodShippingZone1" placeholder="10.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_1_LOCAL || 0}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600;">🌍 Zone 2 (GCC)</label>
                        <input type="number" id="prodShippingZone2" placeholder="15.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_2_GCC || 0}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600;">🌏 Zone 3 (South Asia)</label>
                        <input type="number" id="prodShippingZone3" placeholder="25.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_3_SOUTH_ASIA || 0}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600;">🌏 Zone 4 (Asia)</label>
                        <input type="number" id="prodShippingZone4" placeholder="30.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_4_ASIA || 0}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600;">🌍 Zone 5 (Europe)</label>
                        <input type="number" id="prodShippingZone5" placeholder="40.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_5_EUROPE || 0}">
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:600;">🌎 Zone 6 (Americas)</label>
                        <input type="number" id="prodShippingZone6" placeholder="50.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_6_AMERICAS || 0}">
                    </div>
                    <div style="grid-column: 1/3;">
                        <label style="font-size:12px; font-weight:600;">🌍 Zone 7 (Rest of World)</label>
                        <input type="number" id="prodShippingZone7" placeholder="60.00" class="input" step="0.01" min="0" value="${defaultRates.ZONE_7_REST_OF_WORLD || 0}">
                    </div>
                </div>
                <p style="font-size:11px; color:#94a3b8; margin-top:8px;">
                    ⚠️ If a zone rate is 0, buyer will see "Shipping not available".
                </p>
            </div>
            
            <!-- Weight & Dimensions -->
            <div style="background:#f8fafc; padding:16px; border-radius:16px; margin-top:12px; border:1px solid #e2e8f0;">
                <h4 style="margin-bottom:10px;">📦 Weight & Dimensions</h4>
                <div style="margin-bottom:12px;">
                    <label style="font-size:13px; font-weight:600;">Weight (kg) *</label>
                    <input type="number" id="prodWeight" placeholder="e.g., 2.5" class="input" required step="0.1" min="0.1">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                    <div>
                        <label style="font-size:13px; font-weight:600;">Length (cm) *</label>
                        <input type="number" id="prodLength" placeholder="e.g., 30" class="input" required min="1">
                    </div>
                    <div>
                        <label style="font-size:13px; font-weight:600;">Width (cm) *</label>
                        <input type="number" id="prodWidth" placeholder="e.g., 20" class="input" required min="1">
                    </div>
                    <div>
                        <label style="font-size:13px; font-weight:600;">Height (cm) *</label>
                        <input type="number" id="prodHeight" placeholder="e.g., 10" class="input" required min="1">
                    </div>
                </div>
                <p style="font-size:12px; color:#64748b; margin-top:8px;">⚠️ Accurate weight & size help calculate shipping rates correctly.</p>
            </div>
            
            <!-- Images -->
            <label style="margin-top:12px; display:block;">Main Image (upload)</label>
            <input type="file" id="prodMainImg" accept="image/*" class="input" required>
            
            <label>Additional Images (optional, max 4)</label>
            <input type="file" id="prodImagesFiles" accept="image/*" multiple class="input">
            
            <textarea id="prodDesc" placeholder="Description" class="input" rows="2"></textarea>
            
            <!-- ⭐ PUBLISH BUTTON - type="button" -->
            <button id="publishBtn" type="button" class="btn-primary">📢 Publish</button>
        </div>
    </div>
    `;

    // Pending Orders HTML
    let ordersHtml = '';
    if (pendingOrders.length > 0) {
        ordersHtml += `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <h4 style="margin:0; color:#f59e0b;">🟡 Pending Orders</h4>
                <span style="background:#ef4444; color:white; border-radius:50%; padding:4px 12px; font-size:14px; font-weight:bold;">
                    ${pendingCount}
                </span>
            </div>
        `;

        ordersHtml += pendingOrders.map((o, index) => `
            <div class="order-card" style="border-left-color:#f59e0b; margin-bottom:15px; padding:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#f59e0b; color:white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:13px;">
                            ${index + 1}
                        </span>
                        ${o.productDetails?.image ? `<img src="${o.productDetails.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">` : ''}
                        <div>
                            <strong>${o.productDetails?.name || o.productName}</strong>
                            <br><span style="font-size:12px; color:#64748b;">Qty: ${o.qty} | Order: ${o.trackingNumber}</span>
                        </div>
                    </div>
                    <button class="viewOrderDetailBtn" data-id="${o.id}" style="background:#3b82f6; color:white; border:none; padding:6px 16px; border-radius:20px; cursor:pointer; font-weight:600;">
                        👁️ View Detail
                    </button>
                </div>
                
                <div id="orderDetail_${o.id}" style="display:none; margin-top:15px; padding:15px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                    <h4 style="margin:0 0 10px 0; color:#1e293b;">📋 Order Details</h4>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <div style="background:white; padding:12px; border-radius:8px;">
                            <h5 style="margin:0 0 8px 0; color:#3b82f6;">👤 Buyer Information</h5>
                            <div style="font-size:13px; color:#334155;">
                                <div><strong>Name:</strong> ${o.buyerName || 'N/A'}</div>
                                <div><strong>Phone:</strong> ${o.buyerPhone || 'N/A'}</div>
                                <div><strong>Email:</strong> ${o.buyerEmail || 'N/A'}</div>
                            </div>
                        </div>
                        <div style="background:white; padding:12px; border-radius:8px;">
                            <h5 style="margin:0 0 8px 0; color:#10b981;">📍 Shipping Address</h5>
                            <div style="font-size:13px; color:#334155;">
                                <div><strong>Address:</strong> ${o.address || 'N/A'}</div>
                                ${o.shippingCost ? `<div><strong>Shipping Cost:</strong> ${getCurrencySymbol()}${convertPrice(o.shippingCost)}</div>` : ''}
                            </div>
                        </div>
                        <div style="background:white; padding:12px; border-radius:8px; grid-column: 1/2;">
                            <h5 style="margin:0 0 8px 0; color:#8b5cf6;">📦 Product Details</h5>
                            <div style="font-size:13px; color:#334155;">
                                <div><strong>Product:</strong> ${o.productDetails?.name || o.productName}</div>
                                <div><strong>Category:</strong> ${o.productDetails?.category || 'N/A'}</div>
                                <div><strong>Quantity:</strong> ${o.qty}</div>
                                <div><strong>Base Price:</strong> ${getCurrencySymbol()}${convertPrice(o.basePrice || o.amount)}</div>
                                <div style="margin-top:5px; font-weight:bold; color:#10b981;">
                                    Total: ${getCurrencySymbol()}${convertPrice(o.amount || 0)}
                                </div>
                            </div>
                        </div>
                        <div style="background:white; padding:12px; border-radius:8px; grid-column: 2/3;">
                            <h5 style="margin:0 0 8px 0; color:#f59e0b;">⚡ Actions</h5>
                            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                                <button class="confirmStockBtn" data-id="${o.id}" style="background:#10b981; color:white; border:none; padding:8px 20px; border-radius:20px; cursor:pointer; font-weight:600;">
                                    ✅ Confirm Order
                                </button>
                                <button class="rejectOrderBtn" data-id="${o.id}" style="background:#dc2626; color:white; border:none; padding:8px 20px; border-radius:20px; cursor:pointer; font-weight:600;">
                                    ❌ Reject Order
                                </button>
                            </div>
                            <div style="margin-top:8px; font-size:11px; color:#94a3b8;">
                                Order Date: ${o.date || 'N/A'}
                            </div>
                            <div style="margin-top:4px; font-size:11px; color:#94a3b8;">
                                Status: <span style="font-weight:bold; color:#f59e0b;">${o.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    let completedOrders = myOrders.filter(o => o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Shipped');
    if (completedOrders.length > 0) {
        ordersHtml += `<h4 style="margin:15px 0; color:#10b981;">✅ Completed Orders (${completedOrders.length})</h4>`;
        ordersHtml += completedOrders.map(o => `
            <div class="order-card" style="border-left-color:#10b981;">
                <div style="display:flex; align-items:center; gap:10px; margin:8px 0;">
                    ${o.productDetails?.image ? `<img src="${o.productDetails.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">` : ''}
                    <div style="flex:1;">
                        <strong>${o.productDetails?.name || o.productName}</strong>
                        <br><span style="font-size:12px; color:#64748b;">Qty: ${o.qty} | Status: ${o.status}</span>
                        <br><span style="font-size:13px; font-weight:bold; color:#10b981;">Net Revenue: ${getCurrencySymbol()}${convertPrice((o.basePrice - (o.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * o.qty)}</span>
                    </div>
                </div>
                ${o.trackingInfo ? `<div style="font-size:12px; color:#64748b;">📮 Tracking: ${o.trackingInfo.trackingNumber || o.trackingInfo}</div>` : ''}
                <div style="font-size:10px; color:#94a3b8; margin-top:4px;">${o.date}</div>
            </div>
        `).join('');
    }

    if (myOrders.length === 0 && soldOutProducts.length === 0) {
        ordersHtml = '<p style="text-align:center;padding:20px;color:#64748b;">No orders or pending actions.</p>';
    }

    // Build full dashboard
    let sellerDashboardHtml = `
    <div class="premium-card">
        <div>
            <img src="${seller.avatar}" class="seller-avatar">
            <h3>${seller.shopName}</h3>
            <p>${seller.fullName}<br>📞 ${seller.phone}<br>📧 ${seller.email}<br>📍 ${seller.city}, ${seller.country}</p>
            <p style="font-size:12px; color:#64748b;">📍 Zone: ${getShippingZoneName(seller.shippingZone || 'ZONE_1_LOCAL')}</p>
        </div>
        <div><span class="kyc-status ${kycClass}">${kycText}</span></div>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin-top:12px;">
            <div style="background:#f1f5f9; padding:12px; border-radius:12px; text-align:center;">
                <div style="font-size:24px; font-weight:800; color:#1e3a8a;">${totalOrders}</div>
                <div style="font-size:12px; color:#64748b;">📦 Total Orders</div>
            </div>
            <div style="background:#f1f5f9; padding:12px; border-radius:12px; text-align:center;">
                <div style="font-size:24px; font-weight:800; color:#10b981;">${getCurrencySymbol()}${convertPrice(totalSales)}</div>
                <div style="font-size:12px; color:#64748b;">💰 Net Revenue</div>
            </div>
            <div style="background:#fef3c7; padding:12px; border-radius:12px; text-align:center;">
                <div style="font-size:24px; font-weight:800; color:#d97706;">${pendingOrders.length + soldOutProducts.length}</div>
                <div style="font-size:12px; color:#64748b;">⏳ Pending</div>
            </div>
        </div>
        <div style="margin-top:12px;">🏦 Balance: ${getCurrencySymbol()}${convertPrice(seller.earnings)}</div>
        <button id="withdrawBtn" class="btn-primary" style="background:#10b981;">💸 Withdraw</button>
    </div>
    <div class="chart-container"><h3>📊 Revenue</h3><canvas id="revenueChart"></canvas></div>
    <div class="premium-card"><h3>📈 Top Products</h3>${topList.map(p => `${p[0]}: ${p[1]} sold`).join('<br>') || 'No sales'}</div>
    ${addProductHtml}
    <div class="premium-card"><h3>📋 My Products (${myProducts.length})</h3><div id="myProductsList">${prodListHtml}</div></div>
    <div class="premium-card"><h3>📦 Orders & Actions</h3>${ordersHtml}</div>
    `;

    document.getElementById('sellerDashboard').innerHTML = sellerDashboardHtml;

    // Chart
    let ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (ctx) {
        if (sellerRevenueChart) sellerRevenueChart.destroy();
        sellerRevenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{ label: 'Revenue', data: chartData.map(v => parseFloat(convertPrice(v))), backgroundColor: '#3b82f6' }]
            }
        });
    }

    function getTimeRemaining(soldOutAt) {
        if (!soldOutAt) return 'N/A';
        const soldTime = new Date(soldOutAt).getTime();
        const expiryTime = soldTime + (12 * 60 * 60 * 1000);
        const now = Date.now();
        const remaining = expiryTime - now;
        if (remaining <= 0) return 'Expired';
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        return `${hours}h ${minutes}m`;
    }

    // Auto-delete
    if (window.autoDeleteInterval) clearInterval(window.autoDeleteInterval);
    window.autoDeleteInterval = setInterval(async function() {
        const now = Date.now();
        for (const p of products) {
            if (p.stock <= 0 && p.soldOutAt) {
                const soldTime = new Date(p.soldOutAt).getTime();
                const expiryTime = soldTime + (12 * 60 * 60 * 1000);
                if (now >= expiryTime) {
                    await db.collection('products').doc(p.id).delete();
                    console.log('🗑️ Auto-deleted:', p.name);
                }
            }
        }
        renderSellerDashboard();
        renderProducts();
        updateMyShopBadge();
    }, 60000);

    // Edit button
    document.querySelectorAll('.editProdBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const prod = products.find(p => p.id == productId);
            if (!prod) {
                showToast('Product not found!', true);
                return;
            }
            document.getElementById('editProdId').value = prod.id;
            document.getElementById('editProdName').value = prod.name || '';
            document.getElementById('editProdPrice').value = prod.price || '';
            document.getElementById('editProdCat').value = prod.category || '';
            document.getElementById('editProdStock').value = prod.stock || '';
            document.getElementById('editProdDesc').value = prod.description || '';
            if (prod.shippingRates) {
                document.getElementById('editShippingZone1').value = prod.shippingRates.ZONE_1_LOCAL || 0;
                document.getElementById('editShippingZone2').value = prod.shippingRates.ZONE_2_GCC || 0;
                document.getElementById('editShippingZone3').value = prod.shippingRates.ZONE_3_SOUTH_ASIA || 0;
                document.getElementById('editShippingZone4').value = prod.shippingRates.ZONE_4_ASIA || 0;
                document.getElementById('editShippingZone5').value = prod.shippingRates.ZONE_5_EUROPE || 0;
                document.getElementById('editShippingZone6').value = prod.shippingRates.ZONE_6_AMERICAS || 0;
                document.getElementById('editShippingZone7').value = prod.shippingRates.ZONE_7_REST_OF_WORLD || 0;
            }
            document.getElementById('editProductModal').style.display = 'block';
        });
    });

    // Update Product
    document.getElementById('updateProductBtn')?.addEventListener('click', async function() {
        const btn = this;
        btn.disabled = true;
        btn.textContent = '⏳ Updating...';
        try {
            let pid = document.getElementById('editProdId').value;
            if (!pid) {
                showToast('Product ID missing!', true);
                btn.disabled = false;
                btn.textContent = '💾 Update Product';
                return;
            }
            let prodRef = db.collection("products").doc(pid);
            let updates = {
                name: document.getElementById('editProdName').value.trim(),
                price: parseFloat(document.getElementById('editProdPrice').value),
                category: document.getElementById('editProdCat').value,
                stock: parseInt(document.getElementById('editProdStock').value),
                description: document.getElementById('editProdDesc').value.trim(),
                shippingRates: {
                    ZONE_1_LOCAL: parseFloat(document.getElementById('editShippingZone1').value) || 0,
                    ZONE_2_GCC: parseFloat(document.getElementById('editShippingZone2').value) || 0,
                    ZONE_3_SOUTH_ASIA: parseFloat(document.getElementById('editShippingZone3').value) || 0,
                    ZONE_4_ASIA: parseFloat(document.getElementById('editShippingZone4').value) || 0,
                    ZONE_5_EUROPE: parseFloat(document.getElementById('editShippingZone5').value) || 0,
                    ZONE_6_AMERICAS: parseFloat(document.getElementById('editShippingZone6').value) || 0,
                    ZONE_7_REST_OF_WORLD: parseFloat(document.getElementById('editShippingZone7').value) || 0
                },
                updatedAt: new Date().toISOString()
            };
            if (updates.stock > 0) {
                updates.status = 'available';
                updates.soldOutAt = null;
            }
            await prodRef.update(updates);
            showToast("✅ Product updated successfully!", false);
            document.getElementById('editProductModal').style.display = 'none';
            renderSellerDashboard();
            renderProducts();
            updateMyShopBadge();
            btn.disabled = false;
            btn.textContent = '💾 Update Product';
        } catch (error) {
            console.error("Update error:", error);
            showToast("Update failed: " + error.message, true);
            btn.disabled = false;
            btn.textContent = '💾 Update Product';
        }
    });

    // View Detail Button
    document.querySelectorAll('.viewOrderDetailBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.id;
            const detailDiv = document.getElementById(`orderDetail_${orderId}`);
            if (detailDiv) {
                if (detailDiv.style.display === 'none') {
                    detailDiv.style.display = 'block';
                    this.textContent = '🔽 Hide Detail';
                    this.style.background = '#64748b';
                } else {
                    detailDiv.style.display = 'none';
                    this.textContent = '👁️ View Detail';
                    this.style.background = '#3b82f6';
                }
            }
        });
    });

    // Confirm Order
    document.querySelectorAll('.confirmStockBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            confirmOrderStock(this.dataset.id);
        });
    });

    // Reject Order
    document.querySelectorAll('.rejectOrderBtn').forEach(btn => {
        btn.addEventListener('click', function() {
            rejectOrder(this.dataset.id);
        });
    });

    // Delete Product
    document.querySelectorAll('.delProd').forEach(btn => btn.addEventListener('click', async () => {
        let id = btn.dataset.id;
        await db.collection("products").doc(id).delete();
        renderSellerDashboard();
        renderProducts();
        showToast("Product deleted", false);
    }));

    document.getElementById('withdrawBtn')?.addEventListener('click', () => requestWithdrawal(seller.id));

    // ⭐ ATTACH PUBLISH LISTENER AFTER DASHBOARD RENDER
    setTimeout(attachPublishListener, 500);
}

// ============================================================
// ⭐ FIXED: PUBLISH BUTTON LISTENER
// ============================================================
function attachPublishListener() {
    const publishBtn = document.getElementById('publishBtn');
    if (!publishBtn) {
        console.log('⏳ Publish button not found, retrying...');
        setTimeout(attachPublishListener, 500);
        return;
    }

    console.log('✅ Publish button found! Attaching listener...');

    const newBtn = publishBtn.cloneNode(true);
    publishBtn.parentNode.replaceChild(newBtn, publishBtn);

    newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('🚀 Publish button clicked!');

        const btn = this;
        btn.disabled = true;
        btn.textContent = '⏳ Publishing...';

        try {
            if (!currentSeller?.sellerId) {
                showToast("❌ Please login as seller first!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish';
                return;
            }

            const name = document.getElementById('prodName')?.value?.trim();
            const price = parseFloat(document.getElementById('prodPrice')?.value);
            const category = document.getElementById('prodCat')?.value;
            const stock = parseInt(document.getElementById('prodStock')?.value);
            const description = document.getElementById('prodDesc')?.value?.trim();

            if (!name) { showToast("❌ Product name required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }
            if (!price || price <= 0) { showToast("❌ Valid price required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }
            if (!category) { showToast("❌ Select a category!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }
            if (!stock || stock <= 0) { showToast("❌ Valid stock required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }

            // Get zone-based shipping rates
            const shippingRates = {
                ZONE_1_LOCAL: parseFloat(document.getElementById('prodShippingZone1')?.value) || 0,
                ZONE_2_GCC: parseFloat(document.getElementById('prodShippingZone2')?.value) || 0,
                ZONE_3_SOUTH_ASIA: parseFloat(document.getElementById('prodShippingZone3')?.value) || 0,
                ZONE_4_ASIA: parseFloat(document.getElementById('prodShippingZone4')?.value) || 0,
                ZONE_5_EUROPE: parseFloat(document.getElementById('prodShippingZone5')?.value) || 0,
                ZONE_6_AMERICAS: parseFloat(document.getElementById('prodShippingZone6')?.value) || 0,
                ZONE_7_REST_OF_WORLD: parseFloat(document.getElementById('prodShippingZone7')?.value) || 0
            };

            const weight = parseFloat(document.getElementById('prodWeight')?.value);
            const length = parseInt(document.getElementById('prodLength')?.value);
            const width = parseInt(document.getElementById('prodWidth')?.value);
            const height = parseInt(document.getElementById('prodHeight')?.value);

            if (!weight || weight <= 0) { showToast("❌ Valid weight required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }
            if (!length || !width || !height) { showToast("❌ All dimensions required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }

            const mainImageFile = document.getElementById('prodMainImg')?.files[0];
            if (!mainImageFile) { showToast("❌ Main image required!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }

            showToast("📤 Uploading images...", false);

            const mainImageUrl = await uploadCompressedImage(mainImageFile);
            if (!mainImageUrl) { showToast("❌ Image upload failed!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish'; return; }

            const extraFiles = document.getElementById('prodImagesFiles')?.files || [];
            let imageUrls = [mainImageUrl];
            for (let i = 0; i < Math.min(extraFiles.length, 4); i++) {
                const url = await uploadCompressedImage(extraFiles[i]);
                if (url) imageUrls.push(url);
            }

            const calc = calculateDisplayPrice(price);
            const seller = sellers.find(s => s.id === currentSeller.sellerId);

            const productData = {
                sellerId: currentSeller.sellerId,
                sellerName: seller?.shopName || currentSeller.shopName || "GlobalBazaar",
                sellerCountry: seller?.country || "SA",
                name: name,
                price: price,
                category: category,
                mainImage: mainImageUrl,
                images: imageUrls,
                description: description || "No description",
                stock: stock,
                weight: weight,
                size: { length, width, height },
                shippingRates: shippingRates,
                publicPrice: calc.total,
                gatewayFee: calc.gateway,
                handlingFee: calc.handling,
                commission: price * 0.10,
                sellerEarning: price - (price * 0.10) - 1.50,
                platformRevenue: calc.gateway + (price * 0.10) + 1.50,
                status: 'available',
                createdAt: new Date().toISOString(),
                soldOutAt: null
            };

            await db.collection('products').add(productData);

            showToast("✅ Product published successfully!", false);
            addNotification(`📢 New product: ${name}`, 'info');
            await sendTelegramMessage(`📢 New Product: ${name}\n💰 Price: $${price}\n👤 Seller: ${seller?.shopName || 'GlobalBazaar'}`);

            const fields = ['prodName', 'prodPrice', 'prodStock', 'prodDesc', 'prodMainImg',
                'prodImagesFiles', 'prodShippingZone1', 'prodShippingZone2', 'prodShippingZone3',
                'prodShippingZone4', 'prodShippingZone5', 'prodShippingZone6', 'prodShippingZone7',
                'prodWeight', 'prodLength', 'prodWidth', 'prodHeight'
            ];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });

            renderSellerDashboard();
            renderProducts();
            updateMyShopBadge();

            btn.disabled = false;
            btn.textContent = '📢 Publish';

        } catch (error) {
            console.error('❌ Publish error:', error);
            showToast("❌ Failed: " + error.message, true);
            btn.disabled = false;
            btn.textContent = '📢 Publish';
        }
    });
}

// ============================================================
// ⭐ FIXED: FETCH SHIPPING WITH ZONE DISPLAY
// ============================================================
async function fetchAndDisplayShippingRates() {
    if (Date.now() - lastShippingFetch < 3000) return;
    lastShippingFetch = Date.now();

    const shippingContainer = document.getElementById('shippingCostContainer');
    const shippingDisplay = document.getElementById('shippingCostDisplay');
    const shippingZoneDisplay = document.getElementById('shippingZoneDisplay');
    const payBtn = document.getElementById('payNowBtn');

    if (shippingContainer) shippingContainer.style.display = 'flex';
    if (shippingDisplay) {
        shippingDisplay.textContent = 'Checking availability...';
        shippingDisplay.className = 'cost shipping-loading';
    }
    if (shippingZoneDisplay) {
        shippingZoneDisplay.textContent = 'Detecting your zone...';
        shippingZoneDisplay.className = 'zone-info';
    }
    if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = '⏳ Checking Shipping...';
    }

    try {
        const firstCartItem = cart[0];
        if (!firstCartItem) {
            if (shippingDisplay) {
                shippingDisplay.textContent = 'No items in cart';
                shippingDisplay.className = 'cost error';
            }
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.textContent = '⏳ Waiting for items...';
            }
            return;
        }

        const product = products.find(p => p.id === firstCartItem.id);
        if (!product) {
            if (shippingDisplay) {
                shippingDisplay.textContent = 'Product not found';
                shippingDisplay.className = 'cost error';
            }
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.textContent = '⏳ Product not found';
            }
            return;
        }

        const buyerCountrySelect = document.getElementById('deliveryCountry');
        let buyerCountry = 'Saudi Arabia';
        if (buyerCountrySelect) {
            const selectedOption = buyerCountrySelect.options[buyerCountrySelect.selectedIndex];
            if (selectedOption) {
                buyerCountry = selectedOption.text || selectedOption.value || 'Saudi Arabia';
            } else {
                buyerCountry = buyerCountrySelect.value || 'Saudi Arabia';
            }
        }
        buyerCountry = buyerCountry.trim();

        if (!buyerCountry || buyerCountry === '') {
            if (shippingDisplay) {
                shippingDisplay.textContent = 'Select country first';
                shippingDisplay.className = 'cost error';
            }
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.textContent = '⏳ Select country';
            }
            return;
        }

        const shippingInfo = await getShippingRateByZone(product.id, buyerCountry);

        if (shippingInfo && shippingInfo.rate > 0 && isFinite(shippingInfo.rate)) {
            currentShippingCost = shippingInfo.rate;
            sessionStorage.setItem('shipping_cost', currentShippingCost.toString());
            sessionStorage.setItem('shipping_zone', shippingInfo.zone);
            sessionStorage.setItem('shipping_zone_name', shippingInfo.zoneName);
            sessionStorage.setItem('shipping_country', buyerCountry);

            if (shippingDisplay) {
                shippingDisplay.textContent = `${getCurrencySymbol()}${convertPrice(currentShippingCost)}`;
                shippingDisplay.className = 'cost';
                shippingDisplay.title = `Zone: ${shippingInfo.zoneName}`;
            }

            if (shippingZoneDisplay) {
                shippingZoneDisplay.textContent = `📍 ${shippingInfo.zoneName}`;
                shippingZoneDisplay.className = 'zone-info';
                shippingZoneDisplay.style.color = '#10b981';
                shippingZoneDisplay.style.fontWeight = 'bold';
            }

            if (payBtn) {
                payBtn.disabled = false;
                payBtn.textContent = '💳 Pay with Card';
            }
            showToast(`✅ Shipping: ${getCurrencySymbol()}${convertPrice(currentShippingCost)} (${shippingInfo.zoneName})`, false);
        } else {
            currentShippingCost = 0;
            sessionStorage.setItem('shipping_cost', '0');
            sessionStorage.setItem('shipping_zone', 'unavailable');

            if (shippingDisplay) {
                shippingDisplay.textContent = '🚫 Shipping not available for this region';
                shippingDisplay.className = 'cost error';
            }
            if (shippingZoneDisplay) {
                shippingZoneDisplay.textContent = '❌ Shipping not available';
                shippingZoneDisplay.className = 'zone-info';
                shippingZoneDisplay.style.color = '#dc2626';
            }
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.textContent = '⏳ Shipping unavailable';
            }
            showToast('⚠️ Shipping not available for this region', true);
        }
    } catch (error) {
        console.error('Shipping fetch error:', error);
        currentShippingCost = 0;
        sessionStorage.setItem('shipping_cost', '0');
        if (shippingDisplay) {
            shippingDisplay.textContent = '⚠️ Error fetching shipping';
            shippingDisplay.className = 'cost error';
        }
        if (payBtn) {
            payBtn.disabled = true;
            payBtn.textContent = '⏳ Error';
        }
        showToast('⚠️ Error fetching shipping rates', true);
    }
}

// ============================================================
// ⭐ UPDATE MY SHOP BADGE
// ============================================================
function updateMyShopBadge() {
    const btn = document.getElementById('drawerMyShop');
    if (!btn) return;

    let badge = btn.querySelector('.badge');
    if (!badge) {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.cssText = 'background:#ef4444; color:white; border-radius:50%; padding:2px 8px; font-size:11px; margin-left:8px; display:none;';
        btn.appendChild(span);
        badge = span;
    }

    if (currentSeller?.sellerId) {
        const pendingOrders = orders.filter(o =>
            o.sellerId === currentSeller.sellerId &&
            o.status === 'Processing'
        ).length;

        if (pendingOrders > 0) {
            badge.textContent = pendingOrders;
            badge.style.display = 'inline-block';
            badge.style.background = '#ef4444';
        } else {
            badge.style.display = 'none';
        }
    } else {
        badge.style.display = 'none';
    }
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================
function updateAdminPendingBadge() {
    const pendingSellers = sellers.filter(s => s.kycStatus === 'pending');
    const count = pendingSellers.length;
    const badge = document.getElementById('adminPendingBadge');
    if (badge) {
        badge.style.display = count > 0 ? 'inline-block' : 'none';
        badge.innerText = count;
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
// RENDER PRODUCTS
// ============================================================
let currentCategory = "All";

function renderProductCard(p) {
    const seller = sellers.find(s => s.id === p.sellerId) || { shopName: "GlobalBazaar", country: "SA" };
    const displayPrice = calculateDisplayPrice(p.price);
    const isSoldOut = p.stock <= 0;

    const soldOutBadge = isSoldOut ? `<div class="soldout-badge">🔴 SOLD OUT</div>` : '';
    const stockBadge = (!isSoldOut && p.stock < 5 && p.stock > 0) ? `<div class="stock-badge">Only ${p.stock} left</div>` : '';

    let thumbnailsHtml = '';
    if (p.images && p.images.length > 1) {
        thumbnailsHtml = p.images.slice(0, 4).map(img =>
            `<img src="${img}" onclick="event.stopPropagation(); changeProductImage('${p.id}','${img}')">`
        ).join('');
    }

    return `<div class="product-card" data-id="${p.id}">
        ${soldOutBadge}
        ${stockBadge}
        <div class="image-wrapper">
            <img class="main-img" src="${p.mainImage}" id="mainImg_${p.id}">
            <div class="product-thumbnails">${thumbnailsHtml}</div>
        </div>
        <div class="seller-name-tag">🏪 ${seller.shopName}</div>
        <h4 style="font-size:13px; margin:2px 0;">${p.name}</h4>
        <div class="prod-price">${getCurrencySymbol()}${convertPrice(displayPrice.total)}</div>
        <div class="card-actions">
            <button class="btn-sm btn-buy addCartBtn" data-id="${p.id}" ${isSoldOut ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                ${isSoldOut ? '🚫 Sold Out' : '🛒 Buy'}
            </button>
        </div>
    </div>`;
}

function renderCats() {
    let cats = ["All", ...new Set(products.map(p => p.category))];
    document.getElementById('catList').innerHTML = cats.map(c =>
        `<div class="cat-pill ${currentCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`
    ).join('');
    document.querySelectorAll('.cat-pill').forEach(el => el.addEventListener('click', (e) => {
        currentCategory = e.target.dataset.cat;
        renderCats();
        renderProducts();
    }));
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    let search = document.getElementById('searchInput')?.value.toLowerCase() || "";

    let filtered = products.filter(p =>
        (currentCategory === "All" || p.category === currentCategory) &&
        p.name.toLowerCase().includes(search) &&
        p.stock > 0
    );

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:40px;grid-column:1/-1;">No products found</div>';
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
    grid.innerHTML = html;
    document.querySelectorAll('.addCartBtn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation();
        addToCart(btn.dataset.id); }));
    document.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', () => openProduct(card.dataset.id)));
    renderBuyerOrders();
    renderBuyerWishlist();
}

function changeProductImage(pid, url) {
    let modalImg = document.getElementById('mainImg_' + pid);
    if (modalImg) {
        modalImg.src = url;
        document.querySelectorAll('.product-thumbnails img').forEach(img => {
            img.classList.toggle('active', img.src === url);
        });
    }
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function addToCart(id) {
    let p = products.find(x => x.id == id);
    if (!p) return;
    if (p.stock <= 0) {
        showToast("This product is sold out!", true);
        return;
    }
    let existing = cart.find(i => i.id == id);
    if (existing) {
        if (existing.qty < p.stock) existing.qty++;
        else { showToast(`Only ${p.stock} in stock`, true); return; }
    } else {
        cart.push({ id: p.id, name: p.name, price: p.price, sellerId: p.sellerId, sellerCountry: p.sellerCountry || "SA", qty: 1, image: p.mainImage });
    }
    saveAllLocal();
    updateCartUI();
    renderCartPage();
    showToast("Added to cart", false);
    addNotification(`${p.name} added to cart`, 'info');
    if (currentBuyer) saveUserCart(currentBuyer.uid);
}

function updateCartUI() {
    document.getElementById('cartCountBadge').innerText = cart.reduce((a, b) => a + b.qty, 0);
}

function renderCartPage() {
    if (cart.length === 0) {
        document.getElementById('cartItemsList').innerHTML = '<p style="text-align:center;padding:40px;">Cart empty</p>';
        document.getElementById('cartTotalAmount').innerHTML = `${getCurrencySymbol()}0.00`;
        return;
    }
    let totalUSD = 0;
    const shipping = currentShippingCost > 0 ? currentShippingCost : 0;
    let html = cart.map((item, idx) => {
        let seller = sellers.find(s => s.id == item.sellerId) || { country: "SA" };
        let final = calculateFinalPrice(item.price, seller.country, buyerCountry, shipping / cart.length);
        let itemTotal = final.total * item.qty;
        totalUSD += itemTotal;
        return `<div class="cart-item"><div><strong>${item.name}</strong><br>${getCurrencySymbol()}${convertPrice(final.total)} each</div><div class="cart-item-controls"><button class="cart-qty-btn" data-idx="${idx}" data-dir="dec">-</button><span>${item.qty}</span><button class="cart-qty-btn" data-idx="${idx}" data-dir="inc">+</button><button class="cart-remove" data-idx="${idx}">Remove</button></div></div>`;
    }).join('');
    document.getElementById('cartItemsList').innerHTML = html;
    document.getElementById('cartTotalAmount').innerHTML = `${getCurrencySymbol()}${convertPrice(totalUSD)}`;
    document.querySelectorAll('.cart-qty-btn').forEach(btn => btn.addEventListener('click', () => {
        let idx = parseInt(btn.dataset.idx);
        if (btn.dataset.dir === 'inc') {
            let prod = products.find(p => p.id == cart[idx].id);
            if (cart[idx].qty < prod.stock) cart[idx].qty++;
            else showToast(`Only ${prod.stock} in stock`, true);
        } else if (btn.dataset.dir === 'dec' && cart[idx].qty > 1) cart[idx].qty--;
        else if (btn.dataset.dir === 'dec' && cart[idx].qty === 1) cart.splice(idx, 1);
        saveAllLocal();
        updateCartUI();
        renderCartPage();
        renderProducts();
        if (currentBuyer) saveUserCart(currentBuyer.uid);
    }));
    document.querySelectorAll('.cart-remove').forEach(btn => btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.idx), 1);
        saveAllLocal();
        updateCartUI();
        renderCartPage();
        renderProducts();
        if (currentBuyer) saveUserCart(currentBuyer.uid);
    }));
}

function calculateFinalPrice(basePrice, sellerCountry, buyerCountry, shippingCost = 0) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let commission = basePrice * PLATFORM_COMMISSION;
    let total = basePrice + gatewayFee + MAINTENANCE_FEE + shippingCost + commission;
    return { total, basePrice, shipping: shippingCost, commission, gateway: gatewayFee, handling: MAINTENANCE_FEE, sellerEarning: basePrice - commission - MAINTENANCE_FEE };
}

function saveAllLocal() {
    localStorage.setItem('gb_cart', JSON.stringify(cart));
    localStorage.setItem('gb_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('gb_orders', JSON.stringify(orders));
    localStorage.setItem('gb_platform_earnings', JSON.stringify(platformEarnings));
    localStorage.setItem('gb_pending_withdrawals', JSON.stringify(pendingWithdrawals));
    localStorage.setItem('gb_saved_cards', JSON.stringify(savedCards));
    localStorage.setItem('gb_saved_addresses', JSON.stringify(savedAddresses));
    localStorage.setItem('gb_notifications', JSON.stringify(notifications));
    if (currentSeller) localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
}

// ============================================================
// ORDER FUNCTIONS
// ============================================================
function confirmOrderStock(orderId) {
    let order = orders.find(o => o.id == orderId);
    if (!order) {
        showToast("Order not found!", true);
        return;
    }
    try {
        order.status = "Completed";
        order.confirmedAt = new Date().toISOString();
        let netRevenue = (order.basePrice - (order.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * order.qty;
        let seller = sellers.find(s => s.id === order.sellerId);
        if (seller) {
            seller.earnings = (seller.earnings || 0) + netRevenue;
            db.collection("sellers").doc(seller.id).update({ earnings: seller.earnings, totalSales: (seller.totalSales || 0) + order.qty });
        }
        saveAllLocal();
        showToast(`✅ Order ${order.trackingNumber} confirmed! Net Revenue: ${getCurrencySymbol()}${convertPrice(netRevenue)}`, false);
        addNotification(`Order ${order.trackingNumber} confirmed by seller`, 'order');
        sendTelegramMessage(`✅ Order ${order.trackingNumber} confirmed by seller. Net Revenue: $${netRevenue.toFixed(2)}`);
        renderSellerDashboard();
        renderBuyerOrders();
        updateMyShopBadge();
    } catch (error) {
        console.error('Confirm order error:', error);
        showToast('Failed to confirm order: ' + error.message, true);
    }
}

function rejectOrder(orderId) {
    if (!confirm('⚠️ Are you sure you want to reject this order?')) return;
    let order = orders.find(o => o.id == orderId);
    if (!order) {
        showToast("Order not found!", true);
        return;
    }
    try {
        order.status = "Rejected";
        order.rejectedAt = new Date().toISOString();
        let product = products.find(p => p.id === order.productDetails?.id || p.name === order.productName);
        if (product) {
            product.stock += order.qty;
            db.collection('products').doc(product.id).update({ stock: product.stock });
        }
        saveAllLocal();
        showToast(`❌ Order ${order.trackingNumber} rejected!`, false);
        addNotification(`Order ${order.trackingNumber} rejected by seller`, 'order');
        sendTelegramMessage(`❌ Order ${order.trackingNumber} rejected by seller.`);
        renderSellerDashboard();
        renderBuyerOrders();
        renderProducts();
        updateMyShopBadge();
    } catch (error) {
        console.error('Reject order error:', error);
        showToast('Failed to reject order: ' + error.message, true);
    }
}

function renderBuyerOrders() {
    const user = auth.currentUser;
    if (!user) return;
    let myOrders = orders.filter(o => o.buyerEmail === user.email);
    document.getElementById('buyerOrdersList').innerHTML = myOrders.map(o =>
        `<div class="order-card"><strong>🔖 ${o.trackingNumber}</strong><br>${o.productName} x${o.qty}<br>${getCurrencySymbol()}${convertPrice(o.amount)}<br>Status: ${o.status}<br>${renderTrackingMap(o)}${o.trackingInfo ? `<br>📮 Tracking: ${o.trackingInfo.trackingNumber || o.trackingInfo}` : ''}<br>${o.status === "Shipped" ? `<button class="confirmReceivedBtn" data-id="${o.id}" style="background:#10b981;">✅ Received</button>` : ''}${o.status === "Processing" ? `<button class="cancelOrderBtn" data-id="${o.id}" style="background:#dc2626;">❌ Cancel Order</button>` : ''}</div>`
    ).join('');
    document.querySelectorAll('.confirmReceivedBtn').forEach(btn => btn.addEventListener('click', () => confirmOrderReceived(parseFloat(btn.dataset.id))));
    document.querySelectorAll('.cancelOrderBtn').forEach(btn => btn.addEventListener('click', () => cancelOrder(parseFloat(btn.dataset.id))));
}

function confirmOrderReceived(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (order && order.status === "Shipped") {
        order.status = "Delivered";
        saveAllLocal();
        showToast("Order marked Delivered", false);
        renderBuyerOrders();
        addNotification(`Order ${order.trackingNumber} delivered`, 'order');
        setTimeout(() => {
            let ord = orders.find(o => o.id === orderId);
            if (ord && ord.status === "Delivered") {
                ord.status = "Completed";
                let seller = sellers.find(s => s.id == ord.sellerId);
                if (seller) {
                    let sellerEarning = ord.basePrice - ord.commission - MAINTENANCE_FEE;
                    seller.earnings = (seller.earnings || 0) + (sellerEarning * ord.qty);
                    saveAllLocal();
                    showToast(`Payment released to seller`, false);
                    if (currentSeller) renderSellerDashboard();
                }
            }
        }, 5000);
    } else showToast("Order not shipped yet", true);
}

function cancelOrder(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (order && order.status === "Processing") {
        let prod = products.find(p => p.name === order.productName && p.sellerId === order.sellerId);
        if (prod) { prod.stock += order.qty;
            saveAllLocal(); }
        order.status = "Cancelled";
        saveAllLocal();
        showToast("Order cancelled successfully", false);
        renderBuyerOrders();
        renderProducts();
        addNotification(`Order ${order.trackingNumber} cancelled`, 'order');
        if (currentSeller) renderSellerDashboard();
    } else { showToast("Only orders in 'Processing' status can be cancelled", true); }
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

function renderBuyerWishlist() {
    let w = products.filter(p => wishlist.includes(p.id));
    document.getElementById('buyerWishlistList').innerHTML = w.map(p =>
        `<div class="order-card"><strong>${p.name}</strong><br>Price: ${getCurrencySymbol()}${convertPrice(p.price)}<br><button class="removeWishlistBtn" data-id="${p.id}" style="background:#dc2626;">Remove</button></div>`
    ).join('');
    document.querySelectorAll('.removeWishlistBtn').forEach(btn => btn.addEventListener('click', () => {
        wishlist = wishlist.filter(id => id != btn.dataset.id);
        saveAllLocal();
        renderProducts();
        renderBuyerWishlist();
        showToast("Removed", false);
    }));
}

// ============================================================
// WITHDRAWAL FUNCTIONS
// ============================================================
function requestWithdrawal(sellerId) {
    let seller = sellers.find(s => s.id == sellerId);
    if (seller && seller.earnings > 0) {
        let newWithdrawal = { id: Date.now(), sellerId: seller.id, sellerName: seller.shopName, amount: seller.earnings, date: new Date().toLocaleString(), status: "Pending" };
        pendingWithdrawals.push(newWithdrawal);
        seller.earnings = 0;
        saveAllLocal();
        showToast("Withdrawal request submitted", false);
        renderSellerDashboard();
        sendTelegramMessage(`💰 Withdrawal Request: ${seller.shopName} - ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`);
        addNotification(`Withdrawal request for ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`, 'payment');
    } else showToast("No balance", true);
}

// ============================================================
// CHECKOUT & PAYMENT
// ============================================================
let currentDelivery = null;

document.getElementById('proceedToCheckoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) { showToast("Cart empty", true); return; }
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
    if (savedAddr) {
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
        let addr = { email: user.email, fullName: fn, phone: ph, country: c, city: ci, postcode: pc, street: st, houseNo: document.getElementById('deliveryHouseNo').value, state: document.getElementById('deliveryState')?.value || '' };
        if (idx >= 0) savedAddresses[idx] = addr;
        else savedAddresses.push(addr);
        saveAllLocal();
    }
    showToast("Checking shipping availability...", false);
    await fetchAndDisplayShippingRates();
    setTimeout(() => { showSection('payment');
        loadSavedCards(); }, 1000);
});

function loadSavedCards() {
    let userCards = savedCards.filter(c => c.userEmail === "guest@globalbazaar.com");
    if (userCards.length > 0) {
        document.getElementById('savedCardsSection').style.display = 'block';
        document.getElementById('savedCardsList').innerHTML = userCards.map((card, idx) =>
            `<div class="flex-between"><span>💳 ****${card.cardNumber.slice(-4)} - ${card.cardHolderName}</span><button class="useSavedCardBtn" data-idx="${idx}">Use</button></div>`
        ).join('');
        document.querySelectorAll('.useSavedCardBtn').forEach(btn => btn.addEventListener('click', () => {
            let card = userCards[parseInt(btn.dataset.idx)];
            document.getElementById('cardNumber').value = card.cardNumber;
            document.getElementById('cardHolderName').value = card.cardHolderName;
            document.getElementById('expiryDate').value = card.expiryDate;
            document.getElementById('cvv').value = '';
            showToast("Card loaded", false);
        }));
    }
}

document.getElementById('payNowBtn')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';
    try {
        let cardNum = document.getElementById('cardNumber')?.value?.replace(/\s/g, '') || '';
        let cardName = document.getElementById('cardHolderName')?.value || '';
        let expiry = document.getElementById('expiryDate')?.value || '';
        let cvv = document.getElementById('cvv')?.value || '';
        if (!cardNum || !cardName || !expiry || !cvv) { showToast("❌ Please fill all card details", true);
            btn.disabled = false;
            btn.textContent = '💳 Pay with Card'; return; }
        if (cardNum.length < 15) { showToast("❌ Invalid card number", true);
            btn.disabled = false;
            btn.textContent = '💳 Pay with Card'; return; }
        if (cvv.length < 3) { showToast("❌ Invalid CVV", true);
            btn.disabled = false;
            btn.textContent = '💳 Pay with Card'; return; }
        let shippingCost = parseFloat(sessionStorage.getItem('shipping_cost') || '0');
        if (isNaN(shippingCost) || !isFinite(shippingCost) || shippingCost <= 0) {
            const firstItem = cart[0];
            if (firstItem) {
                const product = products.find(p => p.id === firstItem.id);
                if (product) {
                    const buyerCountrySelect = document.getElementById('deliveryCountry');
                    let buyerCountry = 'Saudi Arabia';
                    if (buyerCountrySelect) {
                        const selectedOption = buyerCountrySelect.options[buyerCountrySelect.selectedIndex];
                        if (selectedOption) {
                            buyerCountry = selectedOption.text || selectedOption.value || 'Saudi Arabia';
                        }
                    }
                    const shippingInfo = await getShippingRateByZone(product.id, buyerCountry);
                    if (shippingInfo && shippingInfo.rate > 0 && isFinite(shippingInfo.rate)) {
                        shippingCost = shippingInfo.rate;
                        sessionStorage.setItem('shipping_cost', shippingCost.toString());
                    } else { shippingCost = 0; }
                }
            }
        }
        if (shippingCost <= 0 || !isFinite(shippingCost)) { showToast('⚠️ Shipping not available for this region', true);
            btn.disabled = false;
            btn.textContent = '💳 Pay with Card'; return; }
        if (!currentDelivery || !currentDelivery.email) { showToast('⚠️ Delivery details missing.', true);
            btn.disabled = false;
            btn.textContent = '💳 Pay with Card'; return; }
        if (document.getElementById('saveCardCheckbox')?.checked) {
            let existing = savedCards.findIndex(c => c.userEmail === "guest@globalbazaar.com" && c.cardNumber === cardNum);
            let cardData = { userEmail: "guest@globalbazaar.com", cardNumber: cardNum, cardHolderName: cardName, expiryDate: expiry };
            if (existing >= 0) savedCards[existing] = cardData;
            else savedCards.push(cardData);
            saveAllLocal();
        }
        let totalUSD = 0;
        const cartLength = cart.length;
        for (let item of cart) {
            let seller = sellers.find(s => s.id === item.sellerId);
            const shippingPerItem = cartLength > 0 ? shippingCost / cartLength : 0;
            let final = calculateFinalPrice(item.price, seller?.country || "SA", buyerCountry, shippingPerItem);
            totalUSD += final.total * item.qty;
        }
        let tracking = "GB" + Date.now();
        let cartCopy = [...cart];
        const totalWithShipping = totalUSD;
        for (let item of cart) {
            let seller = sellers.find(s => s.id === item.sellerId);
            let product = products.find(p => p.id === item.id);
            const shippingPerItem = cartLength > 0 ? shippingCost / cartLength : 0;
            let priceCalc = calculateDynamicPrice(item.price, shippingPerItem);
            let newOrder = {
                id: Date.now() + Math.random(),
                trackingNumber: tracking,
                sellerId: item.sellerId,
                sellerName: seller?.shopName || "GlobalBazaar",
                buyerEmail: currentDelivery.email,
                buyerName: currentDelivery.fullName,
                buyerPhone: currentDelivery.phone,
                address: currentDelivery.fullAddress,
                productDetails: { id: item.id, name: item.name, price: item.price, image: item.image, category: product?.category || '', sellerId: item.sellerId, sellerName: seller?.shopName || "GlobalBazaar" },
                productName: item.name,
                amount: totalWithShipping / cartLength,
                basePrice: item.price,
                date: new Date().toLocaleString(),
                status: "Processing",
                qty: item.qty,
                priceBreakdown: { basePrice: item.price, gatewayFee: priceCalc.gatewayFee, maintenanceFee: priceCalc.maintenanceFee, shippingCost: priceCalc.shippingCost, grandTotal: priceCalc.grandTotal },
                shippingCost: priceCalc.shippingCost,
                commission: item.price * PLATFORM_COMMISSION,
                gatewayFee: priceCalc.gatewayFee,
                handlingFee: MAINTENANCE_FEE,
                trackingInfo: null,
                shippingCharge: shippingPerItem
            };
            orders.push(newOrder);
            platformEarnings += (item.price * PLATFORM_COMMISSION) + priceCalc.gatewayFee + MAINTENANCE_FEE;
            if (product) {
                product.stock -= item.qty;
                if (product.stock <= 0) {
                    product.status = 'pending_approval';
                    await db.collection('products').doc(product.id).update({ stock: 0, status: 'pending_approval', soldOutAt: new Date().toISOString() });
                    addNotification(`📢 ${product.name} is SOLD OUT! Waiting for seller.`, 'info');
                    sendTelegramMessage(`📢 ${product.name} is SOLD OUT! Waiting for seller.`);
                } else {
                    await db.collection('products').doc(product.id).update({ stock: product.stock });
                }
            }
        }
        saveAllLocal();
        await sendTelegramMessage(`🛍️ NEW ORDER!\nOrder: ${tracking}\nCustomer: ${currentDelivery.fullName}\nAmount: ${getCurrencySymbol()}${convertPrice(totalWithShipping)}`);
        addNotification(`Order placed! #${tracking}`, 'order');
        cart = [];
        saveAllLocal();
        updateCartUI();
        if (currentBuyer) await saveUserCart(currentBuyer.uid);
        let last4 = cardNum.slice(-4);
        let breakdownHtml = cartCopy.map(i => {
            const shippingPerItem = cartCopy.length > 0 ? shippingCost / cartCopy.length : 0;
            let calc = calculateDynamicPrice(i.price, shippingPerItem);
            return `<div style="background:#f8fafc; padding:12px; border-radius:12px; margin-bottom:10px;">
                <strong>${i.name}</strong> x${i.qty}
                <div style="font-size:12px; color:#64748b; margin-top:5px;">
                    Base: ${getCurrencySymbol()}${convertPrice(i.price)}<br>
                    + Gateway (3%): ${getCurrencySymbol()}${convertPrice(calc.gatewayFee)}<br>
                    + Maintenance: ${getCurrencySymbol()}${convertPrice(calc.maintenanceFee)}<br>
                    + Shipping: ${getCurrencySymbol()}${convertPrice(calc.shippingCost)}<br>
                    <strong>= ${getCurrencySymbol()}${convertPrice(calc.grandTotal)}</strong>
                </div>
            </div>`;
        }).join('');
        const summaryContent = document.getElementById('orderSummaryContent');
        if (summaryContent) {
            summaryContent.innerHTML = `
                <p><strong>Order ID:</strong> ${tracking}</p>
                <h3>📦 Items</h3>
                ${breakdownHtml}
                <h3>💰 Total Paid: ${getCurrencySymbol()}${convertPrice(totalWithShipping)}</h3>
                <h3>📦 Shipping Cost: ${getCurrencySymbol()}${convertPrice(shippingCost)}</h3>
                <h3>👤 Delivery Details</h3>
                <p>${currentDelivery.fullName}<br>${currentDelivery.phone}<br>${currentDelivery.fullAddress}</p>
                <h3>💳 Payment</h3>
                <p>Card ending: ${last4}</p>
                <p>🔮 We'll notify you when your order ships.</p>
            `;
        }
        document.getElementById('orderSummaryModal').style.display = 'block';
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardHolderName').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';
        currentDelivery = null;
        renderProducts();
        btn.disabled = false;
        btn.textContent = '💳 Pay with Card';
    } catch (error) {
        console.error('Payment error:', error);
        showToast('❌ Payment failed: ' + (error.message || 'Unknown error'), true);
        btn.disabled = false;
        btn.textContent = '💳 Pay with Card';
    }
});

async function saveUserCart(userId) {
    if (!userId) return;
    await db.collection('carts').doc(userId).set({ items: cart, updatedAt: new Date().toISOString() });
}

// ============================================================
// SECTION NAVIGATION
// ============================================================
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + "Section").classList.add('active');
}

function showMyOrdersPage() {
    const user = auth.currentUser;
    if (!user) { showToast("Please login to view your orders", true);
        document.getElementById('loginModal').style.display = 'block'; return; }
    renderBuyerOrders();
    showSection('profile');
}

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    renderCats();
    updateCartUI();
    updateNotificationUI();
    updateAdminPendingBadge();
    updateAdminMenuBadges();
    updateMyShopBadge();
    updateCategorySelect();
    setTimeout(attachPublishListener, 1000);
});

// Auto-delete interval
setInterval(async function() {
    const now = Date.now();
    for (const p of products) {
        if (p.stock <= 0 && p.soldOutAt) {
            const soldTime = new Date(p.soldOutAt).getTime();
            const expiryTime = soldTime + (12 * 60 * 60 * 1000);
            if (now >= expiryTime) {
                await db.collection('products').doc(p.id).delete();
                console.log('🗑️ Auto-deleted:', p.name);
                addNotification(`Product "${p.name}" auto-deleted after 12 hours`, 'info');
            }
        }
    }
    renderSellerDashboard();
    renderProducts();
    updateMyShopBadge();
}, 60000);

// ============================================================
// END OF FILE - COMPLETE FIXED CODE
// ============================================================
