var rampStart;
var rampEnd;
var rampRate; //Degrees C per min
var meltingPoint;
var unknownCode;
var simIsRunning;
var unknownLib = new Array();
var nameField;

d3.csv('https://raw.githubusercontent.com/mmcpartlan98/mmcpartlan98.github.io/master/lib.csv',function(data){
   	unknownLib.push(data);
  });

var timeoutQueue = new Array(setTimeout(function() {
  console.log("Starting...");
}, 10));

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function loggerCallback(responseText) {
	console.log("Log submitted");
}

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

function rampRateConfoundulator(rate) {
	var randNum;
	var polarity = Math.random();
	if (polarity >= 0.5) {
		polarity = 1;
	} else {
		polarity = -1;
	}
	if (rate <= 3) {
		randNum = Math.floor(Math.random() * 2) - 1;
	} else if (rate <= 5) {
		randNum = Math.floor(Math.random() * 5) - 2;
	} else if (rate <= 10) {
		randNum = Math.floor(Math.random() * 6) - 3;
	} else {
		randNum = Math.floor(Math.random() * 7) - 4;
	}
	return polarity * randNum;
}

function startButton() {
  if (simIsRunning) {
	  resetButton();
  }
  simIsRunning = true;
  //console.log("Start detected!")
  if (isNaN(parseFloat(document.getElementById("rstart").value))) {
     alert("Start temperature cannot be blank!")
     return false;
   } else {
     rampStart = parseFloat(document.getElementById("rstart").value);
   }
  if (document.getElementById("name").value == "") {
     alert("Start temperature cannot be blank!")
     return false;
   } else {
     nameField = document.getElementById("name").value;
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
    unknownCode = parseInt(document.getElementById("mpset").value);
	
	meltingPoint = -1; // Error state
	  
	for (index in unknownLib) {
		if (Math.floor(unknownCode/10) == Math.floor(parseInt(unknownLib[index].id)/10)) {
			meltingPoint = parseFloat(unknownLib[index].mp);
			
			var impurityModifier = (unknownCode/10 - Math.floor(unknownCode/10))/5;
			meltingPoint = meltingPoint - meltingPoint * impurityModifier;
			
			console.log(unknownLib[index].name + " w/ impurity modifier " + impurityModifier);
		}
	}
	  
	if (meltingPoint == -1) {
		alert("Invalid unknown code");
		return false;
	}
	  
	meltingPoint = meltingPoint + rampRateConfoundulator(rampRate);
	  console.log(meltingPoint);
  }
  var currentdate = new Date(); 
  var datetime = "Simulation Date: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "@"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  GETRequest = "https://script.google.com/macros/s/AKfycbxE_XTSSbdqd1-bejqTxFHwgspP3d6CjCwkEZ6ZDZM0x50P-rzr/exec?Name=" + nameField + "&RampRate=" + rampRate + "&SimDate=" + datetime;
  console.log(GETRequest);
  httpGetAsync(GETRequest, loggerCallback);
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
// Clear que of delayed actions first
  timeoutQueue.forEach(index => {
      clearTimeout(index);
  });
	
  document.getElementById("thermometer").innerHTML = "Temperature: ";
  document.getElementById("endImage").style.opacity = "0";
  temp = rampStart;
  //console.log("Reset detected!")
}

function clearButton() {
	// Clear que of delayed actions first
  timeoutQueue.forEach(index => {
      clearTimeout(index);
  });
	
  document.getElementById("end").innerHTML = "End temperature: ";
  document.getElementById("ramp").innerHTML = "Ramp rate: ";
	
  document.getElementById("rend").value = '';
  document.getElementById("rrate").value = '';
  document.getElementById("mpset").value = '';
	
  document.getElementById("thermometer").innerHTML = "Temperature: ";
  document.getElementById("endImage").style.opacity = "0";
  temp = rampStart;
}

function focusMP() {
	console.log("MP selection registered.")
	document.getElementById("intro").style.cssText = "display: none !important;";
	document.getElementById("tlc-sim").style.cssText = "display: none !important;";
	document.getElementById("irspec-sim").style.cssText = "display: none !important;";
	document.getElementById("melting-point-sim").setAttribute('style', 'display:inline-block !important');
	document.getElementById("purificationQuiz").setAttribute('style', 'display: none !important');
}

function focusTLC() {
	console.log("TLC selection registered.")
	document.getElementById("intro").style.cssText = "display: none !important;";
	document.getElementById("melting-point-sim").style.cssText = "display: none !important;";
	document.getElementById("irspec-sim").style.cssText = "display: none !important;";
	document.getElementById("tlc-sim").setAttribute('style', 'display:inline-block !important');
	document.getElementById("purificationQuiz").setAttribute('style', 'display: none !important');
}
function focusIRSpec() {
	console.log("IR Spec selection registered.")
	document.getElementById("intro").style.cssText = "display: none !important;";
	document.getElementById("tlc-sim").style.cssText = "display: none !important;";
	document.getElementById("melting-point-sim").style.cssText = "display: none !important;";
	document.getElementById("irspec-sim").setAttribute('style', 'display:inline-block !important');
	document.getElementById("purificationQuiz").setAttribute('style', 'display: none !important');
}
function focusForm() {
	console.log("Form selection registered.")
	document.getElementById("intro").style.cssText = "display: none !important;";
	document.getElementById("tlc-sim").style.cssText = "display: none !important;";
	document.getElementById("melting-point-sim").style.cssText = "display: none !important;";
	document.getElementById("irspec-sim").setAttribute('style', 'display: none !important');
	document.getElementById("purificationQuiz").setAttribute('style', 'display: inline-block !important');
}