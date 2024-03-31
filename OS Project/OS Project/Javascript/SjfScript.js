function startSimulation() {
    var numberOfProcesses = parseInt(document.getElementById("processes").value);
    var currentTime = 0;
    var totalProcessesExecuted = 0;
    var averageWaitingTime = 0;
    var averageTurnaroundTime = 0;

    var output = document.getElementById("output");
    output.innerHTML = "";

    var ganttData = [];
    var processIds = [];
    var arrivalTimes = [];
    var burstTimes = [];
    var completionTimes = [];
    var turnaroundTimes = [];
    var waitingTimes = [];
    var executedFlags = [];

    for (var i = 0; i < numberOfProcesses; i++) {
        arrivalTimes[i] = parseInt(prompt("Enter process " + (i + 1) + " arrival time:"));
        burstTimes[i] = parseInt(prompt("Enter process " + (i + 1) + " burst time:"));
        processIds[i] = i + 1;
        executedFlags[i] = 0;
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
            ganttData.push({pid: processIds[currentProcess], start: currentTime - burstTimes[currentProcess], end: currentTime});
        }
    }

    var table = "<table><tr><th>PID</th><th>Arrival</th><th>Burst</th><th>Complete</th><th>Turn</th><th>Waiting</th></tr>";
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
        ganttChart += "<div class='gantt-bar' style='width:" + width + "px'>" + ganttData[i].pid + "</div>";
    }
    ganttChart += "</div>";

    output.innerHTML = table;
    output.innerHTML += "<p>Average turn around time is " + averageTurnaroundTime.toFixed(2) + "</p>";
    output.innerHTML += "<p>Average waiting time is " + averageWaitingTime.toFixed(2) + "</p>";
    output.innerHTML += ganttChart;
}
