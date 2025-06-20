// Get current logged-in user's email
const currentUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email;

if (!currentUser) {
  alert("No user logged in!");
}

// Load goals per user
let allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};
let goals = allGoals[currentUser] || [];

function addGoal() {
  const title = document.getElementById('goalTitle').value;
  const desc = document.getElementById('goalDesc').value;
  const deadline = document.getElementById('goalDeadline').value;
  const time = document.getElementById('goalTime').value;

  if (!title || !desc || !deadline || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const goal = {
    title,
    desc,
    deadline,
    time,
    completed: false
  };

  goals.push(goal);
  allGoals[currentUser] = goals;
  localStorage.setItem("allGoals", JSON.stringify(allGoals));
  displayGoals();
}

function displayGoals() {
  const list = document.getElementById('goalsList');
  list.innerHTML = '';
  goals.forEach((goal, index) => {
    const item = document.createElement('div');
    item.innerText = `Goal ${index + 1}: ${goal.title} > ${goal.desc} > Deadline: ${goal.deadline} > Time: ${goal.time}`;
    list.appendChild(item);
  });
}

// Load goals on page load
window.onload = displayGoals;
