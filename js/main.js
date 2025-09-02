// Section toggling with fade
const dashboardLink = document.getElementById("dashboardLink");
const announceLink = document.getElementById("announceLink");
const dashboardSection = document.getElementById("dashboardSection");
const announceSection = document.getElementById("announceSection");

// Create iframe container dynamically for announcements
let iframeContainer = document.createElement("div");
iframeContainer.id = "iframeContainer";
iframeContainer.style.display = "none";
iframeContainer.style.width = "100%";
iframeContainer.style.height = "80vh";
iframeContainer.style.marginTop = "20px";

let announcementsIframe = document.createElement("iframe");
announcementsIframe.id = "announcementsIframe";
announcementsIframe.style.width = "100%";
announcementsIframe.style.height = "100%";
announcementsIframe.style.border = "none";

iframeContainer.appendChild(announcementsIframe);
document.getElementById("content").appendChild(iframeContainer);

// Show or hide sections
function showSection(section) {
  if (section === "dashboard") {
    dashboardSection.classList.add("active");
    dashboardSection.style.opacity = 1;
    announceSection.classList.remove("active");
    iframeContainer.style.display = "none"; // hide iframe
    dashboardLink.classList.add("active");
    announceLink.classList.remove("active");
  } else if (section === "announce") {
    dashboardSection.classList.remove("active");
    dashboardLink.classList.remove("active");
    announceLink.classList.add("active");

    // Show iframe and load announcements page
    iframeContainer.style.display = "block";
    announcementsIframe.src = "ann.html";
  }
}

dashboardLink.addEventListener("click", () => showSection("dashboard"));
announceLink.addEventListener("click", () => showSection("announce"));

// Notification System
const notifBtn = document.getElementById("notifBtn");
const notifBadge = document.getElementById("notifBadge");
const notifPopup = document.getElementById("notifPopup");
const notifList = document.getElementById("notifList");
window.newAnnouncements = [];

// Google Sheets URL
const sheetURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // replace with your script URL

// Fetch and check for new announcements
async function checkNewAnnouncements() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    const viewed = JSON.parse(localStorage.getItem("viewedAnnouncements")) || [];
    const newItems = data.filter(a => !viewed.includes(a.announcement));
    window.updateNotifications(newItems);
  } catch (err) {
    console.error("Error fetching announcements:", err);
  }
}

// Update notifications dynamically
window.updateNotifications = function(newItems) {
  window.newAnnouncements = newItems;

  if (window.newAnnouncements.length > 0) {
    notifBtn.style.display = "block"; // show bell
    notifBadge.textContent = window.newAnnouncements.length; // badge count
  } else {
    notifBtn.style.display = "none"; // hide bell
    notifBadge.textContent = "";
  }
};

// Notification bell click
notifBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notifPopup.classList.toggle("show");
  notifList.innerHTML = "";

  if (!window.newAnnouncements || window.newAnnouncements.length === 0) {
    notifList.innerHTML = "<li>No new announcements</li>";
  } else {
    window.newAnnouncements.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.announcement} - ${a.sender}`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        showSection("announce"); // open iframe
        notifPopup.classList.remove("show");
      });
      notifList.appendChild(li);
    });
  }

  notifBadge.textContent = "";
});

// Close notification popup on outside click
document.addEventListener("click", (e) => {
  if (!notifPopup.contains(e.target) && !notifBtn.contains(e.target)) {
    notifPopup.classList.remove("show");
  }
});

// Optional: close notification on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    notifPopup.classList.remove("show");
  }
});

// Initial check + repeat every 10 seconds
checkNewAnnouncements();
setInterval(checkNewAnnouncements, 10000);

