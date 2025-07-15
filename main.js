import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let allItems = [];

const toggle = document.getElementById("darkModeToggle");
toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
};
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

const modal = document.getElementById("modal");
const openBtn = document.getElementById("addItemBtn");
const closeBtn = document.querySelector(".close");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

const form = document.getElementById("itemForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const contact = document.getElementById("contact").value.trim();

  if (!name || !description || !contact) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "reports"), {
      type,
      name,
      description,
      contact,
      time: new Date().toISOString()
    });
    alert("✅ Report submitted successfully!");
    form.reset();
    modal.style.display = "none";
    loadItems();
  } catch (err) {
    console.error("❌ Error saving data:", err);
    alert("Failed to submit. Please try again.");
  }
});

async function loadItems() {
  const snapshot = await getDocs(collection(db, "reports"));
  allItems = [];
  snapshot.forEach((doc) => {
    allItems.push(doc.data());
  });
  filterAndRender();
}

function renderItems(list) {
  const container = document.getElementById("itemsList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No items to show.</p>`;
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card fade-in";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
      <p>${item.description}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>
      <small>${new Date(item.time).toLocaleString()}</small>
    `;
    container.appendChild(card);
  });
}

const filterType = document.getElementById("filterType");
const searchInput = document.getElementById("search");

filterType.addEventListener("change", filterAndRender);
searchInput.addEventListener("input", debounce(filterAndRender, 300));

function filterAndRender() {
  const type = filterType.value;
  const search = searchInput.value.toLowerCase();

  const filtered = allItems.filter(item => {
    const matchType = type === "all" || item.type === type;
    const matchName = item.name.toLowerCase().includes(search);
    return matchType && matchName;
  });

  renderItems(filtered);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

window.addEventListener("DOMContentLoaded", loadItems);
