const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

async function fetchParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
    renderParties();
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  try {
    const response = await fetch(API_URL, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, time, location, description }),
    });
    const newParty = await response.json();
    state.parties.push(newParty);
    renderParties();
    event.target.reset();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  const partList = document.getElementById("party-list");
  partList.innerHTML = "";
  state.parties.forEach((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
          <h3>${party.name}</h3>;
      <P>${party.date} at {party.time}</P>        
      <p>Location: ${party.location}</p>
      <p>${party.description}</p>
       <button onclick="deleteParty(${party.id})">Delete</button>
  `;
    partList.appendChild(li);
  });
}

async function deleteParty(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "Delete" });
    state.parties = state.parties.filter((party) => party.id !== id);
    renderParties();
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("party-form").addEventListener("submit", addParty);

fetchParties();
