document.addEventListener("DOMContentLoaded", function () {
  const reminderList = document.getElementById("reminder-list");
  const reminderInput = document.getElementById("reminder-input");
  const addReminderBtn = document.getElementById("add-reminder-btn");

  if (!reminderList || !reminderInput || !addReminderBtn) {
    console.error("One or more elements are missing!");
    return;
  }

  function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminderList.innerHTML = "";
    reminders.forEach((reminder, index) => {
      const li = document.createElement("li");
      li.textContent = reminder;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.onclick = () => deleteReminder(index);
      li.appendChild(deleteBtn);
      reminderList.appendChild(li);
    });
  }

  addReminderBtn.addEventListener("click", function () {
    const reminderText = reminderInput.value.trim();
    if (reminderText !== "") {
      const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
      reminders.push(reminderText);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      reminderInput.value = "";
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
});
