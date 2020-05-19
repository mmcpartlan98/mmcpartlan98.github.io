var meltingPoint = 60;
// Set initial conditions
var defaultRampStart = 40;
var defaultRampEnd = 120;
var defaultRampRate = 40; //Degrees C per min

var rampStart = defaultRampStart;
var rampEnd = defaultRampEnd;
var rampRate = defaultRampRate; //Degrees C per min
var temp = rampStart;
var timeoutQueue = new Array(setTimeout(function() {
  console.log("Starting...");
  document.getElementById("start").innerHTML = "Start temperature: ".concat(String(rampStart.toFixed(2)), " C");
  document.getElementById("end").innerHTML = "End temperature: ".concat(String(rampEnd.toFixed(2)), " C");
  document.getElementById("ramp").innerHTML = "Ramp rate: ".concat(String(rampRate.toFixed(2)), " C/min");
}, 10));

function task2(temp, iterations) {
  timeoutQueue.push(setTimeout(function() {
    document.getElementById("thermometer").innerHTML = "Temperature: ".concat(String(temp.toFixed(2)), " C");
    if (temp > meltingPoint * 0.85){
      console.log("Melting: ".concat(String(temp)));
      document.getElementById("endImage").style.opacity = String((temp - meltingPoint * 0.85) / (meltingPoint * 0.20));
    } else {
      console.log("Not Melting: ".concat(String(temp)));
    }
  }, 100 * iterations));
}

function startButton() {
  console.log("Start detected!")
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
  rampStart = defaultRampStart;
  rampEnd = defaultRampEnd;
  rampRate = defaultRampRate;
  temp = rampStart;
  document.getElementById("rstart").value = document.getElementById("rstart").defaultValue;
  document.getElementById("rend").value = document.getElementById("rend").defaultValue;
  document.getElementById("rrate").value = document.getElementById("rrate").defaultValue;
  document.getElementById("start").innerHTML = "Start temperature: ".concat(String(rampStart.toFixed(2)), " C");
  document.getElementById("end").innerHTML = "End temperature: ".concat(String(rampEnd.toFixed(2)), " C");
  document.getElementById("ramp").innerHTML = "Ramp rate: ".concat(String(rampRate.toFixed(2)), " C/min");
  timeoutQueue.forEach(index => {
      clearTimeout(index);
  });
  console.log("Reset detected!")
}

function changeButton() {
  rampStart = parseFloat(document.getElementById("rstart").value);
  rampEnd = parseFloat(document.getElementById("rend").value);
  rampRate = parseFloat(document.getElementById("rrate").value);
  temp = rampStart;
  document.getElementById("start").innerHTML = "Start temperature: ".concat(String(rampStart.toFixed(2)), " C");
  document.getElementById("end").innerHTML = "End temperature: ".concat(String(rampEnd.toFixed(2)), " C");
  document.getElementById("ramp").innerHTML = "Ramp rate: ".concat(String(rampRate.toFixed(2)), " C/min");
  console.log("Change detected!")
}

function setMP() {
  meltingPoint = parseFloat(document.getElementById("mpset").value);
}
