const webAppURL = "https://script.google.com/macros/s/AKfycbwXDxyymBoY5AQc5rrzWZUDSxjPGorhLtrsvhn1m8CSQeSusvX0rjrE4GooRo-pV21ljw/exec"; // Replace with your deployed App Script URL

async function loadSubtopics() {
  try {
    const response = await fetch(webAppURL);
    const data = await response.json();

    const mainTopicDiv = document.getElementById("main-topic");
    mainTopicDiv.innerHTML = "";

    data.forEach(item => {
      const subtopicDiv = document.createElement("div");
      subtopicDiv.className = "subtopic";

      // Accordion button
      const btn = document.createElement("button");
      btn.className = "accordion";
      btn.textContent = item.subtopic;
      subtopicDiv.appendChild(btn);

      // Panel div
      const panel = document.createElement("div");
      panel.className = "panel";

      // Part 1
      const part1Div = document.createElement("div");
      part1Div.className = "part";
      const link1 = document.createElement("a");
      link1.href = item.part1Link;
      link1.textContent = item.part1Name;
      link1.target = "_blank";
      part1Div.appendChild(link1);

      // Part 2
      const part2Div = document.createElement("div");
      part2Div.className = "part";
      const link2 = document.createElement("a");
      link2.href = item.part2Link;
      link2.textContent = item.part2Name;
      link2.target = "_blank";
      part2Div.appendChild(link2);

      panel.appendChild(part1Div);
      panel.appendChild(part2Div);
      subtopicDiv.appendChild(panel);

      mainTopicDiv.appendChild(subtopicDiv);

      // Accordion toggle
      btn.addEventListener("click", () => {
        panel.style.display = panel.style.display === "block" ? "none" : "block";
      });
    });

  } catch (err) {
    console.error("Failed to load subtopics:", err);
  }
}

// Load on page load
window.addEventListener("DOMContentLoaded", loadSubtopics);
