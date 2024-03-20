let question;
let options;
let votes = {};

function startPoll() {
  // Get question and options from the input fields
  question = document.getElementById("question").value;
  options = document.getElementById("options").value.split(",");

  // Display the poll form
  document.getElementById("poll-question").innerText = question;
  document.getElementById("options-list").innerHTML = "";
  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.innerHTML = `
            <div><input type="radio" name="vote-option" value="${option}"/></div>
            <div><label>${option}</label></div>
        `;
    document.getElementById("options-list").appendChild(optionElement);
  });

  // Hide the initial form and show the poll form
  document.getElementById("poll-form").style.display = "block";
  document.getElementById("results-container").style.display = "none";
}

function submitVote() {
  const selectedOption = document.querySelector(
    'input[name="vote-option"]:checked'
  );

  if (selectedOption) {
    const selectedOptionValue = selectedOption.value;

    // Record the vote
    if (votes[selectedOptionValue]) {
      votes[selectedOptionValue]++;
    } else {
      votes[selectedOptionValue] = 1;
    }

    // Display results
    displayResults();
  } else {
    alert("Please select an option before submitting your vote.");
  }
}

const percentageArray = [];
const optionArray = [];

function displayResults() {
  // Reset arrays
  percentageArray.length = 0;
  optionArray.length = 0;

  // Hide the poll form and show the results
  document.getElementById("poll-form").style.display = "none";
  document.getElementById("results-container").style.display = "block";

  // Destroy existing chart if it exists
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Create a stacked scale chart for results
  const resultsChart = document.getElementById("results-chart");
  resultsChart.innerHTML = "";

  const totalVotes = Object.values(votes).reduce(
    (total, count) => total + count,
    0
  );

  options.forEach((option) => {
    const percentage = ((votes[option] || 0) / totalVotes) * 100 || 0;
    percentageArray.push(percentage.toFixed(1));
    optionArray.push(option);
  });

  const downloadButton = document.createElement("button");
  downloadButton.innerText = "Download Results";
  downloadButton.onclick = downloadResults;
  downloadButton.style = "margin-top: 10px";
  resultsChart.appendChild(downloadButton);

  const ctx = document.getElementById("percentageChart").getContext("2d");
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: percentageArray.map((_, index) => `${optionArray[index]}`),
      datasets: [
        {
          label: "Percentage",
          data: percentageArray,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 100,
              callback: function (value) {
                return value + "%";
              },
            },
          },
        ],
      },
    },
  });
}

function downloadResults() {
  // Generate CSV content
  const csvContent = generateCSV();

  // Create a Blob (Binary Large Object) with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "poll_results.csv";

  // Append the link to the document and simulate a click
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Remove the link from the document
  document.body.removeChild(downloadLink);
}

function generateCSV() {
  // Create CSV header
  let csvContent = "Question,Options,Votes\n";

  // Add poll details
  csvContent += `"${question}","${options.join(",")}"\n`;

  // Add vote counts
  options.forEach((option) => {
    const voteCount = votes[option] || 0;
    csvContent += `,"${option}",${voteCount}\n`;
  });

  return csvContent;
}

function color() {
  document.getElementById("colorBox").style.display = "grid";
}

const colors = document.querySelectorAll(".ab");

colors.forEach((color) => {
  color.addEventListener("click", (e) => {
    const color = e.target.dataset.color;
    document.querySelector(
      "#poll-container"
    ).style.backgroundColor = `${color}`;
    // color.style.display ="none"
    document.getElementById("colorBox").style.display = "none";
    document.querySelector("#poll-container").style.backgroundImage = "";
  });

  color.addEventListener("mouseenter", (e) => {
    const color = e.target.dataset.color;
    document.querySelector(
      "#poll-container"
    ).style.backgroundColor = `${color}`;
    // document.getElementById("colorBox").style.display ="none"
  });
});

document.querySelector("#colorBox").addEventListener("mouseleave", (e) => {
  document.getElementById("colorBox").style.display = "none";
});

const images = {
  TA5: "./images/TA5.jpg",
  TA6: "./images/TA6.jpg",
  TA7: "./images/TA7.jpg",
};

const themes = document.querySelectorAll(".theme");
const themeArray = Array.from(themes);
themeArray.forEach((element) => {
  const imageSrc = element.dataset.theme;

  element.addEventListener("click", (e) => {
    console.log("dsd");
    // document.querySelector("#poll-container").baseURI = `${imageSrc}`
    document.querySelector(
      "#poll-container"
    ).style.backgroundImage = `url(${imageSrc})`;
    document.getElementById("colorBox").style.display = "none";
  });

  element.addEventListener("mouseenter", (e) => {
    console.log("dsd");
    // document.querySelector("#poll-container").baseURI = `${imageSrc}`
    document.querySelector(
      "#poll-container"
    ).style.backgroundImage = `url(${imageSrc})`;
  });
});

const ratings = document.querySelectorAll(".rating");
const ratingsContrainer = document.querySelector(".ratings-container");
const sendButton = document.getElementById("send");
const panel = document.getElementById("panel");
let selectedRating = "Satisfied";

const removeActive = () => {
  for (let i = 0; i < ratings.length; i++) {
    ratings[i].classList.remove("active");
  }
};

ratingsContrainer.addEventListener("click", (e) => {
  if (e.target.parentNode.classList.contains("rating")) {
    removeActive();
    e.target.parentNode.classList.add("active");
    selectedRating = e.target.nextElementSibling.innerText;
  }
});

sendButton.addEventListener("click", (e) => {
  panel.innerHTML = `
  <i class="fa-solid fa-heart"></i>
    <strong>Thank You!</strong>
    <br>
    <strong>Feedback: ${selectedRating} </strong>
    <p>We'll use your feedback to improve our customer support</p>
    `;
});
