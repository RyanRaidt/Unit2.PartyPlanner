const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

async function fetchParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data || json;
    renderParties();
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

async function addParty(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const dateTime = `${date}T${time}:00Z`;

  try {
    const requestBody = JSON.stringify({
      name,
      date: dateTime,
      location,
      description,
    });
    console.log("Request Body:", requestBody);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    const newParty = await response.json();
    console.log("API Response:", newParty);

    state.parties.push(newParty.data || newParty);
    renderParties();

    event.target.reset();

    //It was a headache to get this confetti to work//
    if (typeof confetti === "function") {
      confetti({
        particleCount: 300,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
      });
    } else {
      console.error("Confetti function is not available.");
    }
  } catch (error) {
    console.error("Error adding party:", error);
  }
}

function renderParties() {
  const partyList = document.getElementById("party-list");
  partyList.innerHTML = "";
  state.parties.forEach((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${party.name}</h3>
      <p>${party.date} at ${party.time}</p>
      <p>Location: ${party.location}</p>
      <p>${party.description}</p>
      <button onclick="deleteParty(${party.id})">Delete</button>
    `;
    partyList.appendChild(li);
  });
}

async function deleteParty(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    state.parties = state.parties.filter((party) => party.id !== id);
    renderParties();
  } catch (error) {
    console.error("Error deleting party:", error);
  }
}

document.getElementById("party-form").addEventListener("submit", addParty);

fetchParties();
