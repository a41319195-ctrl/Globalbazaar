// ============================================================
// GLOBAL ERROR HANDLING
// ============================================================
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global Error:', message, source, lineno, colno, error);
    showToast('⚠️ Something went wrong. Please try again.', true);
    document.getElementById('debugMsg').innerText = 'Error: ' + message;
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
// EASYSHIP API
// ============================================================
const EASYSHIP_API_KEY = 'prod_FCky2t1qk8dLSqRk6O8a62kUklUmcQuxmzLDmq+mhCI=';
const EASYSHIP_MODE = 'sandbox';
const EASYSHIP_BASE_URL = EASYSHIP_MODE === 'sandbox' 
    ? 'https://api.sandbox.easyship.com/2024-09' 
    : 'https://api.easyship.com/2024-09';

async function getEasyshipRates(sellerAddress, buyerAddress, parcelDetails) {
    try {
        const response = await fetch(`${EASYSHIP_BASE_URL}/rates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${EASYSHIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin_address: {
                    country_alpha2: sellerAddress.country || 'SA',
                    postal_code: sellerAddress.postal_code || '',
                    city: sellerAddress.city || '',
                    state: sellerAddress.state || '',
                    line1: sellerAddress.line1 || ''
                },
                destination_address: {
                    country_alpha2: buyerAddress.country || 'US',
                    postal_code: buyerAddress.postal_code || '',
                    city: buyerAddress.city || '',
                    state: buyerAddress.state || '',
                    line1: buyerAddress.line1 || ''
                },
                parcels: [{
                    weight: parcelDetails.weight || 1,
                    dimensions: {
                        length: parcelDetails.length || 10,
                        width: parcelDetails.width || 10,
                        height: parcelDetails.height || 10
                    }
                }],
                currency: 'USD'
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.rates || [];
    } catch (error) {
        console.error('Easyship rates error:', error);
        return [];
    }
}

async function createEasyshipShipment(orderData, sellerAddress, buyerAddress, parcelDetails) {
    try {
        const response = await fetch(`${EASYSHIP_BASE_URL}/shipments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${EASYSHIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shipment: {
                    origin_address: {
                        country_alpha2: sellerAddress.country || 'SA',
                        postal_code: sellerAddress.postal_code || '',
                        city: sellerAddress.city || '',
                        state: sellerAddress.state || '',
                        line1: sellerAddress.line1 || ''
                    },
                    destination_address: {
                        country_alpha2: buyerAddress.country || 'US',
                        postal_code: buyerAddress.postal_code || '',
                        city: buyerAddress.city || '',
                        state: buyerAddress.state || '',
                        line1: buyerAddress.line1 || ''
                    },
                    parcels: [{
                        weight: parcelDetails.weight || 1,
                        dimensions: {
                            length: parcelDetails.length || 10,
                            width: parcelDetails.width || 10,
                            height: parcelDetails.height || 10
                        }
                    }],
                    selected_rate_id: orderData.selected_rate_id || null,
                    order_data: {
                        order_id: orderData.order_id || 'GB_' + Date.now()
                    }
                }
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Easyship shipment error:', error);
        return null;
    }
}

async function buyEasyshipLabel(shipmentId, rateId) {
    try {
        const response = await fetch(`${EASYSHIP_BASE_URL}/shipments/${shipmentId}/buy-label`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${EASYSHIP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selected_rate_id: rateId })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Easyship label buy error:', error);
        return null;
    }
}

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
// DEFAULT PRODUCTS - SIRF 3 PRODUCTS
// ============================================================
const defaultProducts = [
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Wireless Headphones", price: 89.99, category: "Electronics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"], description: "Premium wireless headphones with noise cancellation", stock: 10, weight: 0.5, size: { length: 15, width: 10, height: 5 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Cotton T-Shirt", price: 24.99, category: "Textile", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"], description: "100% combed cotton t-shirt", stock: 25, weight: 0.3, size: { length: 25, width: 20, height: 5 } },
    { sellerId: 0, sellerName: "GlobalBazaar", name: "Smart Watch", price: 49.99, category: "Electronics", sellerCountry: "SA", mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"], description: "Latest smart watch with health tracking", stock: 8, weight: 0.4, size: { length: 12, width: 8, height: 3 } }
];

async function seedProductsIfEmpty() {
    try {
        const snapshot = await db.collection("products").get();
        if (snapshot.empty) {
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
            console.log("Seeded 3 default products");
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
let currentShippingCost = 0;
let lastShippingFetch = 0;
let verificationCheckInterval = null;

// ============================================================
// INVENTORY CONFIRMATION VARIABLE
// ============================================================
let pendingConfirmationProduct = null;

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
// DYNAMIC PRICE CALCULATION
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

function calculateFinalPrice(basePrice, sellerCountry, buyerCountry, shippingCost = 0) {
    let gatewayFee = (basePrice * GATEWAY_FEE_PERCENT) + GATEWAY_FEE_FIXED;
    let commission = basePrice * PLATFORM_COMMISSION;
    let total = basePrice + gatewayFee + commission + shippingCost + HANDLING_FEE;
    return { 
        total: total, 
        basePrice: basePrice, 
        shipping: shippingCost, 
        commission: commission, 
        gateway: gatewayFee,
        handling: HANDLING_FEE,
        sellerEarning: basePrice - commission - HANDLING_FEE
    };
}

// ============================================================
// EASYSHIP DYNAMIC SHIPPING
// ============================================================
async function fetchAndDisplayShippingRates() {
    if (Date.now() - lastShippingFetch < 3000) return;
    lastShippingFetch = Date.now();
    
    const shippingContainer = document.getElementById('shippingCostContainer');
    const shippingDisplay = document.getElementById('shippingCostDisplay');
    shippingContainer.style.display = 'flex';
    shippingDisplay.textContent = 'Calculating...';
    shippingDisplay.className = 'cost shipping-loading';
    
    try {
        const firstCartItem = cart[0];
        if (!firstCartItem) { 
            shippingDisplay.textContent = 'No items in cart'; 
            return; 
        }
        
        const product = products.find(p => p.id === firstCartItem.id);
        if (!product) { 
            shippingDisplay.textContent = 'Product not found'; 
            return; 
        }
        
        const seller = sellers.find(s => s.id === product.sellerId);
        if (!seller) { 
            shippingDisplay.textContent = 'Seller info missing'; 
            return; 
        }
        
        const buyerAddress = {
            country: document.getElementById('deliveryCountry').value || 'SA',
            city: document.getElementById('deliveryCity').value || '',
            postal_code: document.getElementById('deliveryPostcode').value || '',
            state: document.getElementById('deliveryState')?.value || '',
            line1: document.getElementById('deliveryStreet').value || ''
        };
        
        if (!buyerAddress.country || buyerAddress.country === '') {
            shippingDisplay.textContent = 'Select country first';
            return;
        }
        
        const sellerAddress = {
            country: seller.country || 'SA',
            city: seller.city || '',
            postal_code: seller.pincode || '',
            state: seller.state || '',
            line1: seller.street || ''
        };
        
        const parcelDetails = {
            weight: product.weight || 1,
            length: product.size?.length || 10,
            width: product.size?.width || 10,
            height: product.size?.height || 10
        };
        
        const rates = await getEasyshipRates(sellerAddress, buyerAddress, parcelDetails);
        
        if (rates && rates.length > 0) {
            const cheapest = rates.reduce((a, b) => a.total_charge < b.total_charge ? a : b);
            currentShippingCost = cheapest.total_charge || 0;
            shippingDisplay.textContent = `${getCurrencySymbol()}${convertPrice(currentShippingCost)}`;
            shippingDisplay.className = 'cost';
            sessionStorage.setItem('selected_rate_id', cheapest.id);
            sessionStorage.setItem('shipping_cost', currentShippingCost);
            sessionStorage.setItem('shipping_rates', JSON.stringify(rates));
            if (cheapest.carrier_name) shippingDisplay.title = `Carrier: ${cheapest.carrier_name}`;
            showToast(`Shipping: ${getCurrencySymbol()}${convertPrice(currentShippingCost)}`, false);
        } else {
            currentShippingCost = 10;
            shippingDisplay.textContent = `${getCurrencySymbol()}${convertPrice(currentShippingCost)}`;
            shippingDisplay.className = 'cost';
            sessionStorage.setItem('shipping_cost', currentShippingCost);
            showToast('Using default shipping rate', true);
        }
    } catch (error) {
        console.error('Shipping fetch error:', error);
        currentShippingCost = 10;
        shippingDisplay.textContent = 'Error fetching rates';
        shippingDisplay.className = 'cost';
        sessionStorage.setItem('shipping_cost', currentShippingCost);
        showToast('Could not fetch shipping rates', true);
    }
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
        else showToast("Login failed", true);
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
        else showToast("Registration failed", true);
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
    } catch (error) { showToast("Google sign-in failed", true); }
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
    } catch (error) { showToast("Google sign-up failed", true); }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await auth.signOut();
    showToast("Logged out successfully", false);
    cart = [];
    updateCartUI();
    renderCartPage();
    showSection('buyer');
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
            currentSeller = { ...currentSeller, kycStatus: freshSeller.kycStatus, earnings: freshSeller.earnings };
            localStorage.setItem('gb_current_seller', JSON.stringify(currentSeller));
            if (freshSeller.kycStatus === 'verified') {
                showToast("✅ Your KYC has been verified! You can now access your shop.", false);
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
                await db.collection("sellers").doc(sellerId).update({ kycStatus: 'verified', verifiedAt: new Date().toISOString() });
                showToast("✅ Seller approved!", false);
                addNotification(`Seller KYC verified`, 'info');
                await sendTelegramMessage(`✅ KYC Verified: ${sellerId}`);
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
                await db.collection("sellers").doc(sellerId).update({ kycStatus: 'rejected', rejectionReason: reason.trim() });
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
    let html = `<table class="kyc-table"><thead><tr><th>Shop</th><th>Owner</th><th>Email</th><th>Joined</th></tr></thead><tbody>`;
    verified.forEach(s => {
        html += `<tr><td>🏪 ${s.shopName}</td><td>${s.fullName}</td><td>${s.email}</td><td>${new Date(s.createdAt).toLocaleDateString()}</td></tr>`;
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
// RENDER PRODUCTS - FIX: Duplicate Rendering
// ============================================================
let currentCategory = "All";

function renderProductCard(p) {
    const seller = sellers.find(s => s.id === p.sellerId) || { shopName: "GlobalBazaar", country: "SA" };
    const shipping = currentShippingCost > 0 ? currentShippingCost : 10;
    const final = calculateFinalPrice(p.price, seller.country, buyerCountry, shipping);
    const stockBadge = p.stock < 5 ? `<div class="stock-badge">Only ${p.stock} left</div>` : '';
    let thumbnailsHtml = '';
    if (p.images && p.images.length > 1) {
        thumbnailsHtml = p.images.slice(0,4).map(img => 
            `<img src="${img}" onclick="event.stopPropagation(); changeProductImage('${p.id}','${img}')">`
        ).join('');
    }
    return `<div class="product-card" data-id="${p.id}">
        ${stockBadge}
        <div class="image-wrapper">
            <img class="main-img" src="${p.mainImage}" id="mainImg_${p.id}">
            <div class="product-thumbnails">${thumbnailsHtml}</div>
        </div>
        <div class="seller-name-tag">🏪 ${seller.shopName}</div>
        <h4 style="font-size:13px; margin:2px 0;">${p.name}</h4>
        <div class="prod-price">${getCurrencySymbol()}${convertPrice(final.total)}</div>
        <div class="card-actions">
            <button class="btn-sm btn-buy addCartBtn" data-id="${p.id}">🛒 Buy</button>
        </div>
    </div>`;
}

function renderCats(){
    let cats = ["All", ...new Set(products.map(p => p.category))];
    document.getElementById('catList').innerHTML = cats.map(c => `<div class="cat-pill ${currentCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`).join('');
    document.querySelectorAll('.cat-pill').forEach(el => el.addEventListener('click', (e) => { currentCategory = e.target.dataset.cat; renderCats(); renderProducts(); }));
}

function renderProducts(){
    // 🔥 FIX 1: Container ko pehle empty karo (Duplicate Rendering Fix)
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    let search = document.getElementById('searchInput')?.value.toLowerCase() || "";
    let filtered = products.filter(p => (currentCategory === "All" || p.category === currentCategory) && p.name.toLowerCase().includes(search) && p.stock > 0);
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
function openProduct(id){
    let p = products.find(x => x.id == id); if(!p) return;
    currentProduct = p;
    let seller = sellers.find(s => s.id == p.sellerId) || { shopName: "GlobalBazaar", country: "SA" };
    const shipping = currentShippingCost > 0 ? currentShippingCost : 10;
    let final = calculateFinalPrice(p.price, seller.country, buyerCountry, shipping);
    document.getElementById('modalMainImg').src = p.mainImage;
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalDesc').innerText = p.description;
    document.getElementById('modalPriceBreakdown').innerHTML = `
        Base: ${getCurrencySymbol()}${convertPrice(p.price)}<br>
        + Shipping: ${getCurrencySymbol()}${convertPrice(final.shipping)}<br>
        + Gateway Fee (2.99% + $0.49): ${getCurrencySymbol()}${convertPrice(final.gateway)}<br>
        + Handling Fee: ${getCurrencySymbol()}${convertPrice(HANDLING_FEE)}<br>
        + Commission: ${getCurrencySymbol()}${convertPrice(final.commission)}
    `;
    document.getElementById('modalPrice').innerHTML = `<strong>Total: ${getCurrencySymbol()}${convertPrice(final.total)}</strong>`;
    let thumb = document.getElementById('modalThumbnails'); if(thumb && p.images && p.images.length) thumb.innerHTML = p.images.map(img => `<img src="${img}" onclick="changeProductImage('${p.id}','${img}')">`).join('');
    let reviews = productReviews[p.id] || [];
    let avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0;
    document.getElementById('modalRatingStars').innerHTML = `<div class="rating-display"><span class="rating-badge">⭐ ${avg}</span><span>(${reviews.length} reviews)</span></div>`;
    document.getElementById('productReviews').innerHTML = reviews.map(r => `<div class="review-item"><strong>${r.userName||'User'}</strong> ⭐${r.rating}<br>${r.review}<br><small>${r.date}</small></div>`).join('');
    currentRatingHandler.currentRating = 0; renderReviewStars('reviewStars', currentRatingHandler);
    document.getElementById('whatsappShareBtn').onclick = () => shareOnWhatsApp(p, final.total);
    document.getElementById('submitReviewBtn').onclick = () => { let txt = document.getElementById('reviewText').value; if(!txt){ showToast("Write review",true); return; } if(currentRatingHandler.currentRating===0){ showToast("Select rating",true); return; } addReview(p.id, currentRatingHandler.currentRating, txt, currentBuyer ? currentBuyer.email : "Guest User"); document.getElementById('reviewText').value=''; currentRatingHandler.currentRating=0; renderReviewStars('reviewStars',currentRatingHandler); };
    document.getElementById('productModal').style.display = 'block';
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
function renderCartPage(){
    if(cart.length === 0){ document.getElementById('cartItemsList').innerHTML = '<p style="text-align:center;padding:40px;">Cart empty</p>'; document.getElementById('cartTotalAmount').innerHTML = `${getCurrencySymbol()}0.00`; return; }
    let totalUSD = 0;
    const shipping = currentShippingCost > 0 ? currentShippingCost : 10;
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
        if(btn.dataset.dir === 'inc'){
            let prod = products.find(p => p.id == cart[idx].id);
            if(cart[idx].qty < prod.stock) cart[idx].qty++;
            else showToast(`Only ${prod.stock} in stock`, true);
        } else if(btn.dataset.dir === 'dec' && cart[idx].qty > 1) cart[idx].qty--;
        else if(btn.dataset.dir === 'dec' && cart[idx].qty === 1) cart.splice(idx,1);
        saveAllLocal(); updateCartUI(); renderCartPage(); renderProducts();
        if (currentBuyer) saveUserCart(currentBuyer.uid);
    }));
    document.querySelectorAll('.cart-remove').forEach(btn => btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.idx),1);
        saveAllLocal(); updateCartUI(); renderCartPage(); renderProducts();
        if (currentBuyer) saveUserCart(currentBuyer.uid);
    }));
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
    showToast("Calculating shipping...", false);
    await fetchAndDisplayShippingRates();
    setTimeout(() => {
        showSection('payment');
        loadSavedCards();
    }, 1000);
});

function loadSavedCards(){ let userCards = savedCards.filter(c => c.userEmail === "guest@globalbazaar.com"); if(userCards.length > 0){ document.getElementById('savedCardsSection').style.display = 'block'; document.getElementById('savedCardsList').innerHTML = userCards.map((card,idx) => `<div class="flex-between"><span>💳 ****${card.cardNumber.slice(-4)} - ${card.cardHolderName}</span><button class="useSavedCardBtn" data-idx="${idx}">Use</button></div>`).join(''); document.querySelectorAll('.useSavedCardBtn').forEach(btn => btn.addEventListener('click', () => { let card = userCards[parseInt(btn.dataset.idx)]; document.getElementById('cardNumber').value = card.cardNumber; document.getElementById('cardHolderName').value = card.cardHolderName; document.getElementById('expiryDate').value = card.expiryDate; document.getElementById('cvv').value = ''; showToast("Card loaded", false); })); } }

// ============================================================
// PAYMENT - FIX: Double-Click Protection + Inventory Confirmation
// ============================================================
document.getElementById('payNowBtn')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';
    
    try {
        let cardNum = document.getElementById('cardNumber').value.replace(/\s/g,''), cardName = document.getElementById('cardHolderName').value, expiry = document.getElementById('expiryDate').value, cvv = document.getElementById('cvv').value;
        if(!cardNum || !cardName || !expiry || !cvv){ showToast("Fill card details",true); btn.disabled = false; btn.textContent = 'Pay with Card (Dummy)'; return; }
        if(cardNum.length < 15){ showToast("Invalid card",true); btn.disabled = false; btn.textContent = 'Pay with Card (Dummy)'; return; }
        if(cvv.length < 3){ showToast("Invalid CVV",true); btn.disabled = false; btn.textContent = 'Pay with Card (Dummy)'; return; }
        if(document.getElementById('saveCardCheckbox').checked){
            let existing = savedCards.findIndex(c => c.userEmail === "guest@globalbazaar.com" && c.cardNumber === cardNum);
            let cardData = { userEmail: "guest@globalbazaar.com", cardNumber: cardNum, cardHolderName: cardName, expiryDate: expiry };
            if(existing >= 0) savedCards[existing] = cardData; else savedCards.push(cardData);
            saveAllLocal();
        }
        const shippingCost = parseFloat(sessionStorage.getItem('shipping_cost')) || 10;
        let totalUSD = 0;
        for(let item of cart){
            let seller = sellers.find(s => s.id == item.sellerId);
            let final = calculateFinalPrice(item.price, seller?.country || "SA", buyerCountry, shippingCost / cart.length);
            totalUSD += final.total * item.qty;
        }
        let tracking = "GB" + Date.now();
        let cartCopy = [...cart];
        const totalWithShipping = totalUSD;
        for(let item of cart){
            let seller = sellers.find(s => s.id == item.sellerId);
            let final = calculateFinalPrice(item.price, seller?.country || "SA", buyerCountry, shippingCost / cart.length);
            let product = products.find(p => p.id == item.id);
            let newOrder = { 
                id: Date.now()+Math.random(), 
                trackingNumber: tracking, 
                sellerId: item.sellerId, 
                sellerName: seller?.shopName || "GlobalBazaar", 
                buyerEmail: currentDelivery.email, 
                buyerName: currentDelivery.fullName, 
                productName: item.name, 
                amount: final.total, 
                basePrice: item.price, 
                address: currentDelivery.fullAddress, 
                date: new Date().toLocaleString(), 
                status: "Processing", 
                qty: item.qty, 
                shippingCost: final.shipping, 
                commission: final.commission, 
                gatewayFee: final.gateway,
                handlingFee: HANDLING_FEE,
                trackingInfo: null,
                shippingCharge: shippingCost / cart.length
            };
            orders.push(newOrder);
            platformEarnings += final.commission * item.qty + final.gateway * item.qty + HANDLING_FEE * item.qty;
            if(product){ 
                product.stock -= item.qty; 
                
                // 🔥 FIX 2: Inventory Confirmation - Check if stock becomes 0
                if(product.stock <= 0){
                    product.status = 'pending_confirmation';
                    await db.collection('products').doc(product.id).update({
                        stock: 0,
                        status: 'pending_confirmation',
                        soldOutAt: new Date().toISOString()
                    });
                    
                    // Show confirmation modal to seller if logged in
                    if (currentSeller && currentSeller.sellerId === product.sellerId) {
                        showInventoryConfirmModal(product.id, product.name);
                    }
                    
                    addNotification(`📢 ${product.name} is now SOLD OUT! Waiting for seller confirmation.`, 'info');
                    sendTelegramMessage(`📢 ${product.name} is SOLD OUT! Waiting for seller confirmation.`);
                } else {
                    await db.collection('products').doc(product.id).update({
                        stock: product.stock
                    });
                }
            }
        }
        saveAllLocal();
        try {
            const firstItem = cart[0];
            const product = products.find(p => p.id === firstItem?.id);
            const seller = sellers.find(s => s.id === firstItem?.sellerId);
            if (product && seller) {
                const shipmentResult = await createShipmentAfterOrder({
                    sellerId: seller.id,
                    orderId: tracking,
                    buyerCountry: currentDelivery.country || 'SA',
                    buyerCity: currentDelivery.city || '',
                    buyerPostcode: currentDelivery.postcode || '',
                    buyerState: currentDelivery.state || '',
                    buyerStreet: currentDelivery.street || '',
                    weight: product.weight || 1,
                    length: product.size?.length || 10,
                    width: product.size?.width || 10,
                    height: product.size?.height || 10
                });
                if (shipmentResult && shipmentResult.trackingNumber) {
                    const orderIndex = orders.findIndex(o => o.trackingNumber === tracking);
                    if (orderIndex !== -1) {
                        orders[orderIndex].trackingInfo = {
                            trackingNumber: shipmentResult.trackingNumber,
                            labelUrl: shipmentResult.labelUrl,
                            carrierName: shipmentResult.carrierName
                        };
                        orders[orderIndex].status = 'Shipped';
                        saveAllLocal();
                        addNotification(`📦 Order shipped! Tracking: ${shipmentResult.trackingNumber}`, 'order');
                        sendTelegramMessage(`📦 Order ${tracking} shipped via ${shipmentResult.carrierName} - Tracking: ${shipmentResult.trackingNumber}`);
                    }
                }
            }
        } catch (e) {
            console.error('Shipment creation failed:', e);
        }
        await sendTelegramMessage(`🛍️ NEW ORDER!\nOrder: ${tracking}\nCustomer: ${currentDelivery.fullName}\nAmount: ${getCurrencySymbol()}${convertPrice(totalWithShipping)}`);
        addNotification(`Order placed! #${tracking}`, 'order');
        cart = []; saveAllLocal(); updateCartUI();
        if (currentBuyer) await saveUserCart(currentBuyer.uid);
        let last4 = cardNum.slice(-4);
        let itemsHtml = cartCopy.map(i => `<li>${i.name} x${i.qty} = ${getCurrencySymbol()}${convertPrice(i.price * i.qty)}</li>`).join('');
        document.getElementById('orderSummaryContent').innerHTML = `
            <p><strong>Order ID:</strong> ${tracking}</p>
            <h3>📦 Items</h3>
            <ul>${itemsHtml}</ul>
            <h3>💰 Total Paid: ${getCurrencySymbol()}${convertPrice(totalWithShipping)}</h3>
            <h3>📦 Shipping Cost: ${getCurrencySymbol()}${convertPrice(shippingCost)}</h3>
            <h3>👤 Delivery Details</h3>
            <p>${currentDelivery.fullName}<br>${currentDelivery.phone}<br>${currentDelivery.fullAddress}</p>
            <h3>💳 Payment</h3>
            <p>Card ending: ${last4}</p>
            <p>🔮 We'll notify you when your order ships.</p>
        `;
        document.getElementById('orderSummaryModal').style.display = 'block';
        document.getElementById('cardNumber').value=''; document.getElementById('cardHolderName').value=''; document.getElementById('expiryDate').value=''; document.getElementById('cvv').value='';
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
function markOrderShipped(orderId, trackingNum){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Processing"){ order.status = "Shipped"; order.trackingInfo = { trackingNumber: trackingNum }; saveAllLocal(); showToast(`Order Shipped! Tracking: ${trackingNum}`,false); renderSellerDashboard(); renderBuyerOrders(); addNotification(`Your order ${order.trackingNumber} shipped`,'order'); } }
function requestWithdrawal(sellerId){ let seller = sellers.find(s => s.id == sellerId); if(seller && seller.earnings > 0){ let newWithdrawal = { id: Date.now(), sellerId: seller.id, sellerName: seller.shopName, amount: seller.earnings, date: new Date().toLocaleString(), status: "Pending" }; pendingWithdrawals.push(newWithdrawal); seller.earnings = 0; saveAllLocal(); showToast("Withdrawal request submitted",false); renderSellerDashboard(); sendTelegramMessage(`💰 Withdrawal Request: ${seller.shopName} - ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`); addNotification(`Withdrawal request for ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`,'payment'); } else showToast("No balance",true); }
function processWeeklyWithdrawals(){ let last = localStorage.getItem('gb_last_withdrawal'); let now = new Date(); let day = now.getDay(); if((day===1||day===5) && (!last || new Date(last).getDate() !== now.getDate())){ pendingWithdrawals.forEach(w => { if(w.status === "Pending") w.status = "Approved"; }); saveAllLocal(); localStorage.setItem('gb_last_withdrawal', now.toString()); } }
setInterval(processWeeklyWithdrawals, 3600000); processWeeklyWithdrawals();

// ============================================================
// SELLER REGISTRATION - FIX: Email Verification + Double-Click Protection
// ============================================================
document.getElementById('sellerRegForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('sellerSubmitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Registering...';
    
    try {
        if(!document.getElementById('sellerAgreement').checked){ showToast("Accept agreement",true); btn.disabled = false; btn.textContent = '✅ Register Shop'; return; }
        let dob = document.getElementById('sellerDob').value;
        if(calculateAge(dob) < 18){ showToast("18+ required",true); btn.disabled = false; btn.textContent = '✅ Register Shop'; return; }
        let docImgFile = document.getElementById('sellerDocImage').files[0];
        if(!docImgFile){ showToast("KYC document image required",true); btn.disabled = false; btn.textContent = '✅ Register Shop'; return; }
        let docNum = document.getElementById('sellerDocNumber').value;
        if(!docNum.trim()){ showToast("Document number required",true); btn.disabled = false; btn.textContent = '✅ Register Shop'; return; }
        let docType = document.getElementById('sellerDocType').value;
        if(!docType){ showToast("Select document type",true); btn.disabled = false; btn.textContent = '✅ Register Shop'; return; }
        let avatarFile = document.getElementById('sellerAvatar').files[0];
        let countryCodeSel = document.getElementById('sellerCountryCode');
        let countryCode = countryCodeSel.value || "+91";
        const email = document.getElementById('sellerEmail').value;
        const password = document.getElementById('sellerPassword').value;

        showToast("Creating account...", false);
        document.getElementById('debugMsg').innerText = "Creating account...";

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.sendEmailVerification();
        await firebase.auth().signOut();

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
            phone: countryCode + document.getElementById('sellerPhone').value,
            password: password,
            dob: document.getElementById('sellerDob').value,
            houseNo: document.getElementById('sellerHouseNo').value,
            street: document.getElementById('sellerStreet').value,
            city: document.getElementById('sellerCity').value,
            state: document.getElementById('sellerState').value,
            pincode: document.getElementById('sellerPincode').value,
            country: document.getElementById('sellerCountryReg').value,
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
            uid: user.uid
        };
        await db.collection("sellers").doc(user.uid).set(newSeller);
        document.getElementById('sellerRegForm').reset();
        sendTelegramMessage(`📧 New Seller: ${newSeller.shopName}\nEmail: ${newSeller.email}\nWaiting for email verification`).catch(e=>console.warn);
        addNotification(`📧 Verification link sent to ${email}`, 'info');
        let modal = document.getElementById('sellerSummaryModal');
        if(modal) {
            modal.style.display = 'block';
            modal.querySelector('p').innerHTML = '📧 <strong>Please check your email!</strong><br><br>We have sent a verification link to your email address.<br><br>Click the link to verify your email and activate your seller account.<br><br>⏳ Waiting for email verification...';
        }
        document.getElementById('debugMsg').innerText = "Registration successful - Email verification sent";
        const snapshot = await db.collection("sellers").get();
        sellers = [];
        snapshot.forEach(doc => { sellers.push({ id: doc.id, ...doc.data() }); });
        updateAdminPendingBadge();
        updateAdminMenuBadges();
        if (isAdminLoggedIn) loadAdminData();
        
        btn.disabled = false;
        btn.textContent = '✅ Register Shop';
    } catch(err) {
        console.error(err);
        showToast("Registration failed: " + err.message, true);
        document.getElementById('debugMsg').innerText = "Error: " + err.message;
        btn.disabled = false;
        btn.textContent = '✅ Register Shop';
    }
});

// ============================================================
// MY SHOP LOGIN - With Email Verification Check
// ============================================================
async function showMyShopLogin(){
    const user = auth.currentUser;
    if (!user) {
        showToast("Please login first", true);
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
        showVerifyModal();
        return;
    }
    
    const email = user.email;
    const password = prompt("Enter your password to access your shop:");
    if (!password) return;
    
    try {
        // Re-authenticate to confirm password
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        await user.reauthenticateWithCredential(credential);
        
        const sellerSnapshot = await db.collection("sellers").where("uid", "==", user.uid).get();
        if (sellerSnapshot.empty) {
            showToast("No seller account found with this email. Please register first.", true);
            return;
        }
        
        const seller = sellerSnapshot.docs[0].data();
        const sellerId = sellerSnapshot.docs[0].id;
        
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
            shopName: seller.shopName
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
// SELLER DASHBOARD - FIX: KYC Strict Control
// ============================================================
function renderSellerDashboard(){
    if(!currentSeller?.sellerId) return;
    let seller = sellers.find(s => s.id === currentSeller.sellerId);
    if(!seller) return;
    
    // FIX #4: KYC Strict Control
    if (seller.kycStatus !== 'verified') {
        document.getElementById('sellerDashboard').innerHTML = `
            <div class="kyc-blocked-message">
                <h2>🔒 KYC Verification Required</h2>
                <p>Your KYC status is <strong>${seller.kycStatus}</strong>.<br>
                Please wait for admin approval or contact support.<br>
                <br>📧 support@globalbazaar.com</p>
            </div>
        `;
        return;
    }
    
    let myProducts = products.filter(p => p.sellerId == seller.id);
    let myOrders = orders.filter(o => o.sellerId == seller.id);
    let totalSales = 0, monthlyRevenue = {};
    myOrders.forEach(o => { if(o.status === "Completed"){ let earning = (o.basePrice - o.commission - HANDLING_FEE) * o.qty; totalSales += earning; let date = new Date(o.date); let my = `${date.getMonth()+1}/${date.getFullYear()}`; monthlyRevenue[my] = (monthlyRevenue[my]||0) + earning; } });
    let chartLabels = Object.keys(monthlyRevenue), chartData = Object.values(monthlyRevenue); if(chartLabels.length === 0){ chartLabels = ["No Data"]; chartData = [0]; }
    let kycClass = seller.kycStatus === "pending" ? "kyc-pending" : (seller.kycStatus === "verified" ? "kyc-verified" : "kyc-rejected");
    let kycText = seller.kycStatus === "pending" ? "⏳ KYC Pending - Wait for Admin" : (seller.kycStatus === "verified" ? "✅ KYC Verified" : "❌ KYC Rejected");
    let topProducts = {}; myOrders.forEach(o => { topProducts[o.productName] = (topProducts[o.productName]||0) + o.qty; }); let topList = Object.entries(topProducts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    let prodListHtml = myProducts.map(p => `<div class="flex-between"><span><img src="${p.mainImage}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;"> ${p.name} - ${getCurrencySymbol()}${convertPrice(p.price)} (Stock: ${p.stock})</span><button class="editProdBtn" data-id="${p.id}" style="background:#3b82f6;border:none;padding:4px 12px;border-radius:20px;">✏️ Edit</button><button class="delProd" data-id="${p.id}" style="background:#dc2626;border:none;padding:4px 12px;border-radius:20px;">Delete</button></div>`).join('');
    let ordersHtml = myOrders.map(o => `<div class="order-card"><strong>🔖 ${o.trackingNumber}</strong><br>${o.productName} x${o.qty}<br>${getCurrencySymbol()}${convertPrice(o.amount)}<br>Status: ${o.status}<br>Buyer: ${o.buyerName}<br>${o.trackingInfo ? `<br>📮 Tracking: ${o.trackingInfo.trackingNumber || o.trackingInfo}` : ''}${o.status === "Processing" ? `<br><button class="shipBtn" data-id="${o.id}" style="background:#3b82f6;margin-top:6px;">📦 Mark Shipped</button>` : ''}</div>`).join('');
    let sellerDashboardHtml = `
<div class="premium-card"><div><img src="${seller.avatar}" class="seller-avatar"><h3>${seller.shopName}</h3><p>${seller.fullName}<br>📞 ${seller.phone}<br>📧 ${seller.email}<br>📍 ${seller.city}, ${seller.country}</p></div><div><span class="kyc-status ${kycClass}">${kycText}</span></div><div>🏦 Bank: Payout via DEED (to be added)<br>💰 Balance: ${getCurrencySymbol()}${convertPrice(seller.earnings)}</div><button id="withdrawBtn" class="btn-primary" style="background:#10b981;">💸 Withdraw</button></div>
<div class="chart-container"><h3>📊 Revenue</h3><canvas id="revenueChart"></canvas></div>
<div class="premium-card"><h3>📈 Top Products</h3>${topList.map(p=>`${p[0]}: ${p[1]} sold`).join('<br>') || 'No sales'}</div>
<div class="premium-card"><h3>➕ Add Product</h3>
    <input type="text" id="prodName" placeholder="Product Name" class="input" required>
    <input type="number" id="prodPrice" placeholder="Price (USD)" class="input" required>
    <select id="prodCat" class="input" required><option>Electronics</option><option>Fashion</option><option>Home</option><option>Textile</option><option>Cosmetic</option></select>
    <input type="number" id="prodStock" placeholder="Stock Quantity" class="input" required>
    <div style="background:#f8fafc; padding:16px; border-radius:16px; margin-top:12px; border:1px solid #e2e8f0;">
        <h4 style="margin-bottom:10px;">📦 Shipping Details (Required)</h4>
        <div style="margin-bottom:12px;">
            <label style="font-size:13px; font-weight:600;">Weight (kg) *</label>
            <input type="number" id="prodWeight" placeholder="e.g., 2.5" class="input" required step="0.1" min="0.1">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
            <div><label style="font-size:13px; font-weight:600;">Length (cm) *</label><input type="number" id="prodLength" placeholder="e.g., 30" class="input" required min="1"></div>
            <div><label style="font-size:13px; font-weight:600;">Width (cm) *</label><input type="number" id="prodWidth" placeholder="e.g., 20" class="input" required min="1"></div>
            <div><label style="font-size:13px; font-weight:600;">Height (cm) *</label><input type="number" id="prodHeight" placeholder="e.g., 10" class="input" required min="1"></div>
        </div>
        <p style="font-size:12px; color:#64748b; margin-top:8px;">⚠️ Accurate weight & size help calculate shipping rates correctly.</p>
    </div>
    <label style="margin-top:12px; display:block;">Main Image (upload)</label>
    <input type="file" id="prodMainImg" accept="image/*" class="input" required>
    <label>Additional Images (optional, max 4)</label>
    <input type="file" id="prodImagesFiles" accept="image/*" multiple class="input">
    <textarea id="prodDesc" placeholder="Description" class="input" rows="2"></textarea>
    <button id="publishBtn" class="btn-primary">📢 Publish</button>
</div>
<div class="premium-card"><h3>📋 My Products (${myProducts.length})</h3><div id="myProductsList">${prodListHtml}</div></div>
<div class="premium-card"><h3>📦 Orders</h3><div id="ordersList">${ordersHtml}</div></div>
`;
    document.getElementById('sellerDashboard').innerHTML = sellerDashboardHtml;
    let ctx = document.getElementById('revenueChart')?.getContext('2d'); if(ctx){ if(sellerRevenueChart) sellerRevenueChart.destroy(); sellerRevenueChart = new Chart(ctx, { type: 'bar', data: { labels: chartLabels, datasets: [{ label: 'Revenue', data: chartData.map(v => parseFloat(convertPrice(v))), backgroundColor: '#3b82f6' }] } }); }
    
    // FIX: Double-Click Protection on Publish Button
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
                showToast("Valid dimensions required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return;
            }
            if (!currentSeller || !currentSeller.sellerId) { showToast("Please login as seller first", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            const seller = sellers.find(s => s.id === currentSeller.sellerId);
            if (!seller || seller.kycStatus !== 'verified') { showToast("Your KYC is not verified.", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            
            showToast("Uploading image...", false);
            const mainUrl = await uploadCompressedImage(mainFile);
            if (!mainUrl) { showToast("Image upload failed. Try again.", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            const additionalFiles = document.getElementById('prodImagesFiles').files;
            const additionalUrls = [];
            for (let f of additionalFiles) { if (additionalUrls.length >= 4) break; const url = await uploadCompressedImage(f); if (url) additionalUrls.push(url); }
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
    
    document.querySelectorAll('.delProd').forEach(btn => btn.addEventListener('click', async () => { let id = btn.dataset.id; await db.collection("products").doc(id).delete(); renderSellerDashboard(); renderProducts(); showToast("Product deleted", false); }));
    document.querySelectorAll('.editProdBtn').forEach(btn => btn.addEventListener('click', () => { let prod = products.find(p => p.id == btn.dataset.id); if(prod){ document.getElementById('editProdId').value = prod.id; document.getElementById('editProdName').value = prod.name; document.getElementById('editProdPrice').value = prod.price; document.getElementById('editProdCat').value = prod.category; document.getElementById('editProdStock').value = prod.stock; document.getElementById('editProdDesc').value = prod.description || ''; let currImgHtml = prod.images.map(img => `<div><img src="${img}" width="50" style="border-radius:8px; margin:4px;"> <a href="${img}" target="_blank">View</a></div>`).join(''); document.getElementById('editCurrentImages').innerHTML = `<strong>Current Images:</strong>${currImgHtml}`; document.getElementById('editProductModal').style.display = 'block'; } }));
    document.getElementById('updateProductBtn')?.addEventListener('click', async function() {
        const btn = this;
        btn.disabled = true;
        btn.textContent = '⏳ Updating...';
        try {
            let pid = document.getElementById('editProdId').value;
            let prodRef = db.collection("products").doc(pid);
            let updates = { name: document.getElementById('editProdName').value, price: parseFloat(document.getElementById('editProdPrice').value), category: document.getElementById('editProdCat').value, stock: parseInt(document.getElementById('editProdStock').value), description: document.getElementById('editProdDesc').value };
            let newMain = document.getElementById('editMainImg').files[0];
            if(newMain){ let mainUrl = await uploadCompressedImage(newMain); if(mainUrl){ updates.mainImage = mainUrl; updates.images = [mainUrl, ...(updates.images || [])]; } }
            let newExtra = document.getElementById('editExtraImgs').files;
            if(newExtra.length > 0){ let extraUrls = []; for(let i=0;i<Math.min(newExtra.length,4);i++){ let url = await uploadCompressedImage(newExtra[i]); if(url) extraUrls.push(url); } if(extraUrls.length) updates.images = [updates.mainImage || (await prodRef.get()).data().mainImage, ...extraUrls]; }
            await prodRef.update(updates);
            renderSellerDashboard(); renderProducts(); showToast("Product updated", false); document.getElementById('editProductModal').style.display = 'none';
            btn.disabled = false;
            btn.textContent = '💾 Update Product';
        } catch (error) {
            showToast("Update failed: " + error.message, true);
            btn.disabled = false;
            btn.textContent = '💾 Update Product';
        }
    });
    document.querySelectorAll('.shipBtn').forEach(btn => btn.addEventListener('click', () => { let track = prompt("Enter tracking number:"); if(track) markOrderShipped(parseFloat(btn.dataset.id), track); }));
    document.getElementById('withdrawBtn')?.addEventListener('click', () => requestWithdrawal(seller.id));
}

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

// ============================================================
// INVENTORY CONFIRMATION MODAL FUNCTIONS
// ============================================================
function showInventoryConfirmModal(productId, productName) {
    pendingConfirmationProduct = productId;
    document.getElementById('confirmProductName').textContent = productName;
    document.getElementById('inventoryConfirmModal').style.display = 'flex';
}

function hideInventoryConfirmModal() {
    document.getElementById('inventoryConfirmModal').style.display = 'none';
    pendingConfirmationProduct = null;
}

// YES Button - Restock product
document.getElementById('confirmYesBtn')?.addEventListener('click', async function() {
    if (!pendingConfirmationProduct) return;
    
    try {
        await db.collection('products').doc(pendingConfirmationProduct).update({
            status: 'available',
            stock: 1,
            updatedAt: new Date().toISOString()
        });
        showToast('✅ Product restocked successfully!', false);
        addNotification('Product restocked by seller', 'info');
        hideInventoryConfirmModal();
        renderProducts();
    } catch (error) {
        console.error('Restock error:', error);
        showToast('Failed to restock: ' + error.message, true);
    }
});

// NO Button - Delete product
document.getElementById('confirmNoBtn')?.addEventListener('click', async function() {
    if (!pendingConfirmationProduct) return;
    
    if (confirm('⚠️ Are you sure you want to permanently delete this product?')) {
        try {
            await db.collection('products').doc(pendingConfirmationProduct).delete();
            showToast('🗑️ Product deleted successfully!', false);
            addNotification('Product deleted by seller', 'info');
            hideInventoryConfirmModal();
            renderProducts();
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete: ' + error.message, true);
        }
    }
});

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

renderCats(); updateCartUI(); updateNotificationUI(); updateAdminPendingBadge(); updateAdminMenuBadges();
document.getElementById('debugMsg').innerHTML = "GlobalBazaar Ready | 3 Products | Easyship Shipping | Mode: " + EASYSHIP_MODE;
