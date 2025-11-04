// Helper functions
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
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

// URL parameter helper
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Tab switching functions
function switchToTab(tabName) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    const targetNavLink = document.querySelector(`.nav-link[data-tab="${tabName}"]`);
    const targetTabContent = document.getElementById(tabName);
    
    if (targetNavLink && targetTabContent) {
        targetNavLink.classList.add('active');
        targetTabContent.classList.add('active');
        targetTabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
    }
    return false;
}

function initializeTabSwitching() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    const tabParam = getURLParameter('tab');
    if (tabParam) {
        setTimeout(() => {
            switchToTab(tabParam);
        }, 100);
    }
}

// Update profile image from backend
async function updateProfileImage() {
    const profileLogo = document.querySelector('.profile-img');
    if (!profileLogo) return;

    const token = getAuthToken();
    if (!token) {
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Guest profile";
        window.location.href = '../LoginPage/login-page.html';
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

        if (response.ok && data.user) {
            if (data.user.profile_user_image) {
                profileLogo.src = data.user.profile_user_image;
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            } else {
                profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
                profileLogo.alt = `${data.user.user_full_name}'s profile`;
            }
        } else {
            localStorage.removeItem('authToken');
            profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
            profileLogo.alt = "Guest profile";
            window.location.href = '../LoginPage/login-page.html';
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
        profileLogo.src = "https://www.svgrepo.com/show/343494/profile-user-account.svg";
        profileLogo.alt = "Default profile";
    }
}

// Update dropdown menu
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
    }
}

// Navigate to profile
async function goToProfile() {
    const token = getAuthToken();
    
    if (!token) {
        alert('Please login to view your profile');
        window.location.href = '../LoginPage/login-page.html';
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
            window.location.href = '../ProfileInfo/profile-info.html';
        } else {
            localStorage.removeItem('authToken');
            alert('Please login to view your profile');
            window.location.href = '../LoginPage/login-page.html';
        }
    } catch (error) {
        alert('Unable to verify authentication. Please login.');
        window.location.href = '../LoginPage/login-page.html';
    }
}

// Logout function
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
    console.log('User logged out');
    window.location.href = '../index.html';
}

// Load and display user profile from backend
async function updateProfileInformation() {
    const profileContainer = document.getElementById('profile-container');
    if (!profileContainer) return;

    const token = getAuthToken();
    if (!token) {
        window.location.href = '../LoginPage/login-page.html';
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

        if (!response.ok || !data.user) {
            localStorage.removeItem('authToken');
            window.location.href = '../LoginPage/login-page.html';
            return;
        }

        const user = data.user;
        const account = user.account;

        profileContainer.innerHTML = `
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="profile-header">
                    <h1 class="profile-title">Profile</h1>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="${user.profile_user_image || 'https://www.svgrepo.com/show/343494/profile-user-account.svg'}" alt="${user.user_full_name || account.account_name}" class="main-image" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
                        </div>
                        <div class="user-details">
                            <h3>Hello</h3>
                            <div class="user-name">${user.user_full_name || account.account_name}</div>
                        </div>
                    </div>
                </div>
                
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link active" data-tab="account">
                            <i class="fa-solid fa-user"></i>
                            My Account
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-tab="addresses">
                            <i class="fa-solid fa-map-marker-alt"></i>
                            Addresses
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-tab="orders">
                            <i class="fa-solid fa-box"></i>
                            My Orders
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-tab="notifications">
                            <i class="fa-solid fa-bell"></i>
                            Notifications
                        </a>
                    </li>
                </ul>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Account Tab -->
                <div id="account" class="tab-content active">
                    <div class="content-header">
                        <h2 class="content-title">Personal Information</h2>
                        <button class="change-info-btn" onclick="handleEditProfile()">
                            <i class="fa-solid fa-edit"></i>
                            Change Profile Information
                        </button>
                    </div>

                    <div class="profile-content">
                        <div class="profile-image-section">
                            <div class="profile-image">
                                <img src="${user.profile_user_image || 'https://www.svgrepo.com/show/343494/profile-user-account.svg'}" alt="${user.user_full_name || account.account_name}" class="main-image" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">
                                <div class="edit-icon" onclick="handleImageUpload()">
                                    <i class="fa-solid fa-edit"></i>
                                </div>
                            </div>
                        </div>

                        <div class="profile-info">
                            <form id="profile-form">
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" id="fullName" class="form-input" value="${user.user_full_name || ''}" readonly>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Date Of Birth</label>
                                    <input type="date" id="dob" class="form-input" value="${user.DOB || ''}" readonly>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Gender</label>
                                    <div class="gender-options">
                                        <div class="gender-option">
                                            <div class="radio-input ${user.gender === 'Male' ? 'checked' : ''}" data-value="Male"></div>
                                            <span class="gender-label">Male</span>
                                        </div>
                                        <div class="gender-option">
                                            <div class="radio-input ${user.gender === 'Female' ? 'checked' : ''}" data-value="Female"></div>
                                            <span class="gender-label">Female</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Phone Number</label>
                                    <input type="tel" id="phoneNumber" class="form-input" value="${user.phone_number || ''}" readonly>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-input" value="${account.user_email}" readonly>
                                </div>

                                <button type="button" class="save-btn" onclick="handleSaveProfile()" style="display: none;">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Addresses Tab -->
                <div id="addresses" class="tab-content">
                    <div class="content-header">
                        <h2 class="content-title">My Addresses</h2>
                    </div>

                    <div class="address-grid">
                        <div class="address-card default">
                            <div class="address-type">
                                <i class="fa-solid fa-home"></i>
                                Home
                            </div>
                            <div class="address-details">
                                ${user.user_full_name || account.account_name}<br>
                                ${user.home_address || 'No address specified'}
                            </div>
                        </div>

                        <div class="address-card">
                            <div class="address-type">
                                <i class="fa-solid fa-building"></i>
                                Office
                            </div>
                            <div class="address-details">
                                ${user.user_full_name || account.account_name}<br>
                                ${user.office_address || 'No office address specified'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Tab -->
                <div id="orders" class="tab-content">
                    <div class="content-header">
                        <h2 class="content-title">My Orders</h2>
                    </div>
                    <div class="empty-state">
                        <i class="fa-solid fa-box" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                        <h3 style="color: #666; margin-bottom: 0.5rem;">No orders yet</h3>
                        <p style="color: #999; margin-bottom: 2rem;">Your order history will appear here once you make a purchase</p>
                        <a href="../ShopPage/shop-page.html" class="primary-btn" style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 600;">
                            <i class="fa-solid fa-shopping-bag"></i>
                            Start Shopping
                        </a>
                    </div>
                </div>

                <!-- Notifications Tab -->
                <div id="notifications" class="tab-content">
                    <div class="content-header">
                        <h2 class="content-title">Notification Preferences</h2>
                    </div>
                    <div style="padding: 20px 0;">
                        <div class="form-group">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <div>
                                    <h4 style="color: #333; margin-bottom: 5px;">Email Notifications</h4>
                                    <p style="color: #666; font-size: 14px;">Get notified about orders, promotions, and updates</p>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `;

        // Initialize gender selection
        setupGenderSelection();

    } catch (error) {
        console.error('Error loading profile:', error);
        localStorage.removeItem('authToken');
        window.location.href = '../LoginPage/login-page.html';
    }
}

