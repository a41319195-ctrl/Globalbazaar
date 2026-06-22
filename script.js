// ============================================================
// GLOBAL BAZAAR - COMPLETE JAVASCRIPT CODE
// ONLY SHIPPING CHANGED FROM API TO FIREBASE
// ============================================================

// ============================================================
// COMPLETE COUNTRY DATABASE - ALL COUNTRIES
// ============================================================
const countryDatabase = {
    // ===== MIDDLE EAST =====
    'saudi arabia': { code: 'SA', flag: '🇸🇦', currency: 'SAR', region: 'SA' },
    'uae': { code: 'AE', flag: '🇦🇪', currency: 'AED', region: 'GCC' },
    'united arab emirates': { code: 'AE', flag: '🇦🇪', currency: 'AED', region: 'GCC' },
    'qatar': { code: 'QA', flag: '🇶🇦', currency: 'QAR', region: 'GCC' },
    'oman': { code: 'OM', flag: '🇴🇲', currency: 'OMR', region: 'GCC' },
    'kuwait': { code: 'KW', flag: '🇰🇼', currency: 'KWD', region: 'GCC' },
    'bahrain': { code: 'BH', flag: '🇧🇭', currency: 'BHD', region: 'GCC' },
    'yemen': { code: 'YE', flag: '🇾🇪', currency: 'YER', region: 'International' },
    'jordan': { code: 'JO', flag: '🇯🇴', currency: 'JOD', region: 'International' },
    'lebanon': { code: 'LB', flag: '🇱🇧', currency: 'LBP', region: 'International' },
    'iraq': { code: 'IQ', flag: '🇮🇶', currency: 'IQD', region: 'International' },
    'syria': { code: 'SY', flag: '🇸🇾', currency: 'SYP', region: 'International' },
    'israel': { code: 'IL', flag: '🇮🇱', currency: 'ILS', region: 'International' },
    'palestine': { code: 'PS', flag: '🇵🇸', currency: 'ILS', region: 'International' },
    'iran': { code: 'IR', flag: '🇮🇷', currency: 'IRR', region: 'International' },
    'turkey': { code: 'TR', flag: '🇹🇷', currency: 'TRY', region: 'International' },
    'cyprus': { code: 'CY', flag: '🇨🇾', currency: 'EUR', region: 'International' },
    
    // ===== SOUTH ASIA =====
    'india': { code: 'IN', flag: '🇮🇳', currency: 'INR', region: 'International' },
    'pakistan': { code: 'PK', flag: '🇵🇰', currency: 'PKR', region: 'International' },
    'bangladesh': { code: 'BD', flag: '🇧🇩', currency: 'BDT', region: 'International' },
    'nepal': { code: 'NP', flag: '🇳🇵', currency: 'NPR', region: 'International' },
    'sri lanka': { code: 'LK', flag: '🇱🇰', currency: 'LKR', region: 'International' },
    'bhutan': { code: 'BT', flag: '🇧🇹', currency: 'BTN', region: 'International' },
    'maldives': { code: 'MV', flag: '🇲🇻', currency: 'MVR', region: 'International' },
    'afghanistan': { code: 'AF', flag: '🇦🇫', currency: 'AFN', region: 'International' },
    'myanmar': { code: 'MM', flag: '🇲🇲', currency: 'MMK', region: 'International' },
    
    // ===== SOUTHEAST ASIA =====
    'malaysia': { code: 'MY', flag: '🇲🇾', currency: 'MYR', region: 'International' },
    'indonesia': { code: 'ID', flag: '🇮🇩', currency: 'IDR', region: 'International' },
    'philippines': { code: 'PH', flag: '🇵🇭', currency: 'PHP', region: 'International' },
    'thailand': { code: 'TH', flag: '🇹🇭', currency: 'THB', region: 'International' },
    'vietnam': { code: 'VN', flag: '🇻🇳', currency: 'VND', region: 'International' },
    'singapore': { code: 'SG', flag: '🇸🇬', currency: 'SGD', region: 'International' },
    'cambodia': { code: 'KH', flag: '🇰🇭', currency: 'KHR', region: 'International' },
    'laos': { code: 'LA', flag: '🇱🇦', currency: 'LAK', region: 'International' },
    'brunei': { code: 'BN', flag: '🇧🇳', currency: 'BND', region: 'International' },
    
    // ===== EAST ASIA =====
    'china': { code: 'CN', flag: '🇨🇳', currency: 'CNY', region: 'International' },
    'japan': { code: 'JP', flag: '🇯🇵', currency: 'JPY', region: 'International' },
    'south korea': { code: 'KR', flag: '🇰🇷', currency: 'KRW', region: 'International' },
    'taiwan': { code: 'TW', flag: '🇹🇼', currency: 'TWD', region: 'International' },
    'hong kong': { code: 'HK', flag: '🇭🇰', currency: 'HKD', region: 'International' },
    'macau': { code: 'MO', flag: '🇲🇴', currency: 'MOP', region: 'International' },
    'mongolia': { code: 'MN', flag: '🇲🇳', currency: 'MNT', region: 'International' },
    
    // ===== NORTH AMERICA =====
    'usa': { code: 'US', flag: '🇺🇸', currency: 'USD', region: 'International' },
    'united states': { code: 'US', flag: '🇺🇸', currency: 'USD', region: 'International' },
    'canada': { code: 'CA', flag: '🇨🇦', currency: 'CAD', region: 'International' },
    'mexico': { code: 'MX', flag: '🇲🇽', currency: 'MXN', region: 'International' },
    
    // ===== EUROPE =====
    'uk': { code: 'GB', flag: '🇬🇧', currency: 'GBP', region: 'International' },
    'united kingdom': { code: 'GB', flag: '🇬🇧', currency: 'GBP', region: 'International' },
    'england': { code: 'GB', flag: '🇬🇧', currency: 'GBP', region: 'International' },
    'germany': { code: 'DE', flag: '🇩🇪', currency: 'EUR', region: 'International' },
    'france': { code: 'FR', flag: '🇫🇷', currency: 'EUR', region: 'International' },
    'italy': { code: 'IT', flag: '🇮🇹', currency: 'EUR', region: 'International' },
    'spain': { code: 'ES', flag: '🇪🇸', currency: 'EUR', region: 'International' },
    'portugal': { code: 'PT', flag: '🇵🇹', currency: 'EUR', region: 'International' },
    'netherlands': { code: 'NL', flag: '🇳🇱', currency: 'EUR', region: 'International' },
    'belgium': { code: 'BE', flag: '🇧🇪', currency: 'EUR', region: 'International' },
    'switzerland': { code: 'CH', flag: '🇨🇭', currency: 'CHF', region: 'International' },
    'austria': { code: 'AT', flag: '🇦🇹', currency: 'EUR', region: 'International' },
    'sweden': { code: 'SE', flag: '🇸🇪', currency: 'SEK', region: 'International' },
    'norway': { code: 'NO', flag: '🇳🇴', currency: 'NOK', region: 'International' },
    'denmark': { code: 'DK', flag: '🇩🇰', currency: 'DKK', region: 'International' },
    'finland': { code: 'FI', flag: '🇫🇮', currency: 'EUR', region: 'International' },
    'ireland': { code: 'IE', flag: '🇮🇪', currency: 'EUR', region: 'International' },
    'poland': { code: 'PL', flag: '🇵🇱', currency: 'PLN', region: 'International' },
    'czech republic': { code: 'CZ', flag: '🇨🇿', currency: 'CZK', region: 'International' },
    'hungary': { code: 'HU', flag: '🇭🇺', currency: 'HUF', region: 'International' },
    'romania': { code: 'RO', flag: '🇷🇴', currency: 'RON', region: 'International' },
    'bulgaria': { code: 'BG', flag: '🇧🇬', currency: 'BGN', region: 'International' },
    'greece': { code: 'GR', flag: '🇬🇷', currency: 'EUR', region: 'International' },
    'russia': { code: 'RU', flag: '🇷🇺', currency: 'RUB', region: 'International' },
    'ukraine': { code: 'UA', flag: '🇺🇦', currency: 'UAH', region: 'International' },
    'slovakia': { code: 'SK', flag: '🇸🇰', currency: 'EUR', region: 'International' },
    'slovenia': { code: 'SI', flag: '🇸🇮', currency: 'EUR', region: 'International' },
    'croatia': { code: 'HR', flag: '🇭🇷', currency: 'EUR', region: 'International' },
    'serbia': { code: 'RS', flag: '🇷🇸', currency: 'RSD', region: 'International' },
    'iceland': { code: 'IS', flag: '🇮🇸', currency: 'ISK', region: 'International' },
    'luxembourg': { code: 'LU', flag: '🇱🇺', currency: 'EUR', region: 'International' },
    'malta': { code: 'MT', flag: '🇲🇹', currency: 'EUR', region: 'International' },
    
    // ===== SOUTH AMERICA =====
    'brazil': { code: 'BR', flag: '🇧🇷', currency: 'BRL', region: 'International' },
    'argentina': { code: 'AR', flag: '🇦🇷', currency: 'ARS', region: 'International' },
    'colombia': { code: 'CO', flag: '🇨🇴', currency: 'COP', region: 'International' },
    'chile': { code: 'CL', flag: '🇨🇱', currency: 'CLP', region: 'International' },
    'peru': { code: 'PE', flag: '🇵🇪', currency: 'PEN', region: 'International' },
    'venezuela': { code: 'VE', flag: '🇻🇪', currency: 'VES', region: 'International' },
    'ecuador': { code: 'EC', flag: '🇪🇨', currency: 'USD', region: 'International' },
    'bolivia': { code: 'BO', flag: '🇧🇴', currency: 'BOB', region: 'International' },
    'paraguay': { code: 'PY', flag: '🇵🇾', currency: 'PYG', region: 'International' },
    'uruguay': { code: 'UY', flag: '🇺🇾', currency: 'UYU', region: 'International' },
    
    // ===== CENTRAL AMERICA & CARIBBEAN =====
    'costa rica': { code: 'CR', flag: '🇨🇷', currency: 'CRC', region: 'International' },
    'panama': { code: 'PA', flag: '🇵🇦', currency: 'USD', region: 'International' },
    'guatemala': { code: 'GT', flag: '🇬🇹', currency: 'GTQ', region: 'International' },
    'honduras': { code: 'HN', flag: '🇭🇳', currency: 'HNL', region: 'International' },
    'nicaragua': { code: 'NI', flag: '🇳🇮', currency: 'NIO', region: 'International' },
    'el salvador': { code: 'SV', flag: '🇸🇻', currency: 'USD', region: 'International' },
    'belize': { code: 'BZ', flag: '🇧🇿', currency: 'BZD', region: 'International' },
    'cuba': { code: 'CU', flag: '🇨🇺', currency: 'CUP', region: 'International' },
    'jamaica': { code: 'JM', flag: '🇯🇲', currency: 'JMD', region: 'International' },
    'dominican republic': { code: 'DO', flag: '🇩🇴', currency: 'DOP', region: 'International' },
    'haiti': { code: 'HT', flag: '🇭🇹', currency: 'HTG', region: 'International' },
    'bahamas': { code: 'BS', flag: '🇧🇸', currency: 'BSD', region: 'International' },
    'barbados': { code: 'BB', flag: '🇧🇧', currency: 'BBD', region: 'International' },
    'trinidad': { code: 'TT', flag: '🇹🇹', currency: 'TTD', region: 'International' },
    
    // ===== OCEANIA =====
    'australia': { code: 'AU', flag: '🇦🇺', currency: 'AUD', region: 'International' },
    'new zealand': { code: 'NZ', flag: '🇳🇿', currency: 'NZD', region: 'International' },
    'fiji': { code: 'FJ', flag: '🇫🇯', currency: 'FJD', region: 'International' },
    'papua new guinea': { code: 'PG', flag: '🇵🇬', currency: 'PGK', region: 'International' },
    'samoa': { code: 'WS', flag: '🇼🇸', currency: 'WST', region: 'International' },
    'tonga': { code: 'TO', flag: '🇹🇴', currency: 'TOP', region: 'International' },
    
    // ===== AFRICA =====
    'south africa': { code: 'ZA', flag: '🇿🇦', currency: 'ZAR', region: 'International' },
    'egypt': { code: 'EG', flag: '🇪🇬', currency: 'EGP', region: 'International' },
    'nigeria': { code: 'NG', flag: '🇳🇬', currency: 'NGN', region: 'International' },
    'kenya': { code: 'KE', flag: '🇰🇪', currency: 'KES', region: 'International' },
    'ghana': { code: 'GH', flag: '🇬🇭', currency: 'GHS', region: 'International' },
    'morocco': { code: 'MA', flag: '🇲🇦', currency: 'MAD', region: 'International' },
    'algeria': { code: 'DZ', flag: '🇩🇿', currency: 'DZD', region: 'International' },
    'tunisia': { code: 'TN', flag: '🇹🇳', currency: 'TND', region: 'International' },
    'libya': { code: 'LY', flag: '🇱🇾', currency: 'LYD', region: 'International' },
    'sudan': { code: 'SD', flag: '🇸🇩', currency: 'SDG', region: 'International' },
    'ethiopia': { code: 'ET', flag: '🇪🇹', currency: 'ETB', region: 'International' },
    'somalia': { code: 'SO', flag: '🇸🇴', currency: 'SOS', region: 'International' },
    'uganda': { code: 'UG', flag: '🇺🇬', currency: 'UGX', region: 'International' },
    'tanzania': { code: 'TZ', flag: '🇹🇿', currency: 'TZS', region: 'International' },
    'rwanda': { code: 'RW', flag: '🇷🇼', currency: 'RWF', region: 'International' },
    'congo': { code: 'CD', flag: '🇨🇩', currency: 'CDF', region: 'International' },
    'zambia': { code: 'ZM', flag: '🇿🇲', currency: 'ZMW', region: 'International' },
    'zimbabwe': { code: 'ZW', flag: '🇿🇼', currency: 'ZWL', region: 'International' },
    'angola': { code: 'AO', flag: '🇦🇴', currency: 'AOA', region: 'International' },
    'botswana': { code: 'BW', flag: '🇧🇼', currency: 'BWP', region: 'International' },
    'namibia': { code: 'NA', flag: '🇳🇦', currency: 'NAD', region: 'International' },
    'mauritius': { code: 'MU', flag: '🇲🇺', currency: 'MUR', region: 'International' },
    'madagascar': { code: 'MG', flag: '🇲🇬', currency: 'MGA', region: 'International' },
    'cameroon': { code: 'CM', flag: '🇨🇲', currency: 'XAF', region: 'International' },
    'senegal': { code: 'SN', flag: '🇸🇳', currency: 'XOF', region: 'International' },
    'ivory coast': { code: 'CI', flag: '🇨🇮', currency: 'XOF', region: 'International' },
    'mali': { code: 'ML', flag: '🇲🇱', currency: 'XOF', region: 'International' },
    'niger': { code: 'NE', flag: '🇳🇪', currency: 'XOF', region: 'International' },
    'chad': { code: 'TD', flag: '🇹🇩', currency: 'XAF', region: 'International' },
    'benin': { code: 'BJ', flag: '🇧🇯', currency: 'XOF', region: 'International' },
    'togo': { code: 'TG', flag: '🇹🇬', currency: 'XOF', region: 'International' }
};

