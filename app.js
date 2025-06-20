let users = JSON.parse(localStorage.getItem("users")) || [];

function login() {
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value;

    // ✅ Check for valid email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput)) {
        document.getElementById('message').innerText = "❌ Enter a valid email address.";
        document.getElementById('message').style.color = "red";
        return;
    }

    const user = users.find(u =>
        u.email.trim().toLowerCase() === emailInput &&
        u.password === passwordInput
    );

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (user.role === 'admin') {
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } else {
        document.getElementById('message').innerText = "❌ Invalid credentials.";
        document.getElementById('message').style.color = "red";
    }
}


