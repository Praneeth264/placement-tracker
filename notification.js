// ✅ Ask once and alert if denied
Notification.requestPermission().then(permission => {
  if (permission !== "granted") {
    alert("Please allow notifications to receive goal deadline alerts.");
  }
});

// ✅ Check every 10 seconds (testing) — use 60000 (1 min) in production
setInterval(() => {
  checkGoalReminders();
}, 10000);

// ✅ Reminder Logic
function checkGoalReminders() {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email;
  if (!currentUser) {
    console.log("⚠️ No user logged in.");
    return;
  }

  let allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};
  let goals = allGoals[currentUser] || [];

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Normalize to midnight

  console.log("📅 Today:", now.toLocaleDateString("en-GB"));
  console.log("🔔 Checking for goals due on:", tomorrow.toDateString());

  let updated = false;

  goals.forEach((goal, index) => {
    if (!goal.deadline || goal.completed || goal.notified) return;

    let goalDate;

    // Parse both formats
    if (goal.deadline.includes("-")) {
      const parts = goal.deadline.trim().split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy-mm-dd
          const [yyyy, mm, dd] = parts;
          goalDate = new Date(`${yyyy}-${mm}-${dd}`);
        } else {
          // dd-mm-yyyy
          const [dd, mm, yyyy] = parts;
          goalDate = new Date(`${yyyy}-${mm}-${dd}`);
        }
        goalDate.setHours(0, 0, 0, 0);
      }
    }

    if (!goalDate || isNaN(goalDate)) {
      console.log(`⚠️ Invalid deadline format for "${goal.title}":`, goal.deadline);
      return;
    }

    console.log(`⏳ Comparing: ${goalDate.toDateString()} === ${tomorrow.toDateString()}`);

    if (goalDate.toDateString() === tomorrow.toDateString()) {
      console.log("✅ MATCH - Sending Notification for:", goal.title);
      sendNotification(`⏰ Reminder: "${goal.title}" is due tomorrow!`);
      goals[index].notified = true;
      updated = true;
    } else {
      console.log(`❌ No match for "${goal.title}"`);
    }
  });

  // Update localStorage with notified flag if needed
  if (updated) {
    allGoals[currentUser] = goals;
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  }
}

// ✅ Notification popup + sound + tab flash
function sendNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("Goal Reminder", { body: message });
  }

  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play().catch(() => {});

  flashTitle(message);
}

// ✅ Flash tab title
let originalTitle = document.title;
let flashing = false;

function flashTitle(message) {
  if (flashing) return;
  flashing = true;
  const interval = setInterval(() => {
    document.title = document.title === originalTitle ? message : originalTitle;
  }, 800);
  setTimeout(() => {
    clearInterval(interval);
    document.title = originalTitle;
    flashing = false;
  }, 10000);
}

window.sendNotification = sendNotification;
