// announce_1.js

const sheetURL = "https://script.google.com/macros/s/AKfycbx6nATAR1y58Z6SPtpbzrO7TrxNHAsktCZnJncwNlEqEeJfozfeEIMr3UOldA8oGCAG/exec";

let viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements")) || [];
let allAnnouncements = [];

const batchYear = Number(localStorage.getItem("batchYear")) || 2024;

// Home button redirect
document.getElementById("homeBtn")?.addEventListener("click", () => {
  if (batchYear === 2022) window.location.href = "interface2022.html";
  else if (batchYear === 2024) window.location.href = "userinterface.html";
  else window.location.href = "temporary_note.html";
});

// Fetch announcements
async function fetchAnnouncements() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    allAnnouncements = data;

    // Update notifications for main.js
    if (window.updateNotifications) {
      window.updateNotifications(allAnnouncements);
    }
  } catch (err) {
    console.error("Error fetching announcements:", err);
  }
}

// Render announcements
function renderAnnouncements() {
  const tableBody = document.getElementById("announcements");
  if (!tableBody) return;

  if (!allAnnouncements.length) {
    tableBody.innerHTML = "<tr><td colspan='2'>No announcements yet.</td></tr>";
    return;
  }

  tableBody.innerHTML = ""; // Clear table

  allAnnouncements.forEach(row => {
    const isViewed = viewedAnnouncements.includes(row.announcement);
    const star = isViewed ? "" : "★";

    const tr = document.createElement("tr");

    // Announcement cell
    const tdAnn = document.createElement("td");
    tdAnn.innerHTML = (row.body && row.body.includes("http"))
      ? `<span class="announcement-link">${row.announcement}</span> ${star}`
      : `${row.announcement} ${star}`;

    tdAnn.style.cursor = "pointer";
    tdAnn.addEventListener("click", () => openModal(row.body, row.announcement));

    // Sender cell
    const tdSender = document.createElement("td");
    tdSender.textContent = row.sender;

    tr.appendChild(tdAnn);
    tr.appendChild(tdSender);

    tableBody.appendChild(tr);
  });
}

// Open modal
function openModal(bodyMessage, announcement) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("bodyFrame");

  modal.style.display = "block";

  // Safely set iframe content
  iframe.srcdoc = bodyMessage || "<p>No content</p>";

  // Mark as viewed
  if (!viewedAnnouncements.includes(announcement)) {
    viewedAnnouncements.push(announcement);
    localStorage.setItem("viewedAnnouncements", JSON.stringify(viewedAnnouncements));
  }

  renderAnnouncements(); // refresh table to remove star
}

// Close modal
document.getElementById("close").onclick = function () {
  document.getElementById("modal").style.display = "none";
};

// Close modal on outside click
window.onclick = function (event) {
  if (event.target == document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
};

// Expose functions globally
window.fetchAnnouncements = fetchAnnouncements;
window.renderAnnouncements = renderAnnouncements;

// Initial fetch + auto-refresh
fetchAnnouncements();
setInterval(fetchAnnouncements, 5000);


