function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (email && password) {
        const newUser  = { email, password, role: 'student' };
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser );
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('regMessage').innerText = "Registration successful! You can now log in.";
    } else {
        document.getElementById('regMessage').innerText = "Please fill in all fields.";
    }
}