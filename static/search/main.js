/* Polyfills */

//String.startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

//Array.filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

/* GLOBAL VARIABLES */

//Complete list of college facebook data
var data = [];
var searchResults = [];
var displayCount = 20;

//The base template for an search result item
var baseItem = document.createElement('li');
baseItem.innerHTML = ' \
	<span class="result"> \
		<div class="photo"><img></div> \
		<b>Name</b><br> \
		<span class="email">Email</span><br> \
		<span>Major</span><br> \
		<span>Hometown</span><br> \
		<span class="address">Dorm</span> \
		<span class="college RKEFELLER Rocky Rockefeller"></span><br> \
	</span>';

//The DOM node that is the parent of all results
var resultsNode = document.getElementById('results');

//The main searchbox node
var searchbox = document.getElementById('searchbox');

//Result count node
var resultsCountNode = document.getElementById('result-count');

/* TOP-LEVEL FUNCTIONS */
//Get the initial list of data
function getInitialData() {
	var format_entry = function (entry) {
		//Image url
		entry.img = entry.img + ".png"
		//Email Address
		entry.email = entry.email + "@princeton.edu"
		//Full Name
		entry['name'] = entry.first + ' ' + entry.last
		//Fix for Rocky college
		if (entry.college == "RKEFELLER") {
			entry.college += " Rocky Rockefeller"
		}
		//Class year with 'xx
		entry['class'] = "\'" + (entry['class'] - 2000) + " " + entry['class'];

		//Parse state and country
		var cityRegex = /(.+?), *(\w*) - (\w\w\w)/;
		var match = entry.city.match(cityRegex);
		if (match && match.length == 4) {
			entry.state = match[2];
			entry.country = match[3];
		} else {
			entry.state = "";
			entry.country = "";
		}

		//Make a default category to improve search speed
		var categories = ['name', 'major', 'dorm', 'class', 'email', 'city', 'college'];
		var entries = categories.map(function(cat) {return entry[cat]});
		entry['default'] = entries.join('| ');
		return entry;
	}	

	var request = new XMLHttpRequest();
	request.open('GET', 'data.json', true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			var raw_data = JSON.parse(request.responseText);
			data = raw_data.map(format_entry);
			data.sort(function(a, b) {
		      if (a.last < b.last)
		        return -1;
		      else if (a.last > b.last)
		        return 1;
		      else if (a.first < b.first)
		        return -1;
		      else if(a.first > b.first)
		        return 1;
		      else
		        return 0;
		    })
		    searchResults = data.slice();
			redrawResults();
		} else {
			alert("Error getting data. Please refresh page");
		}
	};
	request.onerror = function() {
		alert("Error getting data. Please refresh page");
	};
	request.send();
}

function setItem(node, info) {
	var items = node.children[0].children;
	//Rather than just modifying src of the img tag, create a new one to force
	//a reload.
	var newImg = document.createElement('img');
	newImg.src = info.img;
	items[0].replaceChild(newImg, items[0].children[0]);

	items[1].innerText = info['name'] + ' ' + info['class'].slice(0, 3);
	items[3].innerText = info['email'];
	items[5].innerText = info['major'];
	items[7].innerText = info['city'];
	items[9].innerText = info['dorm'];
	items[10].className = "college " + info['college'];
}


function redrawResults() {
	var startNodeCount = resultsNode.children.length;
	var leftovers = Array.prototype.slice.call(resultsNode.children, displayCount);
	var len = leftovers.length;
	for (var i = 0; i < len; i++) {
		resultsNode.removeChild(leftovers[i]);
	}
	for (var i = 0; i < displayCount; i++) {
		if (i < startNodeCount) {
			setItem(resultsNode.children[i], searchResults[i]);
		} else {
			var node = baseItem.cloneNode(true);
			setItem(node, searchResults[i]);
			resultsNode.appendChild(node);
		}
	}

	//Set search results count
	resultsCountNode.innerText = searchResults.length;
}

function stringMatch(string, search) {
  return (
    string.toLowerCase().indexOf(search.toLowerCase()) === 0 ||
    string.toLowerCase().indexOf(' ' + search.toLowerCase()) !== -1
  )
}

