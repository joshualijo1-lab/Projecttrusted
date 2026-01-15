const values = [28400, 29650, 31200, 27850, 32540];
const leads = [128, 136, 121, 142, 150];

const valueGauge = document.getElementById("valueGauge");
const leadCount = document.getElementById("leadCount");

let index = 0;

const updateStats = () => {
  if (valueGauge) {
    const formatted = values[index].toLocaleString("en-IE", {
      style: "currency",
      currency: "EUR",
    const formatted = values[index].toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    valueGauge.textContent = formatted;
  }

  if (leadCount) {
    leadCount.textContent = leads[index].toString();
  }

  index = (index + 1) % values.length;
};

const initSearch = () => {
  const searchInput = document.querySelector("[data-search]");
  const cards = document.querySelectorAll("[data-cards] .car-card");

  if (!searchInput || cards.length === 0) {
    return;
  }

  const filterCards = () => {
    const term = searchInput.value.toLowerCase().trim();
    cards.forEach((card) => {
      const name = card.dataset.name || "";
      card.style.display = name.includes(term) ? "grid" : "none";
    });
  };

  searchInput.addEventListener("input", filterCards);

  const form = searchInput.closest("form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      filterCards();
    });
  }
};

const initAssistant = () => {
  const assistant = document.querySelector("[data-assistant]");
  if (!assistant) {
    return;
  }

  const toggle = assistant.querySelector(".assistant-toggle");
  const close = assistant.querySelector(".assistant-close");
  const form = assistant.querySelector("[data-assistant-form]");
  const messages = assistant.querySelector("[data-messages]");

  const openAssistant = () => assistant.classList.add("open");
  const closeAssistant = () => assistant.classList.remove("open");

  toggle?.addEventListener("click", () => {
    assistant.classList.toggle("open");
  });

  close?.addEventListener("click", closeAssistant);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    if (!input || !messages) {
      return;
    }

    const text = input.value.trim();
    if (!text) {
      return;
    }

    const userMessage = document.createElement("p");
    userMessage.className = "assistant-message user";
    userMessage.textContent = text;
    messages.appendChild(userMessage);

    const botMessage = document.createElement("p");
    botMessage.className = "assistant-message bot";
    botMessage.textContent =
      "Thanks! A trustedcars.ie specialist will follow up with pricing and availability tips.";
    messages.appendChild(botMessage);

    messages.scrollTop = messages.scrollHeight;
    input.value = "";
  });

  openAssistant();
};

updateStats();
setInterval(updateStats, 3200);
initSearch();
initAssistant();
updateStats();
setInterval(updateStats, 3200);
