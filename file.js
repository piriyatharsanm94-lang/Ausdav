const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const statusText = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");

// 👉 Replace with your Google Apps Script Web App URL
const UPLOAD_URL = "YOUR_WEB_APP_URL_HERE";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    statusText.textContent = "⚠️ Please select a file first.";
    return;
  }

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
          filename: file.name
        })
      });

      const result = await response.json();
      if (result.status === "success") {
        statusText.innerHTML = `✅ Uploaded: <a href="${result.fileUrl}" target="_blank">View File</a>`;
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
