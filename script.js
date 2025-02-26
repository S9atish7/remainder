let speakBtn = document.querySelector('.speak-btn');
let textArea = document.querySelector('.enter-text');
let timeInput = document.querySelector('.time-input');
let reminderList = document.querySelector('.reminder-list');

async function fetchReminders() {
    let response = await fetch("http://localhost:4000/reminders");
    let reminders = await response.json();
    displayReminders(reminders);
}

// Function to display reminders
function displayReminders(reminders) {
    reminderList.innerHTML = "";
    reminders.forEach(reminder => {
        let div = document.createElement("div");
        div.textContent = `📌 ${reminder.task} - ⏰ ${reminder.time}`;
        reminderList.appendChild(div);
    });
}

// Function to schedule a reminder
function scheduleReminder(task, time) {
    let taskTime = new Date(time);
    let now = new Date();
    let timeDiff = taskTime - now;

    if (timeDiff > 0) {
        setTimeout(() => {
            sendVoiceMessage(task);
            sendNotification(task);
        }, timeDiff);
    } else {
        alert("Invalid time! Please enter a future time.");
    }
}

// Function to send a voice message
function sendVoiceMessage(task) {
    let speech = new SpeechSynthesisUtterance(`Reminder: ${task}`);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.volume = 1;
    speech.pitch = 1;
    speechSynthesis.speak(speech);
}

// Function to send a browser notification
function sendNotification(task) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", { body: task });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Reminder", { body: task });
            }
        });
    }
}

// Click button to set a task
speakBtn.addEventListener('click', async () => {
    let taskText = textArea.value.trim();
    let taskTime = timeInput.value;

    if (taskText && taskTime) {
        // Send reminder to backend
        await fetch("http://localhost:4000/add-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: taskText, time: taskTime })
        });

        scheduleReminder(taskText, taskTime);
        fetchReminders();
        alert("Reminder set successfully!");
    } else {
        alert("Please enter a valid task and time.");
    }
});

// Fetch existing reminders on load
fetchReminders();
