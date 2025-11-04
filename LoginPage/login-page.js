/// Check login and signup
let isLoginMode = true;

function switchToSignup() {
    if (isLoginMode) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const leftPanel = document.getElementById('leftPanel');

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

        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        leftPanel.classList.remove('signup-mode');
        leftPanel.classList.add('login-mode');

        isLoginMode = true;
    }
}

// Make functions global
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;

// Handle form submissions
document.addEventListener('DOMContentLoaded', function () {

    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmSignupPassword');

    /// Confirm password validation
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

                alert('Login successfully');
                window.location.href = '../index.html';
            } else {
                alert(result.message || 'Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error in login! Please check your connection.');
        }
    });

    // Signup form handler
    document.getElementById('signup-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPasswordValue = document.getElementById('confirmSignupPassword').value;

        if (password === '' || confirmPasswordValue === '') {
            alert('Please enter both password fields.');
            return;
        }

        if (password !== confirmPasswordValue) {
            alert('Passwords do not match. Please enter the same password in both fields.');
            return;
        }

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
                alert(`Account created successfully! Welcome, ${name}!`);
                // Tự động chuyển sang login
                switchToLogin();
                document.getElementById('loginEmail').value = email;
            } else {
                alert(signupResult.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Error during registration! Please check your connection.');
        }
    });
});