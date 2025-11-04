import { products } from './mock-data.js';

if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Products initialized in localStorage.');
} else {
    console.log('Products already exist in localStorage.');
}

let localAccounts = JSON.parse(localStorage.getItem('accounts')) || [];

if (localAccounts.length === 0) {
    localAccounts = defaultAccounts;
    localStorage.setItem('accounts', JSON.stringify(localAccounts));
} else {
    let accountsUpdated = false;
    localAccounts = localAccounts.map(acc => {
        const defaultAcc = defaultAccounts.find(a => a.email === acc.email);
        if (defaultAcc) {
            const mergedAccount = { ...defaultAcc, ...acc };
            if (JSON.stringify(mergedAccount) !== JSON.stringify(acc)) {
                accountsUpdated = true;
            }
            return mergedAccount;
        }
        return acc;
    });

    if (accountsUpdated) {
        localStorage.setItem('accounts', JSON.stringify(localAccounts));
        console.log('Accounts updated with missing fields.');
    }
}

///update profile image
async function updateProfileImage() {
    const profileLogo = document.querySelector('.profile-img');

    if (!profileLogo) return;

    const token = getAuthToken();

    // Nếu không có token, dùng ảnh mặc định
    if (!token) {
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Guest profile";
        return;
    }

    try {
        // Fetch user profile với token
        const response = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.user) {
            // Cập nhật localStorage với thông tin đầy đủ
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.user_id,
                name: data.user.user_full_name,
                email: data.user.account.user_email,
                profileImg: data.user.profile_user_image,
                DOB: data.user.DOB,
                gender: data.user.gender,
                phoneNumber: data.user.phone_number,
                home: data.user.home_address,
                office: data.user.office_address
            }));

            // Cập nhật ảnh profile
            if (data.user.profile_user_image) {
                profileLogo.src = data.user.profile_user_image;
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            } else {
                profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            }
        } else {
            // Token không hợp lệ
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
            profileLogo.alt = "Guest profile";
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Default profile";
    }
}

function getAuthToken () {
    return localStorage.getItem('authToken');
}

function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

/// update menu dropdown
async function updateProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');

    if (!dropdown) return;
    const token = getAuthToken();

    if (!token) {
        dropdown.innerHTML = `
        <ul>
            <li><a href="../index.html">HOME</a></li>
            <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
            <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
            <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
            <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
        </ul>
    `;
        return;
    }
    try {
        // fetch users profile
        const response = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.user) {
            /// CẬP NHẬT localStorage với thông tin user đầy đủ
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.user.user_id,
                name: data.user.user_full_name,
                email: data.user.account.user_email,
                profileImg: data.user.profile_user_image,
                DOB: data.user.DOB,
                gender: data.user.gender,
                phoneNumber: data.user.phone_number,
                home: data.user.home_address,
                office: data.user.office_address
            }));

            dropdown.innerHTML = `
            <ul>
                <li class="user-greeting">
                    <a href="#" onclick="goToProfile()" style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; cursor: pointer;">
                        ${data.user.user_full_name}
                    </a>
                </li>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="#" class="logout-btn" onclick="handleLogout()">LOGOUT</a></li>
            </ul>
        `;
        } else {
            console.log('Token invalid or expired');
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            
            dropdown.innerHTML = `
            <ul>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
            </ul>
            `;
        }
    } catch (error) {
        console.error('Error updating dropdown:', error);
        // Show guest menu on error
        dropdown.innerHTML = `
        <ul>
            <li><a href="../index.html">HOME</a></li>
            <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
            <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
            <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
            <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
        </ul>
    `;
    }
}

/// Profile Info 
function goToProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Get current page path to determine correct relative path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/ProfileInfo/')) {
            window.location.href = '../LoginPage/login-page.html';
        } else if (currentPath.includes('index.html') || currentPath === '/') {
            window.location.href = './LoginPage/login-page.html';
        } else {
            window.location.href = '../LoginPage/login-page.html';
        }
        return;
    }

    // Navigate to profile page based on current location
    const currentPath = window.location.pathname;
    if (currentPath.includes('/ProfileInfo/')) {
        window.location.reload();
    } else if (currentPath.includes('index.html') || currentPath === '/') {
        window.location.href = './ProfileInfo/profile-info.html';
    } else {
        window.location.href = '../ProfileInfo/profile-info.html';
    }
}

/// Log out 
async function handleLogout() {

    try {
        // Gọi API logout với token
        const response = await fetch('http://localhost:3000/api/account/logout', {
            method: 'GET',
            headers: getAuthHeaders(), 
            credentials: 'include'
        });

        if (response.ok) {
            console.log('Logout successful');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    updateProfileImage();
    updateProfileDropdown();

    // Navigate to home page after logout based on current location
    const currentPath = window.location.pathname;
    if (currentPath.includes('index.html') || currentPath === '/') {
        window.location.reload();
    } else if (currentPath.includes('/ProfileInfo/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = '../index.html';
    }
}


// Helper functions for localStorage management
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

// Get cart data from localStorage
function getCartFromStorage() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    return getFromStorage(cartKey, []);
}

// Updated cart badge function that reads from localStorage
function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        const cartData = getCartFromStorage();

        const totalItems = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            badge.style.cssText = `
            position: absolute;
            top: -2px;
            right: -8px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }
    }
}

// Function to refresh cart badge (useful for calling from other pages)
function refreshCartBadge() {
    updateCartBadge();
}

// Listen for storage changes (when cart is updated in other tabs)
window.addEventListener('storage', function (e) {
    // Check if a cart-related key was changed
    if (e.key && (e.key.includes('cart_of_') || e.key === 'cart_guest')) {
        updateCartBadge();
    }
});

// Listen for custom cart update events
window.addEventListener('cartUpdated', function () {
    updateCartBadge();
});

// Function to trigger cart update event (call this when cart changes)
function triggerCartUpdate() {
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
}

// Initialize cart badge when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        updateProfileImage();
        updateProfileDropdown();
        updateCartBadge();
    }, 100);
});

// Make functions available globally
window.updateCartBadge = updateCartBadge;
window.refreshCartBadge = refreshCartBadge;
window.triggerCartUpdate = triggerCartUpdate;
window.getCartFromStorage = getCartFromStorage;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;
window.getAuthToken = getAuthToken;
window.getAuthHeaders = getAuthHeaders;