// ============================================================
// DYNAMIC COUNTRY CODE CONVERTER
// ============================================================
function getCountryCode(countryName) {
    console.log('🔍 getCountryCode called with:', countryName);
    
    if (!countryName) {
        console.warn('⚠️ No country name. Using default: SA');
        return 'SA';
    }
    
    let cleaned = countryName.toString().trim().toLowerCase();
    console.log('🧹 Cleaned:', cleaned);
    
    if (cleaned.length === 2 && /^[a-z]{2}$/.test(cleaned)) {
        console.log('✅ Already ISO code:', cleaned.toUpperCase());
        return cleaned.toUpperCase();
    }
    
    if (countryDatabase[cleaned]) {
        console.log('✅ Found in database:', cleaned, '→', countryDatabase[cleaned].code);
        return countryDatabase[cleaned].code;
    }
    
    const words = cleaned.split(' ');
    for (const [key, data] of Object.entries(countryDatabase)) {
        const keyWords = key.split(' ');
        for (const word of words) {
            if (word.length > 2 && keyWords.some(kw => kw.includes(word) || word.includes(kw))) {
                console.log('✅ Partial match:', word, '→', data.code);
                return data.code;
            }
        }
    }
    
    const alternatives = {
        'usa': 'US', 'america': 'US', 'us': 'US',
        'uk': 'GB', 'britain': 'GB', 'england': 'GB',
        'korea': 'KR', 'russia': 'RU'
    };
    if (alternatives[cleaned]) {
        console.log('✅ Alternative match:', cleaned, '→', alternatives[cleaned]);
        return alternatives[cleaned];
    }
    
    console.warn(`⚠️ No ISO code found for: "${countryName}". Using default: SA`);
    return 'SA';
}

