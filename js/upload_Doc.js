// ====== Elements ======
const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const statusText = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");
const previewBox = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
const previewText = document.getElementById("previewText");
const renameInput = document.getElementById("renameInput");

// Replace with your Google Apps Script Web App URL
const UPLOAD_URL = "https://script.google.com/macros/s/AKfycby5BjpbkTr-5gFK4g9ZYDuVOPz73CsD6K70Kxnxz94Q4PL5SYQYaSpa7UDQDz4MKwHrxg/exec";



// ====== File Preview ======
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    previewBox.style.display = "block";
    previewText.textContent = "Selected: " + file.name;
    renameInput.value = "";

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.style.display = "none";
    }
  } else {
    previewBox.style.display = "none";
  }
});

// ====== Upload Handler ======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    statusText.textContent = "⚠️ Please select a file first.";
    return;
  }

  let filename = renameInput.value.trim() || file.name;

  uploadBtn.textContent = "Uploading...";
  uploadBtn.disabled = true;

  const reader = new FileReader();
  reader.onload = async function(event) {
    const base64Data = event.target.result;

    try {
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          file: base64Data,
          filename: filename
        })
      });

      const result = await response.json();
      if (result.status === "success") {
        statusText.textContent = `✅ Uploaded successfully as "${filename}"`;

        setTimeout(() => {
          form.reset();
          previewBox.style.display = "none";
          statusText.textContent = "";
        }, 2000);

      } else {
        statusText.textContent = "❌ Error: " + result.message;
      }
    } catch (err) {
      statusText.textContent = "❌ Upload failed.";
      console.error(err);
    } finally {
      uploadBtn.textContent = "Upload";
      uploadBtn.disabled = false;
    }
  };

  reader.readAsDataURL(file);
});

// ====== Auto Logout After Inactivity (7 min) ======
let logoutTimer;

function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    alert("⚠️ Session expired. You will be logged out.");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  }, 7 * 60 * 1000); // 7 minutes
}

// Track user activity
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
  document.addEventListener(event, resetLogoutTimer);
});

// Start timer on page load
resetLogoutTimer();