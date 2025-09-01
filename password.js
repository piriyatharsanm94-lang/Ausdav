const scriptURL = "https://script.google.com/macros/s/AKfycbxjkU1Urx0AQRXBkT66jB11n-gGUuGf7w-Ejz0XqQ5n_2oBi1kCb5thtxmNoiqeR3cR/exec";
let userEmail = "";
let otpTimer;

// Step 1: Send OTP
document.getElementById("forgotForm").addEventListener("submit", e => {
  e.preventDefault();
  userEmail = document.getElementById("email").value;

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      action: "sendOtp",
      email: userEmail
    })
  })
  .then(res => res.text())
  .then(data => {
    console.log("Server Response:", data); // 🔍 Debugging

    if (data.trim().toLowerCase() === "otp_sent") {
      document.getElementById("forgotStatus").innerText = "✅ OTP sent to your email.";

      // Hide email form, show OTP form
      document.getElementById("forgotForm").style.display = "none";
      document.getElementById("otpForm").style.display = "block";

      startOtpCountdown();
    } else {
      document.getElementById("forgotStatus").innerText = "❌ Failed to send OTP. Try again.";
    }
  })
  .catch(err => {
    document.getElementById("forgotStatus").innerText = "⚠️ Network error!";
    console.error(err);
  });
});

// Step 2: Verify OTP
document.getElementById("otpForm").addEventListener("submit", e => {
  e.preventDefault();
  const otp = document.getElementById("otp").value;

  if (document.getElementById("otp").disabled) {
    document.getElementById("forgotStatus").innerText = "❌ OTP expired. Request a new one.";
    return;
  }

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      action: "verifyOtp",
      email: userEmail,
      otp: otp
    })
  })
  .then(res => res.text())
  .then(data => {
    console.log("Server Response:", data); // 🔍 Debugging

    if (data.trim().toLowerCase() === "otp_valid") {
      clearInterval(otpTimer);
      document.getElementById("forgotStatus").innerText = "✅ OTP verified!";

      // Hide OTP form, show Reset form
      document.getElementById("otpForm").style.display = "none";
      document.getElementById("resetForm").style.display = "block";
    } else {
      document.getElementById("forgotStatus").innerText = "❌ Invalid OTP. Try again.";
    }
  })
  .catch(err => {
    document.getElementById("forgotStatus").innerText = "⚠️ Network error!";
    console.error(err);
  });
});

// Step 3: Reset Password with validation
document.getElementById("resetForm").addEventListener("submit", e => {
  e.preventDefault();
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  // Password validation rules
  const passwordRules = [
    { regex: /.{6,}/, message: "Password must be at least 6 characters long." },
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
    { regex: /[0-9]/, message: "Password must contain at least one number." },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain at least one symbol." }
  ];

  // Check each rule
  for (let rule of passwordRules) {
    if (!rule.regex.test(newPass)) {
      document.getElementById("forgotStatus").innerText = `❌ ${rule.message}`;
      return;
    }
  }

  if (newPass !== confirmPass) {
    document.getElementById("forgotStatus").innerText = "❌ Passwords do not match";
    return;
  }

  // If validation passed, send to server
  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      action: "resetPassword",
      email: userEmail,
      password: newPass
    })
  })
  .then(res => res.text())
  .then(data => {
    console.log("Server Response:", data); // 🔍 Debugging

    if (data.trim().toLowerCase() === "password_updated") {
      document.getElementById("forgotStatus").innerText = "✅ Password updated successfully!";

      // Hide Reset + Back button
      document.querySelector("#resetForm button[type=submit]").style.display = "none";
      document.getElementById("backToOtp").style.display = "none";

      // Show Login button
      document.getElementById("goToLogin").style.display = "inline-block";
    } else {
      document.getElementById("forgotStatus").innerText = "❌ Failed to update password.";
    }
  })
  .catch(err => {
    document.getElementById("forgotStatus").innerText = "⚠️ Network error!";
    console.error(err);
  });
});

// 🔗 Login redirect button
document.getElementById("goToLogin").addEventListener("click", () => {
  window.location.href = "index.html"; // change if needed
});

// 🕒 OTP Countdown (40s)
function startOtpCountdown() {
  let timeLeft = 5*60;
  const otpInput = document.getElementById("otp");

  otpInput.disabled = false;
  clearInterval(otpTimer);

  otpTimer = setInterval(() => {
    if (timeLeft > 0) {
      document.getElementById("forgotStatus").innerText =
        `✅ OTP sent to email. Expires in ${timeLeft}s`;
      timeLeft--;
    } else {
      clearInterval(otpTimer);
      otpInput.disabled = true;
      document.getElementById("forgotStatus").innerText =
        "❌ OTP expired. Please go back and request a new one.";
    }
  }, 1000);
}

// 🔙 Back Buttons
document.getElementById("backToEmail").addEventListener("click", () => {
  clearInterval(otpTimer);
  document.getElementById("otpForm").style.display = "none";
  document.getElementById("forgotForm").style.display = "block";
  document.getElementById("forgotStatus").innerText = "";
});

document.getElementById("backToOtp").addEventListener("click", () => {
  document.getElementById("resetForm").style.display = "none";
  document.getElementById("otpForm").style.display = "block";
  document.getElementById("forgotStatus").innerText = "";
});
