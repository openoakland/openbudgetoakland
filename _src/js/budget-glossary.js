function validateRes(res) {
  if (! res.ok) {
    throw Error(res.statusText);
  }
  return res;
}
function formatRes(res) {
  return res.json();
}
function saveRes(formattedRes) {
  console.log(formattedRes);
}
function logError(err) {
  console.error('Oops!' + err);
}
function fetchDefinitions(url, options={}) {
  fetch(url, options)
  .then(validateRes)
  .then(formatRes)
  .then(saveRes)
  .catch(logError);
}

fetchDefinitions( 'https://oboterms7-g55nbvma6a-wn.a.run.app/Overview', {
  headers: new Headers({
    'Content-Type': 'text/plain, application/json',
  })
});

  // store data.overview in local storage
  // if (window.localStorage) {
  //   const ls = window.localStorage;
  //   data.overview.forEach(term => {
  //     if (term.description !== "") {ls.setItem(term.budgetTerm, term.description);}
  //   });
  // }
  // // show tool tip when rect element is clicked
  // // addEventListener() to common ancestor of all rects
  // const chart = document.getElementById("chart");
  // chart.addEventListener('click', (ev) => {
  //   console.log( ev.target.nextElementSibling.textContent.split(":")[0] );
  //   if (ev.target.nodeName === "rect" && ev.target.nextElementSibling.nodeName === "text") {
  //     const term = ev.target.nextElementSibling.textContent.split(":")[0];
  //     if (!localStorage[term]) {console.log("This term is missing from the API: " + term);}
  //     const bkgColor = ev.target.style.fill;
  //     // 
  //   }
  // });


// function showDefinition(term) {}