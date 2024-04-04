let frameSize;
let pages = new Set();
let q = [];
let hitCount = 0;
let pageFault = 0;
let simulationResults = document.getElementById("simulationResults");;


function startSimulation() {
  // frameSize = parseInt(document.getElementById("frameSize").value);
  document.getElementById("frameSize").value = "";
  hitCount = 0;
  pageFault = 0;
  pages.clear();
  q = [];
  clearPageNumberField();
  simulationResults.innerHTML = "";
}

function clearPageNumberField() {
  document.getElementById("pageNumber").value = "";
}

function simulateFIFO() {
  frameSize = parseInt(document.getElementById("frameSize").value);
  simulationResults = document.getElementById("simulationResults");
  simulationResults.innerHTML = "";
  let page = parseInt(document.getElementById("pageNumber").value);
  if (!isNaN(page)) {
    if (pages.has(page)) {
      hitCount++;
    } else {
      pageFault++;
      if (q.length === frameSize) {
        let topPage = q.shift();
        pages.delete(topPage);
      }
      q.push(page);
      pages.add(page);
    }
    displayResults();
    clearPageNumberField();
  } else {
    alert("Please enter a valid page number.");
  }
}

function displayResults() {
  
  let totalAccesses = hitCount + pageFault;
  let hitPercentage = (hitCount / totalAccesses) * 100;
  let faultPercentage = (pageFault / totalAccesses) * 100;
  
  
  // let result = "<div class='block'><div class='block-inner'>Page hit count = " + hitCount + "</div></div>";
  let result = "<div class='block'><div class='block-inner'>Page hit count = " + hitCount + " (" + hitPercentage.toFixed(2) + "%)</div></div>";


  // result += "<div class='block'><div class='block-inner'>Page fault count = " + pageFault + "</div></div>";
  result += "<div class='block'><div class='block-inner'>Page fault count = " + pageFault + " (" + faultPercentage.toFixed(2) + "%)</div></div>";

  // result += "<div class='block'><div class='block-inner'>Queue Status :&nbsp&nbsp</div>";
  result += "<div class='block'><div class='block-inner'>Queue Status :&nbsp&nbsp</div>";


  for (let i = 0; i < frameSize; i++) {
    result += "<div class='queue-block' style='background-color:" + (q[i] ? "lightblue" : "lightgreen") + "'>" + (q[i] ? q[i] : "NA") + "</div>";
  }

  result += "</div>";
  simulationResults.innerHTML = result;
}