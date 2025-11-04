/// Check login and signup
let isLoginMode = true;

function switchToSignup() {
    if (isLoginMode) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const leftPanel = document.getElementById('leftPanel');

        /// Login Mode 
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        leftPanel.classList.remove('login-mode');
        leftPanel.classList.add('signup-mode');

        isLoginMode = false;
    }
}

function switchToLogin() {
    if (!isLoginMode) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const leftPanel = document.getElementById('leftPanel');

        /// Sign Up Mode
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        leftPanel.classList.remove('signup-mode');
        leftPanel.classList.add('login-mode');

        isLoginMode = true;
    }
}

// Make functions global so they can be called from HTML
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;

// Handle form submissions
document.addEventListener('DOMContentLoaded', function () {

    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmSignupPassword');

    /// Confirm password
    function validatePasswords() {
        if (confirmPassword.value === '') {
            confirmPassword.style.borderColor = '#e1e5e9';
            return;
        }

        if (signupPassword.value === confirmPassword.value) {
            confirmPassword.style.borderColor = '#28a745';
            confirmPassword.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
        } else {
            confirmPassword.style.borderColor = '#dc3545';
            confirmPassword.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        }
    }

    // Add event listeners for real-time validation
    signupPassword.addEventListener('input', validatePasswords);
    confirmPassword.addEventListener('input', validatePasswords);
    
    // Login form handler
    document.getElementById('login-form-element').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch("http://localhost:3000/api/account/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    "user_email": email,
                    "password": password
                })
            });
            const result = await response.json();

            if (response.ok) {
                // Lưu token
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }

                // Lấy thông tin user profile đầy đủ từ API
                try {
                    const profileResponse = await fetch('http://localhost:3000/api/users/getProfile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${result.token}`
                        },
                        credentials: 'include'
                    });

                    if (profileResponse.ok) {
                        const profileData = await profileResponse.json();
                        
                        // Lưu thông tin user đầy đủ vào localStorage
                        if (profileData.user) {
                            localStorage.setItem('currentUser', JSON.stringify({
                                id: profileData.user.user_id,
                                name: profileData.user.user_full_name,
                                email: profileData.user.account.user_email,
                                profileImg: profileData.user.profile_user_image,
                                DOB: profileData.user.DOB,
                                gender: profileData.user.gender,
                                phoneNumber: profileData.user.phone_number,
                                home: profileData.user.home_address,
                                office: profileData.user.office_address
                            }));
                        }
                    }
                } catch (profileError) {
                    console.error('Error fetching profile:', profileError);
                    // Fallback: lưu thông tin cơ bản từ account
                    if (result.account) {
                        localStorage.setItem('currentUser', JSON.stringify({
                            id: result.account.id,
                            name: result.account.account_name,
                            email: result.account.user_email
                        }));
                    }
                }

                alert('Login successfully');
                window.location.href = '../index.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error in login !!!');
        }
    });

    // Signup form handler
    document.getElementById('signup-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPasswordValue = document.getElementById('confirmSignupPassword').value;

        // Validate that passwords are not empty
        if (password === '' || confirmPasswordValue === '') {
            alert('Please enter both password fields.');
            return;
        }

        // Validate password confirmation for mismatch
        if (password !== confirmPasswordValue) {
            alert('Passwords do not match. Please enter the same password in both fields.');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const signupResponse = await fetch("http://localhost:3000/api/account/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    "user_email": email,
                    "password": password,
                    "account_name": name
                })
            });
            
            const signupResult = await signupResponse.json();

            if (signupResponse.ok) {
                // Sau khi đăng ký thành công, lấy thông tin profile
                if (signupResult.token) {
                    localStorage.setItem('authToken', signupResult.token);

                    try {
                        const profileResponse = await fetch('http://localhost:3000/api/users/getProfile', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${signupResult.token}`
                            },
                            credentials: 'include'
                        });

                        if (profileResponse.ok) {
                            const profileData = await profileResponse.json();
                            
                            if (profileData.user) {
                                localStorage.setItem('currentUser', JSON.stringify({
                                    id: profileData.user.user_id,
                                    name: profileData.user.user_full_name,
                                    email: profileData.user.account.user_email,
                                    profileImg: profileData.user.profile_user_image,
                                    DOB: profileData.user.DOB,
                                    gender: profileData.user.gender,
                                    phoneNumber: profileData.user.phone_number,
                                    home: profileData.user.home_address,
                                    office: profileData.user.office_address
                                }));
                            }
                        }
                    } catch (profileError) {
                        console.error('Error fetching profile after signup:', profileError);
                    }
                }

                alert(`Account created successfully! Welcome, ${name}!`);
                window.location.href = '../index.html';
            } else {
                alert(signupResult.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Error during registration!');
        }
    });
});