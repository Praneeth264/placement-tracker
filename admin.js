function displayStudentGoals() {
    const studentGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const goalContainer = document.getElementById('studentGoals');
    goalContainer.innerHTML = '';
    studentGoals.forEach((goal, index) => {
        const goalDiv = document.createElement('div');
        goalDiv.innerText = `Goal ${index + 1}: ${goal.title} | Status: ${goal.completed ? 'Completed' : 'Pending'} | Deadline: ${goal.deadline}`;
        goalContainer.appendChild(goalDiv);
    });
}
// Call the function to display goals on page load
window.onload = displayStudentGoals;