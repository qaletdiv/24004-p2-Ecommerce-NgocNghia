// Backend URL configuration
const BACKEND_URL = 'http://localhost:3000';

    // Helper function to get full image URL
    function getImageUrl(imagePath) {
    if (!imagePath) {
        return 'https://www.svgrepo.com/show/343494/profile-user-account.svg';
    }
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
}
/// Update profile image from backend
async function updateProfileImage() {
    const profileLogo = document.querySelector('.profile-img');
    if (!profileLogo) return;

    const token = getAuthToken();
    
    if (!token) {
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Guest profile";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();
        const user = data.user;

        if (response.ok && data.user) {
            if (data.user.profile_user_image) {
                profileLogo.src = getImageUrl(user.profile_user_image);
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            } else {
                profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            }
        } else {
            localStorage.removeItem('authToken');
            profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
            profileLogo.alt = "Guest profile";
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Default profile";
    }
}

function getAuthToken() {
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

/// Update menu dropdown from backend
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
        const response = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        console.log('Profile data:', data); // Add this line
        console.log('User full name:', data.user?.user_full_name);
        if (response.ok && data.user) {
            dropdown.innerHTML = `
            <ul>
                <li class="user-greeting">
                    <a href="#" onclick="goToProfile()" style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; cursor: pointer;">
                        ${data.user.user_full_name || data.user.account.account_name}
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
            localStorage.removeItem('authToken');
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

/// Navigate to profile
async function goToProfile() {
    const token = getAuthToken();
    
    if (!token) {
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

    try {
        const response = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/ProfileInfo/')) {
                window.location.reload();
            } else if (currentPath.includes('index.html') || currentPath === '/') {
                window.location.href = './ProfileInfo/profile-info.html';
            } else {
                window.location.href = '../ProfileInfo/profile-info.html';
            }
        } else {
            localStorage.removeItem('authToken');
            window.location.href = '../LoginPage/login-page.html';
        }
    } catch (error) {
        console.error('Error checking profile:', error);
        window.location.href = '../LoginPage/login-page.html';
    }
}

/// Logout function
async function handleLogout() {
    const token = getAuthToken();

    try {
        if (token) {
            await fetch('http://localhost:3000/api/account/logout', {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include'
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    }

    localStorage.removeItem('authToken');
    
    updateProfileImage();
    updateProfileDropdown();

    const currentPath = window.location.pathname;
    if (currentPath.includes('index.html') || currentPath === '/') {
        window.location.reload();
    } else if (currentPath.includes('/ProfileInfo/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = '../index.html';
    }
}

// Helper function
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

// Cart functions (still use localStorage for cart data)
function getCartFromStorage() {
    return getFromStorage('cart', []);
}

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

function refreshCartBadge() {
    updateCartBadge();
}

function triggerCartUpdate() {
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
}

// Event listeners
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        updateCartBadge();
    }
});

window.addEventListener('cartUpdated', function () {
    updateCartBadge();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        updateProfileImage();
        updateProfileDropdown();
        updateCartBadge();
    }, 100);
});

// Make functions global
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