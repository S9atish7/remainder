window.onload = function () {
    let speakBtn = document.querySelector('.speak-btn');
    let textArea = document.querySelector('.enter-text');
    let timeInput = document.querySelector('.time-input');
    let reminderList = document.querySelector('.reminder-list');

    if (!speakBtn || !textArea || !timeInput || !reminderList) {
        console.error("One or more elements are missing in the HTML.");
        return;
    }

    function loadReminders() {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        displayReminders(reminders);
        checkReminders();
    }

    function displayReminders(reminders) {
        reminderList.innerHTML = "";
        reminders.forEach((reminder, index) => {
            let div = document.createElement("div");
            div.textContent = `📌 ${reminder.task} - ⏰ ${reminder.time}`;
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.onclick = () => deleteReminder(index);
            div.appendChild(deleteBtn);
            reminderList.appendChild(div);
        });
    }

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

    function sendVoiceMessage(task) {
        let speech = new SpeechSynthesisUtterance(`Reminder: ${task}`);
        speech.lang = 'en-US';
        speech.rate = 1;
        speech.volume = 1;
        speech.pitch = 1;
        speechSynthesis.speak(speech);
    }

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

    function checkReminders() {
        let now = new Date().toISOString().slice(0, 16);
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

        reminders.forEach((reminder, index) => {
            if (reminder.time === now) {
                sendVoiceMessage(reminder.task);
                sendNotification(reminder.task);
                deleteReminder(index);
            }
        });
    }

    speakBtn.addEventListener('click', () => {
        let taskText = textArea.value.trim();
        let taskTime = timeInput.value;

        if (taskText && taskTime) {
            let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
            reminders.push({ task: taskText, time: taskTime });
            localStorage.setItem("reminders", JSON.stringify(reminders));

            scheduleReminder(taskText, taskTime);
            loadReminders();
            alert("Reminder set successfully!");
        } else {
            alert("Please enter a valid task and time.");
        }
    });

    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.splice(index, 1);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        loadReminders();
    }

    loadReminders();
    setInterval(checkReminders, 60000);
};
