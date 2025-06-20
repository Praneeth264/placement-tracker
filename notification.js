/* ── Notification permission handling ───────────────────────────── */
// ✅ Notification permission handling with clickable help
if (Notification.permission === "default") {
  Notification.requestPermission().then(permission => {
    if (permission !== "granted") {
      alert("Please allow notifications in your browser to receive deadline alerts.");
    }
  });
} else if (Notification.permission === "denied") {
  // Create an alert-like div with a help button
  const notifDiv = document.createElement("div");
  notifDiv.style.position = "fixed";
  notifDiv.style.bottom = "20px";
  notifDiv.style.right = "20px";
  notifDiv.style.padding = "15px";
  notifDiv.style.backgroundColor = "#ffdddd";
  notifDiv.style.border = "1px solid red";
  notifDiv.style.borderRadius = "8px";
  notifDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  notifDiv.innerHTML = `
    🔕 <strong>Notifications are blocked.</strong><br>
    Please enable them in your browser settings.<br><br>
    <button id="openSettingsBtn">Click here to fix</button>
  `;
  document.body.appendChild(notifDiv);

  document.getElementById("openSettingsBtn").onclick = () => {
    alert("To enable notifications:\n\n🔐 Click the lock 🔒 icon in the address bar.\n✅ Allow Notifications.");
    notifDiv.remove();
  };
}


/* ── Periodic reminder check ───────────────────────────────────── */

setInterval(checkGoalReminders, 10000); // 10 s for testing; use 60000 in production

function checkGoalReminders() {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"))?.email;
  if (!currentUser) {
    console.log("⚠️ No user logged in.");
    return;
  }

  const allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};
  const goals = allGoals[currentUser] || [];

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // midnight tomorrow

  let updated = false;

  goals.forEach((goal, idx) => {
    if (!goal.deadline || goal.completed || goal.notified) return;

    let goalDate;

    // Accept dd‑mm‑yyyy or yyyy‑mm‑dd
    if (goal.deadline.includes("-")) {
      const parts = goal.deadline.trim().split("-");
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // yyyy‑mm‑dd
          const [yyyy, mm, dd] = parts;
          goalDate = new Date(`${yyyy}-${mm}-${dd}`);
        } else {
          // dd‑mm‑yyyy
          const [dd, mm, yyyy] = parts;
          goalDate = new Date(`${yyyy}-${mm}-${dd}`);
        }
        goalDate.setHours(0, 0, 0, 0);
      }
    }

    if (!goalDate || isNaN(goalDate)) {
      console.log(`⚠️ Invalid deadline for "${goal.title}":`, goal.deadline);
      return;
    }

    if (goalDate.toDateString() === tomorrow.toDateString()) {
      console.log("🔔 Sending notification for:", goal.title);
      sendNotification(`⏰ Reminder: "${goal.title}" is due tomorrow!`);
      goals[idx].notified = true;
      updated = true;
    }
  });

  if (updated) {
    allGoals[currentUser] = goals;
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  }
}

/* ── Notification helper ───────────────────────────────────────── */

function sendNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("Goal Reminder", { body: message });
  }

  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play().catch(() => {});

  flashTitle(message);
}

/* ── Flash tab title helper ────────────────────────────────────── */

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

/* expose for manual testing */
window.sendNotification = sendNotification;