function matches(person, queryObj) {
	for (var category in queryObj) {
		var len = queryObj[category].length;
		for (var i = 0; i < len; i++) {
			if (!stringMatch(person[category], queryObj[category][i])) return false;
		}
	}
	return true;
}

function parseQuery(query) {
	if (query.indexOf('#') == -1) {
		return {'default': query.split(' ')};
	}
	//Now we have to parse for query parameters
	//Rules: Start with default category. Each #category tag switches the category
	//       until the next tag. No quotations for exact match or special logic (OR / NOT)

	var categories = ['first', 'last', 'name', 'major', 'dorm', 'class', 'email', 'city', 'college'];
	var categoryLookup = {
		'#dorm': 'dorm', '#room': 'dorm',
		'#name': 'name',
		'#first': 'first', '#firstname': 'first',
		'#last': 'last', '#lastname': 'last',
		'#major': 'major', '#department': 'major',
		'#email': 'email', '#netid': 'email',
		'#class': 'class', '#year': 'class',
		'#college': 'college', '#rescollege': 'college',
		'#home': 'city', '#hometown': 'city', '#city': 'city',
		'#state': 'state', '#country': 'country'
	}

	var category = "default";
	var arr = query.split(' ');
	var queryObj = {};
	var curWord;
	for (var i = 0, len = arr.length; i < len; i++) {
		curWord = arr[i];
		if (categoryLookup[curWord] != undefined) {
			category = categoryLookup[curWord];
		} else {
			if (curWord[0] == '#') continue;
			if (queryObj[category]) {
				queryObj[category].push(curWord);
			} else {
				queryObj[category] = [curWord];
			}
		}
	}
	return queryObj;
}

function search() {
	var prevQuery = search.previousQuery;
	var query = searchbox.value;
	if (query == prevQuery) return;

	var startTime = new Date().getTime();

	var queryObj = parseQuery(query);

	if (query.startsWith(prevQuery)) {
		searchResults = searchResults.filter(function(person) {return matches(person, queryObj)});
	} else {
		searchResults = data.filter(function(person) {return matches(person, queryObj)});
	}

	displayCount = 20;
	if (displayCount > searchResults.length) displayCount = searchResults.length;

	redrawResults();

	search.previousQuery = query;

	var timeElapsed = new Date().getTime() - startTime;
	if (!search.limitRate && timeElapsed > 150 && search.lastSearchSpeed > 150) {
		search.limitRate = true;
	}
	if (!search.limitRate && timeElapsed > 500) {
		search.limitRate = true;
	}

	search.lastSearchSpeed = timeElapsed;

	//Prevent event bubbling
	return false;
}
search.previousQuery = "";
//For slower javascript engines, switch to only updating the search on spaces and enters
search.limitRate = false;
search.lastSearchSpeed = 0;

/* EVENT LISTENERS */
window.onscroll = function() {
	if (displayCount < searchResults.length &&
	  resultsNode.getBoundingClientRect().bottom - window.innerHeight < 2000) {
	    displayCount += 50;
		if (displayCount > searchResults.length)
			displayCount = searchResults.length;
		//Don't use redraw results because we know the top nodes won't need to
		for (var i = resultsNode.children.length; i < displayCount; i++) {
			var node = baseItem.cloneNode(true);
			setItem(node, searchResults[i]);
			resultsNode.appendChild(node);
		}
	}
}

//For mobile browsers with poorer performance, only search on spaces or major changes
//in the search content
var rateLimitedSearch = function() {
	if (search.limitRate) {
		query = searchbox.value;
		prevQuery = search.previousQuery;
		if (query[query.length-1] != ' ' &&
			(query.startsWith(prevQuery) || prevQuery.startsWith(query)))
			return;
	}
	search();
}

//For full browser support, (IE 8 + 9, looking at you), we need to also
//listen for onpropertychange (microsoft only). Not a perfect match but pretty good.
searchbox.oninput = rateLimitedSearch;
searchbox.onpropertychange = rateLimitedSearch;
searchbox.onchange = search;

//Prevent form submissions on enter
searchbox.parentElement.parentElement.parentElement.onsubmit = function() {return false;}


resultsNode.onclick = function(event) {
	if (event.target.className == "address") {
		searchbox.value = event.target.innerText;
		search();
	}
}


getInitialData();
