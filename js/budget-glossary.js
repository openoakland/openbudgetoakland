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
  if (window.localStorage) {
    const ls = window.localStorage;
    // skip column headings from spreadsheet before interating
    formattedRes.data.budgetterms.shift();
    formattedRes.data.budgetterms.forEach((term, i) => {
      if ( term[2] && term[2].length > 0 ) {
        ls.setItem(term[0], term[2]);
      }
    });
  }
}
function logError(err) {
  console.error(`Oops! ${err}`);
}

function fetchDefinitions(url, options={}) {
  fetch(url, options)
  .then(validateRes)
  .then(formatRes)
  .then(saveRes)
  .catch(logError);
}

// function prepareToAppendDefinitions() {
//   const chart = document.querySelector("#chart svg");
//   chart.addEventListener('click', (ev) => {
//     if (isValidTarget(ev)) appendDefinitionOnce(ev);
//   });
  
// }

// function isValidTarget(ev) {
//   return (ev.target.nodeName === "rect" && ev.target.nextElementSibling.nodeName === "text");
// }

// function appendDefinitionOnce(ev) {
//   const mainText = ev.target.nextElementSibling;
//   const term = mainText.textContent.split(":")[0];
//   const def = window.localStorage.getItem(term);

//   if ( def && (! mainText.nextElementSibling || mainText.nextElementSibling.nodeName !== 'text') ) {
//     const bkgColor = ev.target.style.fill;
//     console.log(`${term}: ${def} in ${bkgColor}`);
//     const auxiliaryText = document.createElement('text');
//     // auxiliaryText.classList.add('term-definition');
//     auxiliaryText.textContent = `${def}`;
//     auxiliaryText.setAttribute('style', `fill: ${bkgColor}`);
//     auxiliaryText.setAttribute('x', mainText.getAttribute('x'));
//     auxiliaryText.setAttribute('dy', mainText.getAttribute('dy'));
//     auxiliaryText.setAttribute('text-anchor', mainText.getAttribute('text-anchor'));
//     // debugger;
//     auxiliaryText.setAttribute('y', parseInt(mainText.getAttribute('y')) * 2);
//     // auxiliaryText.style('background-color', bkgColor);
//     ev.target.parentNode.appendChild(auxiliaryText);
//   } else {
//     console.warn(`This term is missing from the API: ${term}. Please ask OBO staff to check for misspellings or missing information in their spreadsheet.`);
//   }
// }

fetchDefinitions( 'https://oboterms-g55nbvma6a-wn.a.run.app/Overview' );

// prepareToAppendDefinitions();

