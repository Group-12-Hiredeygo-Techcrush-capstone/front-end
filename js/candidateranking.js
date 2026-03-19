const candidates = [
   {
     name: "Bamidele Olalekan Joshua",
     email: "teest@gmail.com",
     score: 99,
     time: "22 min 14 sec",
     correct: "19/20",
     result: "Passed"
   },
  {
    name: "Adaeze Okonkwo",
    email: "adaeze@gmail.com",
    score: 92,
    time: "28 min 14 sec",
    correct: "18 / 20",
    result: "Passed"
  },
  {
    name: "Emeka Madu",
    email: "emeka@yahoo.com",
    score: 85,
    time: "35 min 02 sec",
    correct: "17 / 20",
    result: "Passed"
  },
  {
    name: "Tolu Adeyemi",
    email: "tolu@outlook.com",
    score: 75,
    time: "31 min 48 sec",
    correct: "15 / 20",
    result: "Passed"
  },
  {
    name: "Kemi Ojo",
    email: "kemi@gmail.com",
    score: 63,
    time: "40 min 55 sec",
    correct: "13 / 20",
    result: "Passed"
  },
  {
    name: "Bolu Bello",
    email: "bolu@hotmail.com",
    score: 45,
    time: "44 min 30 sec",
    correct: "9 / 20",
    result: "Failed"
  }
];

const tableBody = document.getElementById("tableBody");
const sortSelect = document.getElementById("sortSelect");

function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach((c, index) => {
    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
      <span>${index + 1}</span>

      <span>
        <strong>${c.name}</strong><br/>
        <small>${c.email}</small>
      </span>

      <span>
        ${c.score}%
        <div class="progress">
          <span style="width:${c.score}%"></span>
        </div>
      </span>

      <span>${c.time}</span>

      <span>${c.correct}</span>

      <span>
        <span class="status ${c.result === "Passed" ? "passed" : "failed"}">
          ${c.result}
        </span>
      </span>

      <span>
        <button class="btn primary">View Profile</button><br/>
        ${
          c.result === "Failed"
            ? '<button class="btn danger">Message</button>'
            : '<button class="btn secondary">Save</button>'
        }
      </span>
    `;

    tableBody.appendChild(row);
  });
}

sortSelect.addEventListener("change", () => {
  let sorted = [...candidates];

  if (sortSelect.value === "high") {
    sorted.sort((a, b) => b.score - a.score);
  } else {
    sorted.sort((a, b) => a.score - b.score);
  }

  renderTable(sorted);
});

// Initial render
renderTable(candidates);