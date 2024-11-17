const output = document.querySelector("#op");
const timertxt = document.querySelector("#timer");
const textpre = document.querySelector("#textpreview");
const inputField = document.querySelector("#inp");
var list = ["VITSPACE", "JOEL"];
var selectedwords = [];
var index = 0;
var enteredtext = "";
var count = 0;
var firsttime = 0;
var batchSize = 20; // Display 20 words at a time

fetch('/words.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    list = data.split(", ");
    console.log(list); // Logs the content of the file
    cae();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

function cae() {
  var txt = "";
  for (var i = 0; i < 100; i++) {
    let randomItem = list[Math.floor(Math.random() * list.length)];
    selectedwords.push(randomItem);
    txt += randomItem + " ";
  }
  console.log(txt);
  console.log(selectedwords);
  updateTextPreview(); // Display the first batch of 20 words
}

document.getElementById('textpreview').addEventListener('copy', function (event) {
  event.preventDefault(); // Block the copy action
  alert('Copying is disabled for this text!');
});

document.getElementById('main').addEventListener('contextmenu', function (event) {
  event.preventDefault(); // Disable right-click
  alert('Right-click is disabled HERE!');
});

let seconds = 60; // Timer duration in seconds
let interval; // Declare interval variable globally

const startTimer = () => {
  interval = setInterval(() => {
    console.log(seconds); // Display seconds in the console or update the UI
    timertxt.textContent = seconds - 1;
    seconds--;
    if (seconds == 0) {
      clearInterval(interval);
      console.log('Timer ended!');
      inputField.readOnly = true;
      output.textContent = String(count) + " WPM";
    }
  }, 1000); // Update every second (1000 milliseconds)
};

inputField.addEventListener('keydown', function (event) {
  if (event.key === ' ') { // Check if space key was pressed
    enteredtext = inputField.value.trim();
    console.log(enteredtext);
    console.log(selectedwords[index]); // Log the input field value to the console

    if (selectedwords[index] === enteredtext) {
      count += 1;
    }
    index += 1;
    inputField.value = ""; // Clear the input field
    console.log(count);
    
    // Update text preview to show the next word batch when 20 words are typed
    if (index % batchSize === 0) {
      updateTextPreview();
    } else {
      updateTextPreview(); // Continuously update even if within the current batch
    }
  }
});

inputField.addEventListener('keypress', function (event) {
  if (firsttime === 0) {
    firsttime = 1; // First time keypress (start timer)
    startTimer(); // Start the timer only once
  } else {
    firsttime = 2; // For subsequent key presses
  }
});

function updateTextPreview() {
  // Calculate the start and end index for the current batch of 20 words
  let start = Math.floor(index / batchSize) * batchSize;
  let end = start + batchSize;

  // Ensure that the end index does not exceed the total words available
  if (end > selectedwords.length) end = selectedwords.length;

  let htmlContent = '';
  selectedwords.slice(start, end).forEach((word, idx) => {
    if (start + idx === index) {
      // Highlight the current word being typed in red
      htmlContent += `<span style="color: red;">${word}</span> `;
    } else {
      htmlContent += `${word} `;
    }
  });

  // Update the text preview with the current batch of words
  textpre.innerHTML = htmlContent;
}