// ============================================================
// 🔥 NEW: FIREBASE SHIPPING - REPLACES EASYSHIP API
// ============================================================

/**
 * Get shipping rate from Firebase product data
 */
async function getShippingRateFromFirebase(productId, buyerCountry) {
    try {
        console.log('🚀 getShippingRateFromFirebase called');
        console.log('📦 Product ID:', productId);
        console.log('📦 Buyer Country:', buyerCountry);
        
        if (!productId) {
            return { rate: 0, region: 'unknown', available: false, error: 'No product ID' };
        }
        
        if (!buyerCountry || buyerCountry === 'Select Country') {
            return { rate: 0, region: 'unknown', available: false, error: 'Please select a country' };
        }
        
        const productDoc = await db.collection('products').doc(productId).get();
        if (!productDoc.exists) {
            return { rate: 0, region: 'unknown', available: false, error: 'Product not found' };
        }
        
        const productData = productDoc.data();
        
        // Get buyer's region
        const countryLower = buyerCountry.toString().trim().toLowerCase();
        let region = 'International';
        
        for (const [key, value] of Object.entries(countryDatabase)) {
            if (key === countryLower || value.code.toLowerCase() === countryLower) {
                region = value.region || 'International';
                break;
            }
        }
        
        // Get shipping rate based on region
        let rate = 0;
        if (region === 'SA') {
            rate = productData.Shipping_SA || productData.shipping_SA || 0;
        } else if (region === 'GCC') {
            rate = productData.Shipping_GCC || productData.shipping_GCC || 0;
        } else {
            rate = productData.Shipping_International || productData.shipping_International || 0;
        }
        
        console.log(`💰 Shipping rate for ${region}: ${rate}`);
        
        return {
            rate: parseFloat(rate) || 0,
            region: region,
            available: rate > 0,
            error: rate > 0 ? null : `Shipping not available for ${buyerCountry}`
        };
    } catch (error) {
        console.error('❌ Shipping error:', error);
        return { rate: 0, region: 'unknown', available: false, error: error.message };
    }
}

// ============================================================
// FIXED CATEGORIES
// ============================================================
const FIXED_CATEGORIES = ['Fashion', 'Textiles', 'Cosmetics', 'Electronics', 'Home Decor'];

function updateCategorySelect() {
    const select = document.getElementById('prodCat');
    if (select) {
        select.innerHTML = FIXED_CATEGORIES.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
    }
}

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
// DEFAULT PRODUCTS
// ============================================================
const defaultProducts = [
    { 
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
        Shipping_SA: 25,
        Shipping_GCC: 35,
        Shipping_International: 50
    },
    { 
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
        Shipping_SA: 30,
        Shipping_GCC: 40,
        Shipping_International: 60
    },
    { 
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
        Shipping_SA: 20,
        Shipping_GCC: 30,
        Shipping_International: 45
    },
    { 
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
        Shipping_SA: 15,
        Shipping_GCC: 25,
        Shipping_International: 40
    },
    { 
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
        Shipping_SA: 35,
        Shipping_GCC: 45,
        Shipping_International: 65
    }
];

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
                    createdAt: new Date().toISOString()
                });
            }
            console.log("Seeded 5 default products with shipping rates");
        }
    } catch (e) { console.error('Seed error:', e); }
}

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
let shippingAvailable = false;
let verificationCheckInterval = null;
let pendingConfirmationProduct = null;

// ============================================================
// DYNAMIC PRICING
// ============================================================
const MAINTENANCE_FEE = 1.50;
const GATEWAY_PERCENT = 0.03;
const PLATFORM_COMMISSION = 0.10;

function calculateDynamicPrice(basePrice, shippingCost = 0) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let maintenanceFee = MAINTENANCE_FEE;
    let grandTotal = basePrice + maintenanceFee + gatewayFee + shippingCost;
    
    return {
        basePrice: basePrice,
        gatewayFee: gatewayFee,
        maintenanceFee: maintenanceFee,
        shippingCost: shippingCost,
        grandTotal: grandTotal,
        breakdown: {
            'Product Price': basePrice,
            '+ Gateway Fee (3%)': gatewayFee,
            '+ Maintenance Fee': maintenanceFee,
            '+ Shipping Cost': shippingCost,
            '= Grand Total': grandTotal
        }
    };
}

function calculateDisplayPrice(basePrice) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let total = basePrice + gatewayFee + MAINTENANCE_FEE;
    return { 
        total: total, 
        basePrice: basePrice, 
        gateway: gatewayFee,
        handling: MAINTENANCE_FEE
    };
}

function calculateFinalPrice(basePrice, sellerCountry, buyerCountry, shippingCost = 0) {
    let gatewayFee = basePrice * GATEWAY_PERCENT;
    let commission = basePrice * PLATFORM_COMMISSION;
    let total = basePrice + gatewayFee + MAINTENANCE_FEE + shippingCost + commission;
    return { 
        total: total, 
        basePrice: basePrice, 
        shipping: shippingCost, 
        commission: commission, 
        gateway: gatewayFee,
        handling: MAINTENANCE_FEE,
        sellerEarning: basePrice - commission - MAINTENANCE_FEE
    };
}

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

