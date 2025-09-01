const sheetURL = "https://script.google.com/macros/s/AKfycbx6nATAR1y58Z6SPtpbzrO7TrxNHAsktCZnJncwNlEqEeJfozfeEIMr3UOldA8oGCAG/exec";

// Load viewed announcements from localStorage
let viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements")) || [];

async function fetchAnnouncements() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    let html = "";
    data.forEach((row, index) => {
      const isViewed = viewedAnnouncements.includes(row.announcement);
      const star = isViewed ? "" : "⭐";

      html += `<tr onclick="openModal('${row.body}', '${row.announcement}')">
                 <td>${row.announcement} ${star}</td>
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

fetchAnnouncements();
setInterval(fetchAnnouncements, 5000);

