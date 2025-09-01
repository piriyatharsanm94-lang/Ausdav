const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx4IjLavNlChUdO-4JLhj5x7u6E0e3UW7IxwXMB5992BDRpe6k5Or6Gf1Bt_TNB_WwROQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const progress = document.getElementById("progress");
  const success = document.getElementById("success");
  const failure = document.getElementById("failure");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", async e => {
    e.preventDefault();
    success.hidden = true;
    failure.hidden = true;

    progress.hidden = false;
    submitBtn.disabled = true;

    const payload = {
      option: form.option.value,
      details: form.details.value,
      cash: form.cash.value,
      _submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      progress.hidden = true;
      success.hidden = false;
      form.reset();
    } catch (err) {
      progress.hidden = true;
      failure.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });
});