// ============================================================
// COUNTRY SELECT
// ============================================================
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
// EMAIL VERIFICATION MODAL
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
// RENDER PRODUCTS
// ============================================================
let currentCategory = "All";

function renderProductCard(p) {
    const seller = sellers.find(s => s.id === p.sellerId) || { shopName: "GlobalBazaar", country: "SA" };
    const displayPrice = calculateDisplayPrice(p.price);
    const stockBadge = p.stock < 5 ? `<div class="stock-badge">Only ${p.stock} left</div>` : '';
    const soldOutBadge = p.stock <= 0 ? `<div class="soldout-badge">SOLD OUT</div>` : '';
    let thumbnailsHtml = '';
    if (p.images && p.images.length > 1) {
        thumbnailsHtml = p.images.slice(0,4).map(img => 
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
            <button class="btn-sm btn-buy addCartBtn" data-id="${p.id}" ${p.stock <= 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>🛒 Buy</button>
        </div>
    </div>`;
}

function renderCats(){
    let cats = ["All", ...new Set(products.map(p => p.category))];
    document.getElementById('catList').innerHTML = cats.map(c => `<div class="cat-pill ${currentCategory === c ? 'active' : ''}" data-cat="${c}">${c}</div>`).join('');
    document.querySelectorAll('.cat-pill').forEach(el => el.addEventListener('click', (e) => { currentCategory = e.target.dataset.cat; renderCats(); renderProducts(); }));
}

function renderProducts(){
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
    let seller = sellers.find(s => s.id === p.sellerId) || { shopName: "GlobalBazaar", country: "SA" };
    const displayPrice = calculateDisplayPrice(p.price);
    document.getElementById('modalMainImg').src = p.mainImage;
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalDesc').innerText = p.description;
    document.getElementById('modalPriceBreakdown').innerHTML = `
        Base: ${getCurrencySymbol()}${convertPrice(p.price)}<br>
        + Gateway Fee (3%): ${getCurrencySymbol()}${convertPrice(displayPrice.gateway)}<br>
        + Maintenance Fee: ${getCurrencySymbol()}${convertPrice(displayPrice.handling)}
    `;
    document.getElementById('modalPrice').innerHTML = `<strong>Total: ${getCurrencySymbol()}${convertPrice(displayPrice.total)}</strong>`;
    let thumb = document.getElementById('modalThumbnails'); if(thumb && p.images && p.images.length) thumb.innerHTML = p.images.map(img => `<img src="${img}" onclick="changeProductImage('${p.id}','${img}')">`).join('');
    let reviews = productReviews[p.id] || [];
    let avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0;
    document.getElementById('modalRatingStars').innerHTML = `<div class="rating-display"><span class="rating-badge">⭐ ${avg}</span><span>(${reviews.length} reviews)</span></div>`;
    document.getElementById('productReviews').innerHTML = reviews.map(r => `<div class="review-item"><strong>${r.userName||'User'}</strong> ⭐${r.rating}<br>${r.review}<br><small>${r.date}</small></div>`).join('');
    currentRatingHandler.currentRating = 0; renderReviewStars('reviewStars', currentRatingHandler);
    document.getElementById('whatsappShareBtn').onclick = () => shareOnWhatsApp(p, displayPrice.total);
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

// ============================================================
// 🔥 UPDATED: FETCH SHIPPING RATES - NOW USES FIREBASE
// ============================================================
async function fetchAndDisplayShippingRates() {
    console.log('🚀 fetchAndDisplayShippingRates called');
    
    if (Date.now() - lastShippingFetch < 3000) {
        console.log('⏳ Throttling');
        return;
    }
    lastShippingFetch = Date.now();
    
    const shippingContainer = document.getElementById('shippingCostContainer');
    const shippingDisplay = document.getElementById('shippingCostDisplay');
    const payBtn = document.getElementById('payNowBtn');
    
    if (shippingContainer) shippingContainer.style.display = 'flex';
    if (shippingDisplay) {
        shippingDisplay.textContent = 'Calculating...';
        shippingDisplay.className = 'cost shipping-loading';
    }
    
    if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = '⏳ Calculating Shipping...';
    }
    
    try {
        const firstCartItem = cart[0];
        if (!firstCartItem) {
            console.warn('⚠️ Cart is empty');
            if (shippingDisplay) {
                shippingDisplay.textContent = 'No items in cart';
                shippingDisplay.className = 'cost error';
            }
            if (payBtn) { payBtn.disabled = true; payBtn.textContent = '⏳ Waiting for items...'; }
            return;
        }
        
        const buyerCountryEl = document.getElementById('deliveryCountry');
        const buyerCountry = buyerCountryEl ? buyerCountryEl.value : '';
        
        if (!buyerCountry || buyerCountry === '' || buyerCountry === 'Select Country') {
            console.warn('⚠️ No country selected');
            if (shippingDisplay) {
                shippingDisplay.textContent = 'Select country first';
                shippingDisplay.className = 'cost error';
            }
            if (payBtn) { payBtn.disabled = true; payBtn.textContent = '⏳ Select country'; }
            return;
        }
        
        const productId = firstCartItem.id;
        const shippingResult = await getShippingRateFromFirebase(productId, buyerCountry);
        
        if (shippingResult.available && shippingResult.rate > 0) {
            currentShippingCost = shippingResult.rate;
            shippingAvailable = true;
            
            const displayCost = convertPrice(currentShippingCost);
            if (shippingDisplay) {
                shippingDisplay.textContent = `${getCurrencySymbol()}${displayCost}`;
                shippingDisplay.className = 'cost';
                shippingDisplay.style.color = '#10b981';
            }
            
            sessionStorage.setItem('shipping_cost', currentShippingCost);
            sessionStorage.setItem('shipping_available', 'true');
            
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.textContent = '✅ Continue to Pay';
                payBtn.style.opacity = '1';
            }
            
            showToast(`Shipping: ${getCurrencySymbol()}${displayCost}`, false);
        } else {
            currentShippingCost = 0;
            shippingAvailable = false;
            
            if (shippingDisplay) {
                shippingDisplay.textContent = '❌ Not Available';
                shippingDisplay.className = 'cost error';
                shippingDisplay.style.color = '#ef4444';
            }
            sessionStorage.setItem('shipping_cost', 0);
            sessionStorage.setItem('shipping_available', 'false');
            
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.textContent = '⏳ Shipping Unavailable';
                payBtn.style.opacity = '0.5';
            }
            
            showToast(`❌ ${shippingResult.error || 'Shipping not available'}`, true);
        }
    } catch (error) {
        console.error('❌ Shipping fetch error:', error);
        currentShippingCost = 0;
        shippingAvailable = false;
        if (shippingDisplay) {
            shippingDisplay.textContent = '⚠️ Error';
            shippingDisplay.className = 'cost error';
        }
        sessionStorage.setItem('shipping_cost', 0);
        sessionStorage.setItem('shipping_available', 'false');
        showToast('⚠️ Could not fetch shipping rates', true);
        if (payBtn) {
            payBtn.disabled = true;
            payBtn.textContent = '⏳ Shipping Error';
        }
    }
}

// ============================================================
// 🔥 UPDATED: CONFIRM DELIVERY BUTTON
// ============================================================
function setupConfirmDeliveryButton() {
    console.log('🔧 Setting up Confirm Delivery Button...');
    
    const confirmBtn = document.getElementById('confirmDeliveryBtn');
    if (!confirmBtn) {
        console.warn('⚠️ Confirm Delivery button not found!');
        return;
    }
    
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    
    newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        console.log('🔄 Confirm Delivery button clicked!');
        
        const user = auth.currentUser;
        if (!user) {
            sessionStorage.setItem('pendingCheckout', 'true');
            sessionStorage.setItem('pendingCart', JSON.stringify(cart));
            showToast("Please login to continue", true);
            document.getElementById('loginModal').style.display = 'block';
            return;
        }
        
        const fn = document.getElementById('deliveryFullName')?.value || '';
        const ph = document.getElementById('deliveryPhone')?.value || '';
        const c = document.getElementById('deliveryCountry')?.value || '';
        const ci = document.getElementById('deliveryCity')?.value || '';
        const pc = document.getElementById('deliveryPostcode')?.value || '';
        const st = document.getElementById('deliveryStreet')?.value || '';
        
        console.log('📋 Delivery Details:', { fn, ph, c, ci, pc, st });
        
        if (!fn || !ph || !c || !ci || !pc || !st) {
            showToast("Please fill all delivery fields!", true);
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
            houseNo: document.getElementById('deliveryHouseNo')?.value || '',
            fullAddress: `${document.getElementById('deliveryHouseNo')?.value || ''}, ${st}, ${ci}, ${pc}, ${c}`,
            email: user.email,
            state: document.getElementById('deliveryState')?.value || ''
        };
        
        if (document.getElementById('saveAddressCheckbox')?.checked) {
            const idx = savedAddresses.findIndex(a => a.email === user.email);
            const addr = {
                email: user.email,
                fullName: fn,
                phone: ph,
                country: c,
                city: ci,
                postcode: pc,
                street: st,
                houseNo: document.getElementById('deliveryHouseNo')?.value || '',
                state: document.getElementById('deliveryState')?.value || ''
            };
            if (idx >= 0) savedAddresses[idx] = addr;
            else savedAddresses.push(addr);
            saveAllLocal();
        }
        
        showToast("Calculating shipping...", false);
        console.log('🔄 Calling fetchAndDisplayShippingRates...');
        await fetchAndDisplayShippingRates();
        console.log('✅ fetchAndDisplayShippingRates completed');
        
        // Check if shipping is available
        if (!shippingAvailable || currentShippingCost <= 0) {
            showToast("❌ Shipping not available for this region!", true);
            return;
        }
        
        setTimeout(() => {
            showSection('payment');
            loadSavedCards();
            // Make sure pay button is enabled
            const payBtn = document.getElementById('payNowBtn');
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.textContent = '✅ Continue to Pay';
                payBtn.style.opacity = '1';
            }
        }, 1000);
    });
    
    console.log('✅ Confirm Delivery button setup complete!');
}

// ============================================================
// PAYMENT - UPDATED TO USE FIREBASE SHIPPING
// ============================================================
function loadSavedCards(){ let userCards = savedCards.filter(c => c.userEmail === "guest@globalbazaar.com"); if(userCards.length > 0){ document.getElementById('savedCardsSection').style.display = 'block'; document.getElementById('savedCardsList').innerHTML = userCards.map((card,idx) => `<div class="flex-between"><span>💳 ****${card.cardNumber.slice(-4)} - ${card.cardHolderName}</span><button class="useSavedCardBtn" data-idx="${idx}">Use</button></div>`).join(''); document.querySelectorAll('.useSavedCardBtn').forEach(btn => btn.addEventListener('click', () => { let card = userCards[parseInt(btn.dataset.idx)]; document.getElementById('cardNumber').value = card.cardNumber; document.getElementById('cardHolderName').value = card.cardHolderName; document.getElementById('expiryDate').value = card.expiryDate; document.getElementById('cvv').value = ''; showToast("Card loaded", false); })); } }

document.getElementById('payNowBtn')?.addEventListener('click', async function() {
    const btn = this;
    
    // Check shipping availability
    if (!shippingAvailable || currentShippingCost <= 0) {
        showToast("❌ Shipping not available. Cannot proceed with payment.", true);
        return;
    }
    
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
        
        const shippingCost = currentShippingCost;
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
            let product = products.find(p => p.id == item.id);
            let priceCalc = calculateDynamicPrice(item.price, shippingCost / cart.length);
            
            let newOrder = { 
                id: Date.now()+Math.random(), 
                trackingNumber: tracking, 
                sellerId: item.sellerId, 
                sellerName: seller?.shopName || "GlobalBazaar", 
                buyerEmail: currentDelivery.email, 
                buyerName: currentDelivery.fullName,
                
                productDetails: {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: product?.category || '',
                    sellerId: item.sellerId,
                    sellerName: seller?.shopName || "GlobalBazaar"
                },
                
                productName: item.name,
                amount: totalWithShipping / cart.length,
                basePrice: item.price,
                address: currentDelivery.fullAddress, 
                date: new Date().toLocaleString(), 
                status: "Processing", 
                qty: item.qty,
                
                priceBreakdown: {
                    basePrice: item.price,
                    gatewayFee: priceCalc.gatewayFee,
                    maintenanceFee: priceCalc.maintenanceFee,
                    shippingCost: priceCalc.shippingCost,
                    grandTotal: priceCalc.grandTotal
                },
                
                shippingCost: priceCalc.shippingCost,
                commission: item.price * PLATFORM_COMMISSION,
                gatewayFee: priceCalc.gatewayFee,
                handlingFee: MAINTENANCE_FEE,
                trackingInfo: null,
                shippingCharge: shippingCost / cart.length
            };
            orders.push(newOrder);
            platformEarnings += (item.price * PLATFORM_COMMISSION) + priceCalc.gatewayFee + MAINTENANCE_FEE;
            
            if(product){ 
                product.stock -= item.qty; 
                if(product.stock <= 0){
                    product.status = 'pending_approval';
                    await db.collection('products').doc(product.id).update({
                        stock: 0,
                        status: 'pending_approval',
                        soldOutAt: new Date().toISOString()
                    });
                    addNotification(`📢 ${product.name} is now SOLD OUT! Waiting for seller approval.`, 'info');
                    sendTelegramMessage(`📢 ${product.name} is SOLD OUT! Waiting for seller approval.`);
                    if (currentSeller && currentSeller.sellerId === product.sellerId) {
                        showInventoryConfirmModal(product.id, product.name);
                    }
                } else {
                    await db.collection('products').doc(product.id).update({
                        stock: product.stock
                    });
                }
            }
        }
        saveAllLocal();
        
        await sendTelegramMessage(`🛍️ NEW ORDER!\nOrder: ${tracking}\nCustomer: ${currentDelivery.fullName}\nAmount: ${getCurrencySymbol()}${convertPrice(totalWithShipping)}`);
        addNotification(`Order placed! #${tracking}`, 'order');
        cart = []; saveAllLocal(); updateCartUI();
        if (currentBuyer) await saveUserCart(currentBuyer.uid);
        let last4 = cardNum.slice(-4);
        
        let breakdownHtml = cartCopy.map(i => {
            let calc = calculateDynamicPrice(i.price, shippingCost / cart.length);
            return `
                <div style="background:#f8fafc; padding:12px; border-radius:12px; margin-bottom:10px;">
                    <strong>${i.name}</strong> x${i.qty}
                    <div style="font-size:12px; color:#64748b; margin-top:5px;">
                        Base: ${getCurrencySymbol()}${convertPrice(i.price)}<br>
                        + Gateway (3%): ${getCurrencySymbol()}${convertPrice(calc.gatewayFee)}<br>
                        + Maintenance: ${getCurrencySymbol()}${convertPrice(calc.maintenanceFee)}<br>
                        + Shipping: ${getCurrencySymbol()}${convertPrice(calc.shippingCost)}<br>
                        <strong>= ${getCurrencySymbol()}${convertPrice(calc.grandTotal)}</strong>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('orderSummaryContent').innerHTML = `
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

function confirmOrderReceived(orderId){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Shipped"){ order.status = "Delivered"; saveAllLocal(); showToast("Order marked Delivered", false); renderBuyerOrders(); addNotification(`Order ${order.trackingNumber} delivered`,'order'); setTimeout(()=>{ let ord = orders.find(o => o.id === orderId); if(ord && ord.status === "Delivered"){ ord.status = "Completed"; let seller = sellers.find(s => s.id == ord.sellerId); if(seller){ let sellerEarning = ord.basePrice - ord.commission - MAINTENANCE_FEE; seller.earnings = (seller.earnings||0) + (sellerEarning * ord.qty); saveAllLocal(); showToast(`Payment released to seller`,false); if(currentSeller) renderSellerDashboard(); } } },5000); } else showToast("Order not shipped yet",true); }
function cancelOrder(orderId){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Processing"){ let prod = products.find(p => p.name === order.productName && p.sellerId === order.sellerId); if(prod){ prod.stock += order.qty; saveAllLocal(); } order.status = "Cancelled"; saveAllLocal(); showToast("Order cancelled successfully",false); renderBuyerOrders(); renderProducts(); addNotification(`Order ${order.trackingNumber} cancelled`,'order'); if(currentSeller) renderSellerDashboard(); } else { showToast("Only orders in 'Processing' status can be cancelled",true); } }
function markOrderShipped(orderId, trackingNum){ let order = orders.find(o => o.id === orderId); if(order && order.status === "Processing"){ order.status = "Shipped"; order.trackingInfo = { trackingNumber: trackingNum }; saveAllLocal(); showToast(`Order Shipped! Tracking: ${trackingNum}`,false); renderSellerDashboard(); renderBuyerOrders(); addNotification(`Your order ${order.trackingNumber} shipped`,'order'); } }
function requestWithdrawal(sellerId){ let seller = sellers.find(s => s.id == sellerId); if(seller && seller.earnings > 0){ let newWithdrawal = { id: Date.now(), sellerId: seller.id, sellerName: seller.shopName, amount: seller.earnings, date: new Date().toLocaleString(), status: "Pending" }; pendingWithdrawals.push(newWithdrawal); seller.earnings = 0; saveAllLocal(); showToast("Withdrawal request submitted",false); renderSellerDashboard(); sendTelegramMessage(`💰 Withdrawal Request: ${seller.shopName} - ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`); addNotification(`Withdrawal request for ${getCurrencySymbol()}${convertPrice(newWithdrawal.amount)}`,'payment'); } else showToast("No balance",true); }
function processWeeklyWithdrawals(){ let last = localStorage.getItem('gb_last_withdrawal'); let now = new Date(); let day = now.getDay(); if((day===1||day===5) && (!last || new Date(last).getDate() !== now.getDate())){ pendingWithdrawals.forEach(w => { if(w.status === "Pending") w.status = "Approved"; }); saveAllLocal(); localStorage.setItem('gb_last_withdrawal', now.toString()); } }
setInterval(processWeeklyWithdrawals, 3600000); processWeeklyWithdrawals();

// ============================================================
// SELLER REGISTRATION
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
// MY SHOP LOGIN
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
    
    const email = user.email;
    const password = prompt("Enter your password to access your shop:");
    if (!password) return;
    
    try {
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
// NOTIFICATION BADGE
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
        const pendingOrders = orders.filter(o => o.sellerId === currentSeller.sellerId && o.status === 'Processing');
        if (pendingOrders.length > 0) {
            badge.textContent = pendingOrders.length;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    } else {
        badge.style.display = 'none';
    }
}

// ============================================================
// SELLER DASHBOARD
// ============================================================
function renderSellerDashboard(){
    if(!currentSeller?.sellerId) return;
    let seller = sellers.find(s => s.id === currentSeller.sellerId);
    if(!seller) return;
    
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
    let totalSales = 0, totalOrders = myOrders.length;
    let pendingOrders = myOrders.filter(o => o.status === 'Processing');
    let monthlyRevenue = {};
    myOrders.forEach(o => { 
        if(o.status === "Completed"){ 
            let netRevenue = (o.basePrice - (o.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * o.qty;
            totalSales += netRevenue; 
            let date = new Date(o.date); 
            let my = `${date.getMonth()+1}/${date.getFullYear()}`; 
            monthlyRevenue[my] = (monthlyRevenue[my]||0) + netRevenue; 
        } 
    });
    
    let chartLabels = Object.keys(monthlyRevenue), chartData = Object.values(monthlyRevenue); 
    if(chartLabels.length === 0){ chartLabels = ["No Data"]; chartData = [0]; }
    
    let kycClass = seller.kycStatus === "pending" ? "kyc-pending" : (seller.kycStatus === "verified" ? "kyc-verified" : "kyc-rejected");
    let kycText = seller.kycStatus === "pending" ? "⏳ KYC Pending - Wait for Admin" : (seller.kycStatus === "verified" ? "✅ KYC Verified" : "❌ KYC Rejected");
    let topProducts = {}; 
    myOrders.forEach(o => { topProducts[o.productName] = (topProducts[o.productName]||0) + o.qty; }); 
    let topList = Object.entries(topProducts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    
    let prodListHtml = myProducts.map(p => `<div class="flex-between"><span><img src="${p.mainImage}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;"> ${p.name} - ${getCurrencySymbol()}${convertPrice(p.price)} (Stock: ${p.stock})<br><small style="color:#64748b;">Shipping: SA:${p.Shipping_SA||0} GCC:${p.Shipping_GCC||0} Intl:${p.Shipping_International||0}</small></span><button class="editProdBtn" data-id="${p.id}" style="background:#3b82f6;border:none;padding:4px 12px;border-radius:20px;">✏️ Edit</button><button class="delProd" data-id="${p.id}" style="background:#dc2626;border:none;padding:4px 12px;border-radius:20px;">Delete</button></div>`).join('');
    
    let ordersHtml = '';
    if (pendingOrders.length > 0) {
        ordersHtml += `<h4 style="margin:10px 0; color:#dc2626;">🔴 Pending Approval (${pendingOrders.length})</h4>`;
        ordersHtml += pendingOrders.map(o => `
            <div class="order-card" style="border-left-color:#dc2626;">
                <div style="display:flex; align-items:center; gap:10px; margin:8px 0;">
                    ${o.productDetails?.image ? `<img src="${o.productDetails.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">` : ''}
                    <div style="flex:1;">
                        <strong>${o.productDetails?.name || o.productName}</strong>
                        <br><span style="font-size:12px; color:#64748b;">Qty: ${o.qty}</span>
                        <br><span style="font-size:12px; color:#64748b;">Buyer: ${o.buyerName}</span>
                        <br><span style="font-size:13px; font-weight:bold; color:#10b981;">Net Revenue: ${getCurrencySymbol()}${convertPrice((o.basePrice - (o.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * o.qty)}</span>
                    </div>
                </div>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button class="confirmStockBtn" data-id="${o.id}" style="background:#10b981; color:white; border:none; padding:6px 16px; border-radius:20px; cursor:pointer; font-weight:600;">
                        ✅ YES (Confirm Stock)
                    </button>
                    <button class="rejectOrderBtn" data-id="${o.id}" style="background:#dc2626; color:white; border:none; padding:6px 16px; border-radius:20px; cursor:pointer; font-weight:600;">
                        ❌ NO (Reject/Remove)
                    </button>
                </div>
                <div style="font-size:10px; color:#94a3b8; margin-top:4px;">${o.date}</div>
            </div>
        `).join('');
    }
    
    let completedOrders = myOrders.filter(o => o.status !== 'Processing');
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
    
    if (myOrders.length === 0) {
        ordersHtml = '<p style="text-align:center;padding:20px;color:#64748b;">No orders yet.</p>';
    }
    
    const categoryOptions = FIXED_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    let sellerDashboardHtml = `
<div class="premium-card"><div><img src="${seller.avatar}" class="seller-avatar"><h3>${seller.shopName}</h3><p>${seller.fullName}<br>📞 ${seller.phone}<br>📧 ${seller.email}<br>📍 ${seller.city}, ${seller.country}</p></div><div><span class="kyc-status ${kycClass}">${kycText}</span></div>
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
        <div style="font-size:24px; font-weight:800; color:#d97706;">${pendingOrders.length}</div>
        <div style="font-size:12px; color:#64748b;">⏳ Pending</div>
    </div>
</div>
<div style="margin-top:12px;">🏦 Balance: ${getCurrencySymbol()}${convertPrice(seller.earnings)}</div><button id="withdrawBtn" class="btn-primary" style="background:#10b981;">💸 Withdraw</button></div>
<div class="chart-container"><h3>📊 Revenue</h3><canvas id="revenueChart"></canvas></div>
<div class="premium-card"><h3>📈 Top Products</h3>${topList.map(p=>`${p[0]}: ${p[1]} sold`).join('<br>') || 'No sales'}</div>
<div class="premium-card"><h3>➕ Add Product</h3>
    <input type="text" id="prodName" placeholder="Product Name" class="input" required>
    <input type="number" id="prodPrice" placeholder="Price (USD)" class="input" required>
    <select id="prodCat" class="input" required>
        <option value="">Select Category</option>
        ${categoryOptions}
    </select>
    <input type="number" id="prodStock" placeholder="Stock Quantity" class="input" required>
    
    <div style="background:#f1f5f9; padding:16px; border-radius:16px; margin-top:12px; border:2px solid #10b981;">
        <h4 style="margin-bottom:10px; color:#10b981;">✈️ Set Your Shipping Rates</h4>
        <p style="font-size:13px; color:#64748b; margin-bottom:12px;">
            💡 Enter shipping rates for each region. Leave 0 if not available.
        </p>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
            <div>
                <label style="font-size:13px; font-weight:600;">🇸🇦 Saudi Arabia</label>
                <input type="number" id="shippingSA" placeholder="e.g., 25" class="input" step="0.01" min="0">
            </div>
            <div>
                <label style="font-size:13px; font-weight:600;">🇦🇪 GCC Countries</label>
                <input type="number" id="shippingGCC" placeholder="e.g., 35" class="input" step="0.01" min="0">
            </div>
            <div>
                <label style="font-size:13px; font-weight:600;">🌍 International</label>
                <input type="number" id="shippingInternational" placeholder="e.g., 50" class="input" step="0.01" min="0">
            </div>
        </div>
        <p style="font-size:12px; color:#ef4444; margin-top:8px;">
            ⚠️ <strong>Important:</strong> Set at least one shipping rate. If 0, shipping will be unavailable for that region.
        </p>
    </div>
    
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
<div class="premium-card"><h3>📋 My Products (${myProducts.length})</h3><div id="myProductsList">${prodListHtml}</div></div>
<div class="premium-card"><h3>📦 Orders</h3><div id="ordersList">${ordersHtml}</div></div>
`;
    document.getElementById('sellerDashboard').innerHTML = sellerDashboardHtml;
    let ctx = document.getElementById('revenueChart')?.getContext('2d'); if(ctx){ if(sellerRevenueChart) sellerRevenueChart.destroy(); sellerRevenueChart = new Chart(ctx, { type: 'bar', data: { labels: chartLabels, datasets: [{ label: 'Revenue', data: chartData.map(v => parseFloat(convertPrice(v))), backgroundColor: '#3b82f6' }] } }); }
    
    if (currentSeller?.sellerId) {
        db.collection("orders").where("sellerId", "==", currentSeller.sellerId).onSnapshot(snapshot => {
            let realTimeOrders = [];
            snapshot.forEach(doc => { realTimeOrders.push({ id: doc.id, ...doc.data() }); });
            const ordersContainer = document.getElementById('ordersList');
            if (ordersContainer) {
                let pending = realTimeOrders.filter(o => o.status === 'Processing');
                let completed = realTimeOrders.filter(o => o.status !== 'Processing');
                let html = '';
                
                if (pending.length > 0) {
                    html += `<h4 style="margin:10px 0; color:#dc2626;">🔴 Pending Approval (${pending.length})</h4>`;
                    html += pending.map(o => `
                        <div class="order-card" style="border-left-color:#dc2626;">
                            <div style="display:flex; align-items:center; gap:10px; margin:8px 0;">
                                ${o.productDetails?.image ? `<img src="${o.productDetails.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;">` : ''}
                                <div style="flex:1;">
                                    <strong>${o.productDetails?.name || o.productName}</strong>
                                    <br><span style="font-size:12px; color:#64748b;">Qty: ${o.qty}</span>
                                    <br><span style="font-size:12px; color:#64748b;">Buyer: ${o.buyerName}</span>
                                    <br><span style="font-size:13px; font-weight:bold; color:#10b981;">Net Revenue: ${getCurrencySymbol()}${convertPrice((o.basePrice - (o.basePrice * PLATFORM_COMMISSION) - MAINTENANCE_FEE) * o.qty)}</span>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px; margin-top:8px;">
                                <button class="confirmStockBtn" data-id="${o.id}" style="background:#10b981; color:white; border:none; padding:6px 16px; border-radius:20px; cursor:pointer; font-weight:600;">
                                    ✅ YES (Confirm Stock)
                                </button>
                                <button class="rejectOrderBtn" data-id="${o.id}" style="background:#dc2626; color:white; border:none; padding:6px 16px; border-radius:20px; cursor:pointer; font-weight:600;">
                                    ❌ NO (Reject/Remove)
                                </button>
                            </div>
                            <div style="font-size:10px; color:#94a3b8; margin-top:4px;">${o.date}</div>
                        </div>
                    `).join('');
                }
                
                if (completed.length > 0) {
                    html += `<h4 style="margin:15px 0; color:#10b981;">✅ Completed Orders (${completed.length})</h4>`;
                    html += completed.map(o => `
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
                
                if (realTimeOrders.length === 0) {
                    html = '<p style="text-align:center;padding:20px;color:#64748b;">No orders yet.</p>';
                }
                
                ordersContainer.innerHTML = html;
                
                document.querySelectorAll('.confirmStockBtn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        confirmOrderStock(this.dataset.id);
                    });
                });
                document.querySelectorAll('.rejectOrderBtn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        rejectOrder(this.dataset.id);
                    });
                });
                
                updateMyShopBadge();
            }
        }, error => {
            console.error('Real-time orders error:', error);
        });
    }
    
    // PUBLISH BUTTON
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
            if (!cat) { showToast("Please select a category", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            if (!FIXED_CATEGORIES.includes(cat)) { showToast("Invalid category selected", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            const mainFile = document.getElementById('prodMainImg').files[0];
            if (!mainFile) { showToast("Main image required", true); btn.disabled = false; btn.textContent = '📢 Publish'; return; }
            
            // Get shipping rates
            const shippingSA = parseFloat(document.getElementById('shippingSA').value) || 0;
            const shippingGCC = parseFloat(document.getElementById('shippingGCC').value) || 0;
            const shippingInternational = parseFloat(document.getElementById('shippingInternational').value) || 0;
            
            if (shippingSA === 0 && shippingGCC === 0 && shippingInternational === 0) {
                showToast("⚠️ Please set at least one shipping rate!", true);
                btn.disabled = false;
                btn.textContent = '📢 Publish';
                return;
            }
            
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
                createdAt: new Date().toISOString(),
                Shipping_SA: shippingSA,
                Shipping_GCC: shippingGCC,
                Shipping_International: shippingInternational
            };
            await db.collection("products").add(newProduct);
            showToast("✅ Product published with shipping rates!", false);
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
            document.getElementById('shippingSA').value = '';
            document.getElementById('shippingGCC').value = '';
            document.getElementById('shippingInternational').value = '';
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
    document.querySelectorAll('.editProdBtn').forEach(btn => btn.addEventListener('click', () => { 
        let prod = products.find(p => p.id == btn.dataset.id); 
        if(prod){
            document.getElementById('editProdId').value = prod.id; 
            document.getElementById('editProdName').value = prod.name; 
            document.getElementById('editProdPrice').value = prod.price; 
            document.getElementById('editProdCat').value = prod.category; 
            document.getElementById('editProdStock').value = prod.stock; 
            document.getElementById('editProdDesc').value = prod.description || '';
            document.getElementById('editShippingSA').value = prod.Shipping_SA || 0;
            document.getElementById('editShippingGCC').value = prod.Shipping_GCC || 0;
            document.getElementById('editShippingInternational').value = prod.Shipping_International || 0;
            let currImgHtml = prod.images.map(img => `<div><img src="${img}" width="50" style="border-radius:8px; margin:4px;"> <a href="${img}" target="_blank">View</a></div>`).join(''); 
            document.getElementById('editCurrentImages').innerHTML = `<strong>Current Images:</strong>${currImgHtml}`; 
            document.getElementById('editProductModal').style.display = 'block'; 
        } 
    }));
    document.getElementById('withdrawBtn')?.addEventListener('click', () => requestWithdrawal(seller.id));
    
    updateMyShopBadge();
}

// ============================================================
// UPDATE PRODUCT
// ============================================================
document.getElementById('updateProductBtn')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = '⏳ Updating...';
    try {
        let pid = document.getElementById('editProdId').value;
        let prodRef = db.collection("products").doc(pid);
        let updates = { 
            name: document.getElementById('editProdName').value, 
            price: parseFloat(document.getElementById('editProdPrice').value), 
            category: document.getElementById('editProdCat').value, 
            stock: parseInt(document.getElementById('editProdStock').value), 
            description: document.getElementById('editProdDesc').value,
            Shipping_SA: parseFloat(document.getElementById('editShippingSA').value) || 0,
            Shipping_GCC: parseFloat(document.getElementById('editShippingGCC').value) || 0,
            Shipping_International: parseFloat(document.getElementById('editShippingInternational').value) || 0
        };
        let newMain = document.getElementById('editMainImg').files[0];
        if(newMain){ let mainUrl = await uploadCompressedImage(newMain); if(mainUrl){ updates.mainImage = mainUrl; updates.images = [mainUrl, ...(updates.images || [])]; } }
        let newExtra = document.getElementById('editExtraImgs').files;
        if(newExtra.length > 0){ let extraUrls = []; for(let i=0;i<Math.min(newExtra.length,4);i++){ let url = await uploadCompressedImage(newExtra[i]); if(url) extraUrls.push(url); } if(extraUrls.length) updates.images = [updates.mainImage || (await prodRef.get()).data().mainImage, ...extraUrls]; }
        await prodRef.update(updates);
        renderSellerDashboard(); renderProducts(); showToast("Product updated with shipping rates", false); document.getElementById('editProductModal').style.display = 'none';
        btn.disabled = false;
        btn.textContent = '💾 Update Product';
    } catch (error) {
        showToast("Update failed: " + error.message, true);
        btn.disabled = false;
        btn.textContent = '💾 Update Product';
    }
});

// ============================================================
// EMBEDDED ACTIONS
// ============================================================
async function confirmOrderStock(orderId) {
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
            await db.collection("sellers").doc(seller.id).update({
                earnings: seller.earnings,
                totalSales: (seller.totalSales || 0) + order.qty
            });
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

async function rejectOrder(orderId) {
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
            await db.collection("products").doc(product.id).update({
                stock: product.stock
            });
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
// TERMS, PRIVACY, SUPPORT
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

// ============================================================
// RESTOCK POPUP
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
        renderSellerDashboard();
        updateMyShopBadge();
    } catch (error) {
        console.error('Restock error:', error);
        showToast('Failed to restock: ' + error.message, true);
    }
});

document.getElementById('confirmNoBtn')?.addEventListener('click', async function() {
    if (!pendingConfirmationProduct) return;
    
    if (confirm('⚠️ Are you sure you want to permanently delete this product?')) {
        try {
            await db.collection('products').doc(pendingConfirmationProduct).delete();
            showToast('🗑️ Product deleted successfully!', false);
            addNotification('Product deleted by seller', 'info');
            hideInventoryConfirmModal();
            renderProducts();
            renderSellerDashboard();
            updateMyShopBadge();
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete: ' + error.message, true);
        }
    }
});

// ============================================================
// NAVIGATION & UTILITIES
// ============================================================
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
initializeDatabase().then(() => {
    console.log('Database ready');
}).catch(err => {
    console.error('Init error:', err);
});

setInterval(updateMyShopBadge, 5000);

renderCats(); updateCartUI(); updateNotificationUI(); updateAdminPendingBadge(); updateAdminMenuBadges();
updateMyShopBadge();
updateCategorySelect();
document.getElementById('debugMsg').innerHTML = "GlobalBazaar Ready | Firebase Shipping | No API";

// Setup confirm delivery button
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Loaded - Setting up Confirm Delivery Button');
    setupConfirmDeliveryButton();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📄 DOM Already Ready - Setting up Confirm Delivery Button');
    setupConfirmDeliveryButton();
}

console.log('🚀 ========================================');
console.log('🚀 GLOBAL BAZAAR - COMPLETE CODE');
console.log('🚀 ========================================');
console.log('✅ EASYSHIP API REMOVED - REPLACED WITH FIREBASE');
console.log('✅ All features working - Dashboard, Products, etc.');
console.log('✅ Seller sets their own shipping rates');
console.log('🚀 ========================================');
