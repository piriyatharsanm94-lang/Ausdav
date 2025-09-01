// === Batch Dashboard Loader ===

// Example: localStorage.setItem("batchYear", 2022);
let batchYear = Number(localStorage.getItem("batchYear")) || 2024;
const cardWrapper = document.getElementById("cardWrapper");
const dashboardTitle = document.getElementById("dashboardTitle");

// Templates for different batches
const dashboards = {
  2022: [
    { tag: "Accounts Details", body: "Tap to view project accounts details", color: "blue", link: "pro_dis.html" },
    { tag: "Give Feedback", body: "Tap to give feedback (must be kept private)", color: "green", link: "feedback.html" },
    { tag: "Announcement for Members", body: "➕ Tap to give announcement for members", color: "red", link: "Announcement_Given.html", admin: true },
    { tag: "Unfinished Accounts", body: "Tap to view the unfinished accounts", color: "orange", link: "https://docs.google.com/spreadsheets/d/12-AhAxG8zFll96kuF9QRJzIeLgt1u2Qb68JrYiTGHD0/edit?usp=sharing", admin: true },
    { tag: "Feedbacks", body: "Tap to view the feedback from members", color: "blue", link: "https://docs.google.com/spreadsheets/d/1kECmlENwamN0d_BYYyUgwLAWwsEPUKILyV39psxyX1Q/edit?usp=sharing", admin: true },
    { tag: "Update Project Accounts", body: "Tap to update the account details for our batch", color: "green", link: "Update_pro.html", admin: true }
  ],

  2024: [
    { tag: "For Accounts Team Members", body: "Tap to upload the finished accounts details", color: "blue", link: "upload_Acc.html", type: "accounts" },
    { tag: "For Documentary Team Members", body: "Tap to upload finished documents and permission letters", color: "blue", link: "upload_Doc.html", type: "documentary" },
    { tag: "Give Feedback", body: "Tap to give feedback (must be kept private)", color: "green", link: "feedback.html" },
    { tag: "For Project Coordinators", body: "Tap to note the temporary accounts (project ongoing)", color: "orange", link: "Unfinised_Acc.html" }
  ]
};

// Map 2012 → 2022 dashboard
const dashboardYear = batchYear === 2012 ? 2022 : batchYear;

// Function to render cards
function renderDashboard(year) {
  cardWrapper.innerHTML = "";
  let cards = dashboards[year];

  if (!cards) {
    dashboardTitle.textContent = "No dashboard available";
    return;
  }

  dashboardTitle.textContent = `Dashboard - Batch ${batchYear}`;

  cards.forEach(card => {
    // Show admin cards only if batchYear is 2012
    if (card.admin && batchYear !== 2012) return;

    const div = document.createElement("div");
    div.className = `card`;

    // Pass type to upload page if exists
    if (card.type) {
      div.onclick = () => location.href = `${card.link}?type=${card.type}`;
    } else {
      div.onclick = () => location.href = card.link;
    }

    div.innerHTML = `
      <span class="tag">${card.tag}</span>
      <div class="card-body ${card.color}">
        <p>${card.body}</p>
      </div>
    `;
    cardWrapper.appendChild(div);
  });
}

// Load correct dashboard
renderDashboard(dashboardYear);


