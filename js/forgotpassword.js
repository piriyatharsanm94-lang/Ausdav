const scriptURL = "https://script.google.com/macros/s/AKfycbxjkU1Urx0AQRXBkT66jB11n-gGUuGf7w-Ejz0XqQ5n_2oBi1kCb5thtxmNoiqeR3cR/exec";

let userEmail = "";
let otpTimer;

// ----- STEP 1: Send OTP -----
document.getElementById("forgotForm").addEventListener("submit", e => {
  e.preventDefault();
  userEmail = document.getElementById("email").value.trim();

  if (!userEmail) return;

  fetch(scriptURL, {
    method: "POST",
    body: new URLSearchParams({
      action: "sendOtp",
      email: userEmail
    })
  })
  .then(res => res.text())
  .then(data => {
    if (data.trim().toLowerCase() === "otp_sent") {
      document.getElementById("forgotStatus").innerText = "✅ OTP sent to your email.";
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

// ----- STEP 2: Verify OTP -----
document.getElementById("otpForm").addEventListener("submit", e => {
  e.preventDefault();
  const otp = document.getElementById("otp").value.trim();
  const otpInput = document.getElementById("otp");

  if (otpInput.disabled) {
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
    if (data.trim().toLowerCase() === "otp_valid") {
      clearInterval(otpTimer);
      document.getElementById("forgotStatus").innerText = "✅ OTP verified!";
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

// ----- STEP 3: Reset Password -----
document.getElementById("resetForm").addEventListener("submit", e => {
  e.preventDefault();
  const newPass = document.getElementById("newPassword").value.trim();
  const confirmPass = document.getElementById("confirmPassword").value.trim();

  // Password validation rules
  const rules = [
    { regex: /.{6,}/, message: "Password must be at least 6 characters long." },
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
    { regex: /[0-9]/, message: "Password must contain at least one number." },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "Password must contain at least one symbol." }
  ];

  for (let rule of rules) {
    if (!rule.regex.test(newPass)) {
      document.getElementById("forgotStatus").innerText = `❌ ${rule.message}`;
      return;
    }
  }

  if (newPass !== confirmPass) {
    document.getElementById("forgotStatus").innerText = "❌ Passwords do not match";
    return;
  }

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
    if (data.trim().toLowerCase() === "password_updated") {
      document.getElementById("forgotStatus").innerText = "";
      document.getElementById("resetForm").style.display = "none";
      document.getElementById("successBox").style.display = "block";
    } else {
      document.getElementById("forgotStatus").innerText = "❌ Failed to update password.";
    }
  })
  .catch(err => {
    document.getElementById("forgotStatus").innerText = "⚠️ Network error!";
    console.error(err);
  });
});

// ----- GO TO LOGIN BUTTON -----
document.getElementById("goToLogin").addEventListener("click", () => {
  window.location.href = "index.html";
});

// ----- OTP TIMER -----
function startOtpCountdown() {
  let timeLeft = 300; // 5 minutes
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
        "❌ OTP expired. Please request a new one.";
    }
  }, 1000);
}

// ----- BACK BUTTONS -----
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
