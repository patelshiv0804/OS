let btnSimulate = document.querySelector("#simulate");
let body = document.querySelector("body");
let userRequest = document.querySelector("#trackReq");
let disk = document.querySelector("#diskSize");
let head = document.querySelector("#headPosition");
let clookMap = document.querySelector("#clook");
let lookMap = document.querySelector("#look");
let printIdx1 = 0, printIdx2 = 0;
let trackReq=[], diskSize, headPos;
let cLook = false;
let makeArray = (request, diskSize)=> {
    let track = "";
    for(let i=0; i<request.length; i++)
    {
        if(request[i] == " ")
        {
            if(track != "")
            {
                trackReq.push(parseInt(track));
                track="";
            }       
        }
        track += request[i];
        
    }
    if(track != "" && parseInt(track) < diskSize)
    {
        trackReq.push(parseInt(track));
    }
    return trackReq;
}
let setCounter = (sortedRequest, headPos) => {
    let left = 0;
    let right = sortedRequest.length - 1;

    while (left <= right) { 
        let mid = Math.floor(left + (right - left) / 2); 
        if (sortedRequest[mid] < headPos) {
            left = mid + 1; 
        } else {
            right = mid - 1; 
        }
    }

   
    console.log(left);
    return left; 
}




const drawClookMap = (diskSize, headPos, seekSequenceClook, cLookSeekOpr, clookOutArr, printIdx1, printIdx2) => {
    const canvas = document.createElement('canvas');
    canvas.width = diskSize * 2;
    canvas.height = 300; // Increased height for better visualization
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal lines for disk tracks
    ctx.strokeStyle = 'black'; // Changed line color to black
    ctx.lineWidth = 2;
    for (let i = 0; i < clookOutArr.length; i++) {
        const x = 0; // Start the line from the left edge of the canvas
        const y = i * 30 + 50; // Increased spacing between lines and offset to avoid overlap
        const lineLength = clookOutArr[i] * 2;
        // Draw line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + lineLength, y); // Draw the line horizontally based on disk track value
        ctx.stroke();
        // Draw circle at some distance from the end of the line
        const circleRadius = 5;
        const circleX = x + lineLength + 20; // Adjust the distance from the line
        const circleY = y;
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        if (i > printIdx1 && i < printIdx2) {
            ctx.fillStyle = 'red'; // Changed circle color to red
        } else {
            ctx.fillStyle = 'green'; // Changed circle color to green
        }
        ctx.fill();
        // Draw text label
        ctx.fillStyle = 'blue'; // Changed text color to blue
        ctx.fillText(clookOutArr[i].toString(), x + 10, y - 10); // Adjusted text position
    }

    clookMap.innerHTML = '';
    clookMap.appendChild(canvas);

    // Create algorithm information div
    let infoDiv = document.createElement('div');
    infoDiv.className = 'algorithm-info';
    infoDiv.innerHTML = `
        <h2>Clook Disk Scheduling</h2>
        <p>Initial Head Position : ${headPos}</p>
        <p>Seek Operation Count: ${cLookSeekOpr}</p>
        <p>Seek Sequence: ${seekSequenceClook.join(', ')}</p>
    `;
    clookMap.appendChild(infoDiv);
};

const drawLookMap = (diskSize, headPos, seekSequenceLook, lookSeekOpr) => {
    const canvas = document.createElement('canvas');
    canvas.width = diskSize * 2;
    canvas.height = 300; // Increased height for better visualization
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal lines for disk tracks
    ctx.strokeStyle = 'black'; // Changed line color to black
    ctx.lineWidth = 2;
    for (let i = 0; i < seekSequenceLook.length; i++) {
        const x = 0; // Start the line from the left edge of the canvas
        const y = i * 30 + 50; // Increased spacing between lines and offset to avoid overlap
        const lineLength = seekSequenceLook[i] * 2;
        // Draw line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + lineLength, y); // Draw the line horizontally based on disk track value
        ctx.stroke();
        // Draw circle at some distance from the end of the line
        const circleRadius = 5;
        const circleX = x + lineLength + 20; // Adjust the distance from the line
        const circleY = y;
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'green'; // Changed circle color to green
        ctx.fill();
        // Draw text label
        ctx.fillStyle = 'blue'; // Changed text color to blue
        ctx.fillText(seekSequenceLook[i].toString(), x + 10, y - 10); // Adjusted text position
    }

    lookMap.innerHTML = '';
    lookMap.appendChild(canvas);

    // Create algorithm information div
    let infoDiv = document.createElement('div');
    infoDiv.className = 'algorithm-info';
    infoDiv.innerHTML = `
        <h2>Look Disk Scheduling</h2>
        <p>Initial Head Position : ${headPos}</p>
        <p>Seek Operation Count: ${lookSeekOpr}</p>
        <p>Seek Sequence: ${seekSequenceLook.join(', ')}</p>
    `;
    lookMap.appendChild(infoDiv);
};