// Handle profile editing
function handleEditProfile() {
    const inputs = document.querySelectorAll('#account .form-input');
    const saveBtn = document.querySelector('#account .save-btn');
    const changeBtn = document.querySelector('.change-info-btn');
    
    if (changeBtn.textContent.includes('Change')) {
        inputs.forEach(input => {
            if (input.type !== 'email') {
                input.removeAttribute('readonly');
                input.style.background = 'white';
            }
        });
        saveBtn.style.display = 'inline-block';
        changeBtn.innerHTML = '<i class="fa-solid fa-times"></i> Cancel';
    } else {
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            input.style.background = '#f8f9fa';
        });
        saveBtn.style.display = 'none';
        changeBtn.innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
        updateProfileInformation(); // Reload data
    }
}

// Setup gender selection
function setupGenderSelection() {
    document.querySelectorAll('.gender-option').forEach(option => {
        option.addEventListener('click', function() {
            const saveBtn = document.querySelector('#account .save-btn');
            if (saveBtn && window.getComputedStyle(saveBtn).display === 'none') {
                return; // Not in edit mode
            }

            const parent = this.parentElement;
            parent.querySelectorAll('.radio-input').forEach(radio => {
                radio.classList.remove('checked');
            });
            this.querySelector('.radio-input').classList.add('checked');
        });
    });
}

// Save profile changes
async function handleSaveProfile() {
    const token = getAuthToken();
    if (!token) {
        alert('Please login again');
        window.location.href = '../LoginPage/login-page.html';
        return;
    }

    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const selectedGender = document.querySelector('.gender-option .radio-input.checked');
    const gender = selectedGender ? selectedGender.getAttribute('data-value') : null;

    try {
        // Get user ID first
        const profileResponse = await fetch('http://localhost:3000/api/users/getProfile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const profileData = await profileResponse.json();
        if (!profileData.user) {
            alert('Unable to load user profile');
            return;
        }

        const userId = profileData.user.user_id;

        // Update user information
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                user_full_name: fullName,
                DOB: dob,
                phone_number: phoneNumber,
                gender: gender
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Profile updated successfully!');
            
            // Reset form to readonly state
            const inputs = document.querySelectorAll('#account .form-input');
            inputs.forEach(input => {
                input.setAttribute('readonly', true);
                input.style.background = '#f8f9fa';
            });
            
            document.querySelector('#account .save-btn').style.display = 'none';
            document.querySelector('.change-info-btn').innerHTML = '<i class="fa-solid fa-edit"></i> Change Profile Information';
            
            // Reload profile data
            await updateProfileInformation();
        } else {
            alert(result.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Handle image upload
function handleImageUpload() {
    alert('Image upload feature coming soon!');
}

// Dropdown toggle
function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    const profileImg = document.querySelector('.profile-img');
    
    if (dropdown && profileImg && !dropdown.contains(event.target) && !profileImg.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Cart functions
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

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateProfileImage();
    updateProfileDropdown();
    updateProfileInformation();
    updateCartBadge();
    
    setTimeout(() => {
        initializeTabSwitching();
    }, 200);
});

// Make functions global
window.toggleDropdown = toggleDropdown;
window.updateProfileDropdown = updateProfileDropdown;
window.updateProfileImage = updateProfileImage;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.handleEditProfile = handleEditProfile;
window.handleSaveProfile = handleSaveProfile;
window.handleImageUpload = handleImageUpload;
window.switchToTab = switchToTab;
window.updateCartBadge = updateCartBadge;