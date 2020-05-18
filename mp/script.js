var i;
for (i = 100; i > 0; i--) {
  task(i);
}

function task(i) {
  setTimeout(function() {
      console.log(document.getElementById("endImage").style.opacity);
      document.getElementById("endImage").style.opacity = String(i/100);
  }, 200 * i);
}
