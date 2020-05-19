var rampStart;
var rampEnd;
var rampRate; //Degrees C per min
var meltingPoint;
var unknownCode;

var timeoutQueue = new Array(setTimeout(function() {
  console.log("Starting...");
}, 10));

function task2(temp, iterations) {
  timeoutQueue.push(setTimeout(function() {
    document.getElementById("thermometer").innerHTML = "Temperature: ".concat(String(temp.toFixed(2)), " C");
    if (temp > meltingPoint * 0.85){
      //console.log("Melting: ".concat(String(temp)));
      document.getElementById("endImage").style.opacity = String((temp - meltingPoint * 0.85) / (meltingPoint * 0.20));
    } else {
      //console.log("Not Melting: ".concat(String(temp)));
    }
  }, 100 * iterations));
}

function startButton() {
  //console.log("Start detected!")
  if (isNaN(parseFloat(document.getElementById("rstart").value))) {
    alert("Start temperature cannot be blank!")
    return false;
  } else {
    rampStart = parseFloat(document.getElementById("rstart").value);
  }
  if (isNaN(parseFloat(document.getElementById("rend").value))) {
    alert("End temperature cannot be blank!")
    return false;
  } else {
    rampEnd = parseFloat(document.getElementById("rend").value);
  }
  if (isNaN(parseFloat(document.getElementById("rrate").value))) {
    alert("Ramp rate cannot be blank!")
    return false;
  } else {
    rampRate = parseFloat(document.getElementById("rrate").value);
  }
  if (isNaN(parseFloat(document.getElementById("mpset").value))) {
    alert("Unknown code cannot be blank!")
    return false;
  } else {
    unknownCode = parseFloat(document.getElementById("mpset").value);
    switch(unknownCode) {
      case 1001:
        meltingPoint = 60;
        break;
      case 1002:
        meltingPoint = 180;
        break;
      case 1003:
        meltingPoint = 120;
        break;
      default:
        alert("Invalid unknown code!");
    }
  }

  temp = rampStart;
  document.getElementById("start").innerHTML = "Start temperature: ".concat(String(rampStart.toFixed(2)), " C");
  document.getElementById("end").innerHTML = "End temperature: ".concat(String(rampEnd.toFixed(2)), " C");
  document.getElementById("ramp").innerHTML = "Ramp rate: ".concat(String(rampRate.toFixed(2)), " C/min");
  // Loop updates 10 times per second
  var iterations = 0;
  while (temp < rampEnd) {
    task2(temp, iterations);
    iterations++;
    temp += (rampRate/60)/10;
  }
  temp = rampEnd;
  task2(temp, iterations)
}

function resetButton() {
  document.getElementById("thermometer").innerHTML = "Temperature: ".concat(String(temp.toFixed(2)), " C");
  document.getElementById("endImage").style.opacity = "0";
  temp = rampStart;
  document.getElementById("start").innerHTML = "Start temperature: ".concat(String(rampStart.toFixed(2)), " C");
  document.getElementById("end").innerHTML = "End temperature: ".concat(String(rampEnd.toFixed(2)), " C");
  document.getElementById("ramp").innerHTML = "Ramp rate: ".concat(String(rampRate.toFixed(2)), " C/min");
  timeoutQueue.forEach(index => {
      clearTimeout(index);
  });
  //console.log("Reset detected!")
}