const outMakerClook = (sortedRequest, startCounter)=>{
    let output = [];
    for(let i=startCounter; i<sortedRequest.length; i++)
    {
        output.push(sortedRequest[i]);
    }
    printIdx1 = output.length;
    printIdx1 = printIdx1-1;
    for(let i=startCounter-1; i>=0; i--)
    {
        output.push(sortedRequest[i]);
    }
    printIdx2 = output.length;
    printIdx2 = printIdx2-1;
    for(let i=1; i<startCounter; i++)
    {
        output.push(sortedRequest[i]);
    }
    console.log(sortedRequest[startCounter-1]);
    console.log(output);
    return output;
}


btnSimulate.addEventListener("click", (evt)=>{
    
    diskSize = disk.value;
    headPos  = head.value;
    let track = "";
    let request = userRequest.value.trim();
    disk.value="";
    head.value="";
    userRequest.value="";
    trackReq = makeArray(request, diskSize);
    const sortedRequest = trackReq.toSorted((a, b) => a - b);
    let startCounter = setCounter(sortedRequest, headPos);
    // console.log(sortedRequest);
    let seekSequenceClook = [];
    let seekSequenceLook = [];
    let cLookSeekOpr = 0;
    let lookSeekOpr = 0;

        for(let i=startCounter; i<sortedRequest.length; i++)
        {
            seekSequenceClook.push(sortedRequest[i]);
            seekSequenceLook.push(sortedRequest[i]);
        }

   
        for(let i=0; i<startCounter; i++)
        {
            seekSequenceClook.push(sortedRequest[i]);
        }
    
    
        for(let i=startCounter-1; i>=0; i--)
        {
            seekSequenceLook.push(sortedRequest[i]);
        }
        if(startCounter == 0)
        {
            cLookSeekOpr += sortedRequest[sortedRequest.length-1]-headPos;
            lookSeekOpr += sortedRequest[sortedRequest.length-1]-headPos;
        }
        else if(startCounter >= seekSequenceClook.length-1)
        {
            cLookSeekOpr += sortedRequest[sortedRequest.length-1]-sortedRequest[0];
            cLookSeekOpr += sortedRequest[sortedRequest.length-1]-sortedRequest[0];
            lookSeekOpr += sortedRequest[seekSequenceLook.length-1]-sortedRequest[0];
        }
        else
        {
            cLookSeekOpr += sortedRequest[sortedRequest.length-1]-headPos;
            cLookSeekOpr += sortedRequest[sortedRequest.length-1]-sortedRequest[0];
            cLookSeekOpr += sortedRequest[startCounter-1]-sortedRequest[0];


            lookSeekOpr += sortedRequest[sortedRequest.length-1]-headPos;
            lookSeekOpr += sortedRequest[sortedRequest.length-1]-sortedRequest[0];
        }
        
    
    console.log(seekSequenceClook);
    console.log(seekSequenceLook);
    let clookOutArr = outMakerClook(sortedRequest, startCounter);
  
    console.log(printIdx1,printIdx2);
    drawClookMap(diskSize, headPos, seekSequenceClook, cLookSeekOpr, clookOutArr, printIdx1, printIdx2);
    drawLookMap(diskSize, headPos, seekSequenceLook, lookSeekOpr);


}); 