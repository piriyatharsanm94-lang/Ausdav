window.addEventListener("DOMContentLoaded", () => {
  // Get batch year from localStorage
  const batchYear = Number(localStorage.getItem("batchYear"));
  console.log("Batch year from localStorage:", batchYear); // Debug

  // Get admin cards
  const adminCard = document.getElementById("adminCard");
  const adminCard2 = document.getElementById("adminCard2");
  const adminCard3 = document.getElementById("adminCard3");
  const adminCard4 = document.getElementById("adminCard4");

  // Show cards only if batch year is 2012
  if (batchYear === 2012) {
    if (adminCard) {
      adminCard.classList.add("show");
      console.log("Admin card 1 is now visible");
    }
    if (adminCard2) {
      adminCard2.classList.add("show");
      console.log("Admin card 2 is now visible");
    }
    if (adminCard3) {
      adminCard3.classList.add("show");
      console.log("Admin card 3 is now visible");
    }
    if (adminCard4) {
      adminCard4.classList.add("show");  // <-- fixed
      console.log("Admin card 4 is now visible");
    }
  }
});




