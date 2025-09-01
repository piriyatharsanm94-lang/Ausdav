const sheetURL = "https://script.google.com/macros/s/AKfycbx6nATAR1y58Z6SPtpbzrO7TrxNHAsktCZnJncwNlEqEeJfozfeEIMr3UOldA8oGCAG/exec";

// Load viewed announcements from localStorage
let viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements")) || [];

async function checkNewAnnouncements() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    // Check if there are any announcements not viewed yet
    const newAnnouncements = data.some(row => !viewedAnnouncements.includes(row.announcement));

    const link = document.querySelector("a[href='aanouncement.html']");

    if (newAnnouncements) {
      // Add star mark ⭐
      if (!link.textContent.includes("⭐")) {
        link.textContent = link.textContent.trim() + " ⭐";
      }
    } else {
      // Remove star mark
      link.textContent = link.textContent.replace(" ⭐", "");
    }
  } catch (err) {
    console.error("Error checking announcements:", err);
  }
}

checkNewAnnouncements();
setInterval(checkNewAnnouncements, 5000);
