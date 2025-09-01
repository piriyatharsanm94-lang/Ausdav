const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

const scriptURL = "https://script.google.com/macros/s/AKfycbx6Utko9J858o0em00Zb0c5MjXBTJdXoGII24JpJmn_UBrEyr3XZ9xxnsIBJb4WIuLrOQ/exec";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  loginStatus.textContent = "⏳ Logging in...";
  loginStatus.style.color = "black";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: new URLSearchParams({
        action: "login",
        username,
        password
      })
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (data.status === "success") {
      const batchYearNumber = Number(data.batchYear || "0");

      loginStatus.textContent = `✅ Welcome, ${data.username}`;
      loginStatus.style.color = "green";

      // Save login info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.username);
      localStorage.setItem("batchYear", batchYearNumber);

      // Redirect
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);

    } else {
      loginStatus.textContent = "❌ Invalid username or password!";
      loginStatus.style.color = "red";
      document.getElementById("password").value = "";
    }

  } catch (err) {
    loginStatus.textContent = "❌ Network/server error!";
    loginStatus.style.color = "red";
    console.error(err);
  }
});

// 👁️ Password toggle
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}
