let users = JSON.parse(localStorage.getItem("users")) || [];

function login() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value;

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
        document.getElementById('message').innerText = "Invalid credentials!";
        document.getElementById('message').style.color = "red";
    }
}

