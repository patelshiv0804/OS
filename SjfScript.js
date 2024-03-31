var ganttData = [];
var processIds = [];
var arrivalTimes = [];
var burstTimes = [];
var completionTimes = [];
var turnaroundTimes = [];
var waitingTimes = [];
var executedFlags = [];
var numberOfProcesses = 0;

function createTableHTML() {
    var tableHTML = "<center><table><tr><th>Process ID</th><th>Arrival Time</th><th>Burst Time</th></tr>";
    for (var i = 0; i < numberOfProcesses; i++) {
        tableHTML += `<tr><td>P${i + 1}</td><td><input type="number" id="a${i}"></td><td><input type="number" id="b${i}"></td></tr>`;
    }
    tableHTML += "</table></center>";
    return tableHTML;
}

function getInput() {
    const inputTable = document.querySelector("#input");
    numberOfProcesses = parseInt(document.getElementById("processes").value);

    inputTable.innerHTML = createTableHTML();
    document.querySelector("body").append(inputTable);
    const btn = document.getElementById("std");
    btn.disabled = false; // Enable the "Start Simulation" button
    document.getElementById("output").innerHTML = ""; // Clear previous output
}



function clearData() {
    ganttData = [];
    processIds = [];
    arrivalTimes = [];
    burstTimes = [];
    completionTimes = [];
    turnaroundTimes = [];
    waitingTimes = [];
    executedFlags = [];
    numberOfProcesses = 0;
    document.getElementById("processes").value = "";
    document.getElementById("input").innerHTML = "";
    // document.getElementById("startBtn").style.display = "none";
    document.getElementById("output").innerHTML = "";
}

function startSimulation() {
    var currentTime = 0;
    var totalProcessesExecuted = 0;
    var averageWaitingTime = 0;
    var averageTurnaroundTime = 0;

    var output = document.getElementById("output");
    output.innerHTML = "" ;

    for (var i = 0; i < numberOfProcesses; i++) {
        arrivalTimes[i] = parseInt(document.getElementById(`a${i}`).value);
        burstTimes[i] = parseInt(document.getElementById(`b${i}`).value);
        processIds[i] = i + 1;
        executedFlags[i] = 0; // what is use of the executed flag
    }

    while (true) {
        var currentProcess = numberOfProcesses;
        var minBurstTime = Number.MAX_VALUE;

        if (totalProcessesExecuted == numberOfProcesses)
            break;

        for (var i = 0; i < numberOfProcesses; i++) {
            if (arrivalTimes[i] <= currentTime && executedFlags[i] == 0 && burstTimes[i] < minBurstTime) {
                minBurstTime = burstTimes[i];
                currentProcess = i;
            }
        }

        if (currentProcess == numberOfProcesses)
            currentTime++;
        else {
            completionTimes[currentProcess] = currentTime + burstTimes[currentProcess];
            currentTime += burstTimes[currentProcess];
            turnaroundTimes[currentProcess] = completionTimes[currentProcess] - arrivalTimes[currentProcess];
            waitingTimes[currentProcess] = turnaroundTimes[currentProcess] - burstTimes[currentProcess];
            executedFlags[currentProcess] = 1;
            totalProcessesExecuted++;
            ganttData.push({ pid: processIds[currentProcess], start: currentTime - burstTimes[currentProcess], end: currentTime });
        }
    }

    var table = "<table><tr><th>PID</th><th>AT</th><th>BT</th><th>CT</th><th>TAT</th><th>WT</th></tr>";
    for (var i = 0; i < numberOfProcesses; i++) {
        averageWaitingTime += waitingTimes[i];
        averageTurnaroundTime += turnaroundTimes[i];
        table += "<tr><td>" + processIds[i] + "</td><td>" + arrivalTimes[i] + "</td><td>" + burstTimes[i] + "</td><td>" + completionTimes[i] + "</td><td>" + turnaroundTimes[i] + "</td><td>" + waitingTimes[i] + "</td></tr>";
    }
    table += "</table>";

    averageTurnaroundTime /= numberOfProcesses;
    averageWaitingTime /= numberOfProcesses;

    var ganttChart = "<div class='gantt-chart'>";
    for (var i = 0; i < ganttData.length; i++) {
        var width = (ganttData[i].end - ganttData[i].start) * 20;
        ganttChart += "<div class='gantt-bar' style='width:" + width + "px'>" +"P"+ ganttData[i].pid + "</div>";
    }
    ganttChart += "</div>";

    output.innerHTML = table;
    output.innerHTML += "<p>Average turn around time is " + averageTurnaroundTime.toFixed(2) + "</p>";
    output.innerHTML += "<p>Average waiting time is " + averageWaitingTime.toFixed(2) + "</p>";
    output.innerHTML += ganttChart;
}
