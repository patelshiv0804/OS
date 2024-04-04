

class Fork {
    constructor(name) {
        this.name = name;
        this.isAvail = 1;
    }

    async wait(philosopherName, side) {
        const message = philosopherName + " Using " + this.name + " as " + side + " fork..";
        appendToOutput(message);
        this.isAvail = 0;
    }

    async signal(philosopherName, side) {
        const message = philosopherName + " Releasing " + this.name + " as " + side + " fork..";
        appendToOutput(message);
        this.isAvail = 1;
    }
}

class Philosopher {
    constructor(name, leftFork, rightFork) {
        this.name = name;
        this.leftFork = leftFork;
        this.rightFork = rightFork;
        this.finishedEating = false;
    }

    async consume() {
        if (this.leftFork.isAvail === 1 && this.rightFork.isAvail === 1) {
            this.leftFork.wait(this.name, "Left");
            this.rightFork.wait(this.name, "Right");
            await this.eat();
            this.rightFork.signal(this.name, "Right");
            this.leftFork.signal(this.name, "Left");
            this.finishedEating = true;
            await this.think();
        } else {
            const message = this.name + " Waiting for forks..";
            appendToOutput(message);
            await this.think();
        }
    }

    async eat() {
        const message = this.name + " Eating..";
        appendToOutput(message);
        const philosopherImage = document.getElementById("philosopher" + this.name[12]);
        
        if(this.name === "Philosopher 1:- ")
        {
            
            p1Msg.innerText = "Eating...";
        }
        else if(this.name === "Philosopher 2:- ")
        {
            
            p2Msg.innerText = "Eating...";
        }
        else if(this.name === "Philosopher 3:- ")
        {
            
            p3Msg.innerText = "Eating...";
        }
        else if(this.name === "Philosopher 4:- ")
        {
           
            p4Msg.innerText = "Eating...";
        }
        else
        {
           
            p5Msg.innerText = "Eating...";
        }

        
        
        console.log(this.name);
        console.log(philosopherImage);
        philosopherImage.style.transform = "scale(1.2)"; 
        philosopherImage.style.transition = "transform 0.6s";
        await new Promise(resolve => (setTimeout(resolve, 3000)));
        philosopherImage.style.transform = "scale(1)"; 
    }
    async think() {
        const message = this.name + " Thinking..";
        if(this.name === "Philosopher 1:- ")
        {
            
            p1Msg.innerText = "Thinking...";
        }
        else if(this.name === "Philosopher 2:- ")
        {
            
            p2Msg.innerText = "Thinking...";
        }
        else if(this.name === "Philosopher 3:- ")
        {
            
            p3Msg.innerText = "Thinking...";
        }
        else if(this.name === "Philosopher 4:- ")
        {
            
            p4Msg.innerText = "Thinking...";
        }
        else
        {
           
            p5Msg.innerText = "Thinking...";
        }

        appendToOutput(message);
        
        await new Promise(resolve => (setTimeout(resolve, 3000))); 
    }

    async start() {
        while (!this.finishedEating) {
            await this.consume();
        }
        return this.name + " has finished eating.";
    }
}

const forks = [
    new Fork("Fork 1"),
    new Fork("Fork 2"),
    new Fork("Fork 3"),
    new Fork("Fork 4"),
    new Fork("Fork 5")
];

const philosopherForkPair = [
    new Philosopher("Philosopher 1:- ", forks[0], forks[1]),
    new Philosopher("Philosopher 2:- ", forks[1], forks[2]),
    new Philosopher("Philosopher 3:- ", forks[2], forks[3]),
    new Philosopher("Philosopher 4:- ", forks[3], forks[4]),
    new Philosopher("Philosopher 5:- ", forks[0], forks[4])
];

function startAllPhilosophers(sequence) {
    const promises = [];
    for(let i=0; i<sequence.length; i++)
    {
        promises.push(philosopherForkPair[sequence[i]-1].start());
    }
    
    Promise.all(promises).then(results => {
        appendToOutput("All philosophers have finished eating.");
    });
}

function appendToOutput(message) {
    const outputLines = document.querySelector("#outputLines");
    const div = document.createElement("div");
    div.textContent = message;
    div.style.textAlign="center";
    
    
    if (message.includes("Thinking")) {
        div.style.color = " #35c3ff ";
    } else if (message.includes("Waiting for forks")) {
        div.style.color = " #5bd5c8 ";
    } else if (message.includes("Eating")) {
        div.style.color = "#5C6BC0";
    } else if (message.includes("Using") || message.includes("Releasing")) {
        div.style.color = "#4DD0E1";
    } else if (message.includes("All philosophers have finished eating")) {
        div.style.fontWeight = "bold ";
        div.style.color = "ghostwhite";
    } else {
        div.style.color = "red";
    }

    outputLines.appendChild(div);
    outputLines.appendChild(document.createElement("br"));
}

const p1Msg = document.getElementById("p1Msg");
const p2Msg = document.getElementById("p2Msg");
const p3Msg = document.getElementById("p3Msg");
const p4Msg = document.getElementById("p4Msg");
const p5Msg = document.getElementById("p5Msg");

const inputVal = document.querySelectorAll("input");
let btnStart = document.querySelector("#start");
let btnReset = document.querySelector("#reset");
btnStart.addEventListener("click", (evt) => {
    evt.preventDefault();

    p1Msg.innerText = "Thinking...";
    p2Msg.innerText = "Thinking...";
    p3Msg.innerText = "Thinking...";
    p4Msg.innerText = "Thinking...";
    p5Msg.innerText = "Thinking...";
 
    const sequence = [];
    for (let i = 0; i < inputVal.length; i++) {
        sequence.push(parseInt(inputVal[i].value));
    }
    startAllPhilosophers(sequence);
});

btnReset.addEventListener("click", ()=>{
    outputLines.innerHTML="";
    for (let i = 0; i < inputVal.length; i++) {
        inputVal[i].value="";
    }
    for(let i=0; i<philosopherForkPair.length; i++)
    {
        philosopherForkPair[i].finishedEating= false;
    }
});
