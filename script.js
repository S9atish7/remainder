document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const timeInput = document.getElementById("reminder-time");
    const setReminderBtn = document.getElementById("set-reminder");
    const reminderList = document.getElementById("reminder-list");

    function loadReminders() {
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminderList.innerHTML = "";
        reminders.forEach((reminder, index) => {
            const li = document.createElement("li");
            li.textContent = `${reminder.task} at ${reminder.time}`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.onclick = () => deleteReminder(index);
            li.appendChild(deleteBtn);
            reminderList.appendChild(li);
        });
    }

    function checkReminders() {
        const now = new Date().toISOString().slice(0, 16);
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.forEach((reminder, index) => {
            if (reminder.time === now) {
                alert(`Reminder: ${reminder.task}`);
                speakReminder(reminder.task);
                deleteReminder(index);
            }
        });
    }

    function speakReminder(text) {
        const speech = new SpeechSynthesisUtterance(`Reminder: ${text}`);
        speech.lang = "en-US";
        speech.rate = 1;
        speechSynthesis.speak(speech);
    }

    setReminderBtn.addEventListener("click", function () {
        const task = taskInput.value.trim();
        const time = timeInput.value;
        if (task && time) {
            const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
            reminders.push({ task, time });
            localStorage.setItem("reminders", JSON.stringify(reminders));
            taskInput.value = "";
            timeInput.value = "";
            loadReminders();
        }
    });

    function deleteReminder(index) {
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.splice(index, 1);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        loadReminders();
    }

    loadReminders();
    setInterval(checkReminders, 60000);
});
