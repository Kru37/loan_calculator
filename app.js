//UI vars
const form = document.getElementById("loanCalculator");
const amount = document.getElementById("amount");
const interest = document.getElementById("interest");
const years = document.getElementById("years");
const card = document.querySelector(".card");
const title = document.querySelector(".heading");
const monthlyPayment = document.getElementById("monthly-payment");
const totalPayment = document.getElementById("total-payment");
const totalInt = document.getElementById("total-interest");
const getChart = document.querySelector("#myChart").getContext("2d");
form.addEventListener("submit", function (e) {
  document.querySelector(".hideLoad").style.display = "none";
  document.getElementById("loading").style.display = "block";

  setTimeout(addToUi, 2000);

  e.preventDefault();
});

function addToUi() {
  if (amount.value === "" || interest.value === "" || years.value === "") {
    document.querySelector(".hideLoad").style.display = "none";
    document.getElementById("loading").style.display = "none";

    createAlert("Please check your input", "alert-danger");
  } else {
    document.querySelector(".hideLoad").style.display = "block";
    document.getElementById("loading").style.display = "none";
    calculateLoan();
  }
}
function createAlert(message, classtype) {
  if (checkAlert()) {
    removeAlert();
  }
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${classtype}`;
  // alertDiv.setAttribute('role','alert')
  alertDiv.appendChild(document.createTextNode(message));

  card.insertBefore(alertDiv, title);
  setTimeout(removeAlert, 5000);
}

function removeAlert() {
  const alertAvail = document.querySelector(".alert");
  if (alertAvail !== null) {
    document.querySelector(".alert").remove();
  }
}
function checkAlert() {
  const alertAvail = document.querySelector(".alert");
  if (alertAvail === null) {
    return false;
  } else {
    return true;
  }
}
function calculateLoan() {
  const interestYearly = Number(interest.value);
  const rate = Math.round((interestYearly / 12 / 100) * 1e5) / 1e5;
  const principle = Number(amount.value);
  const totalMonths = Number(years.value) * 12;

  const monthlyInstal =
    principle *
    ((rate * Math.pow(1 + rate, totalMonths)) /
      (Math.pow(1 + rate, totalMonths) - 1));
  const totalPay = monthlyInstal * totalMonths;
  const totalInterest = totalPay - principle;

  displayData(monthlyInstal, totalPay, totalInterest);
}
const calculatepercentage = (num1, num2) => {
  let total = parseInt(num1) + parseInt(num2);
  let princi = ((num1 / total) * 100).toFixed(2);
  let inte = ((num2 / total) * 100).toFixed(2);
  console.log(num1, num2, total);

  return { princi, inte };
};
function displayData(monthlyInstal, totalPay, totalInterest) {
  if (isFinite(monthlyInstal)) {
    monthlyPayment.value = monthlyInstal.toFixed(2);
    totalPayment.value = totalPay.toFixed(2);
    totalInt.value = totalInterest.toFixed(2);
    const Princi = Number(amount.value);
    const tInt = totalInterest.toFixed(2);
    const { princi, inte } = calculatepercentage(Princi, tInt);
    console.log(princi, inte);
    setTimeout(createAlert("Calculations Done !!!", "alert-success"), 5000);
    const myChart = new Chart(getChart, {
      type: "pie",
      data: {
        labels: ["Principal", "Interest"],
        datasets: [
          {
            label: "My First Dataset",
            data: [princi, inte],

            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function (tooltipItem, data) {
              console.log(tooltipItem, data);
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              var tooltipData = allData[tooltipItem.index];
              return tooltipLabel + ": " + tooltipData + "%";
            },
          },
        },
      },
    });
  } else {
    createAlert("Please check your input", "alert-danger");
  }
}
