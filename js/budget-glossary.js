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

fetchDefinitions( 'https://oboterms-g55nbvma6a-wn.a.run.app/Overview' );

// prepareToAppendDefinitions();

