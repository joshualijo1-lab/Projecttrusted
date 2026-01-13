const values = [28400, 29650, 31200, 27850, 32540];
const leads = [128, 136, 121, 142, 150];

const valueGauge = document.getElementById("valueGauge");
const leadCount = document.getElementById("leadCount");

let index = 0;

const updateStats = () => {
  if (valueGauge) {
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

updateStats();
setInterval(updateStats, 3200);
