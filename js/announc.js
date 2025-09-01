const sheetURL = "https://script.google.com/macros/s/AKfycbx6nATAR1y58Z6SPtpbzrO7TrxNHAsktCZnJncwNlEqEeJfozfeEIMr3UOldA8oGCAG/exec";

// Load viewed announcements from localStorage
let viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements")) || [];

// Get batch year from localStorage
const batchYear = Number(localStorage.getItem("batchYear")) || 2024;

// Home button redirect
document.getElementById("homeBtn").onclick = () => {
  if (batchYear === 2022) window.location.href = "interface2022.html";
  else if (batchYear === 2024) window.location.href = "userinterface.html";
  else window.location.href = "temporary_note.html";
};

async function fetchAnnouncements() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    let html = "";
    data.forEach(row => {
      const isViewed = viewedAnnouncements.includes(row.announcement);
      const star = isViewed ? "" : "★";

      let annText = row.announcement;
      // Highlight links if present
      if (row.body && row.body.includes("http")) {
        annText = `<span class="announcement-link">${row.announcement}</span>`;
      }

      html += `<tr onclick="openModal('${row.body}', '${row.announcement}')">
                 <td>${annText} ${star}</td>
                 <td>${row.sender}</td>
               </tr>`;
    });

    document.getElementById("announcements").innerHTML =
      html || "<tr><td colspan='2'>No announcements yet.</td></tr>";
  } catch (err) {
    console.error("Error fetching announcements:", err);
  }
}

function openModal(bodyMessage, announcement) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("bodyFrame").srcdoc = bodyMessage;

  // Mark as viewed
  if (!viewedAnnouncements.includes(announcement)) {
    viewedAnnouncements.push(announcement);
    localStorage.setItem("viewedAnnouncements", JSON.stringify(viewedAnnouncements));
  }

  // Refresh table to remove star immediately
  fetchAnnouncements();
}

// Close modal
document.getElementById("close").onclick = function () {
  document.getElementById("modal").style.display = "none";
};

window.onclick = function (event) {
  if (event.target == document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
};

// Initial fetch + refresh every 5 seconds
fetchAnnouncements();
setInterval(fetchAnnouncements, 5000);
