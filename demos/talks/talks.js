function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(event) {
	var date = new Date(event.date);
	var month = MONTHS[date.getMonth()];
	var day = date.getDate();
	
	/*if (event.days) {
		var endDate = new Date(date);
		endDate.setDate(day + event.days);
		
		if (endDate.getMonth() > date.getMonth()) {
			
		}
		else {
			day += '-' + (event.days - 1);
		}
	}*/
	
	return [day, month, date.getFullYear()].join(' ');
}

if (!('appendChildren' in Element)) {
	Element.prototype.appendChildren = function (elements) {
		var fragment = document.createDocumentFragment();
		
		for (var i = 0, el; el = elements[i++];) {
			if (typeof el == 'string') {
				el = document.createTextNode(el);
			}

			fragment.appendChild(el);
		}
		
		this.appendChild(fragment);
		
		return this;
	}
}

function element(tag, content, attributes) {
	var element = document.createElement(tag);
	
	if (content) {
		if (typeof content == 'string') {
			element.innerHTML = content;
		}
		else if (content.length > 0) {
			element.appendChildren(content);
		}
		else {
			element.appendChild(content);
		}
	}
	
	if (attributes) {
		for (var attr in attributes) {
			element.setAttribute(attr, attributes[attr]);
		}
	}
	
	return element;
}

function eventLink(type, url, h2) {
	if (typeof url == "string") {
		h2.appendChild(element('a', type.slice(0,1).toUpperCase() + type.slice(1), {
			href: url,
			"class": type,
			target: "_blank"
		}));
	}
	else if (url && url.length > 0) {
		for (var i=0, el; el=url[i++];) {
			eventLink(type, el, h2);
		}
	}
}

function eventTemplate(event) {
	var li = document.createElement('li');
	
	event.sessions = event.sessions || [{
		title: event.title,
		type: event.type,
		slides: event.slides,
		details: event.details,
		video: event.video
	}];
	
	for (var i=0, session; session = event.sessions[i++];) {
		if (typeof session == "string") {
			session = event.sessions[i-1] = { title: session };
		}
		
		// Defaults
		session.title = session.title || "TBD";
		session.type = session.type || "Talk";
		
		var h2 = element('h2', [
			session.title,
			element("span", session.type, { "class": "type " + session.type.toLowerCase()})
		]);
		
		eventLink('slides', session.slides, h2);
		eventLink('details', session.details, h2);
		eventLink('video', session.video, h2);
		
		li.appendChild(h2);
	}
	
	li.appendChildren([
		element('h3', [
			element('a', event.name, {
				href: event.url,
				target: "_blank"
			})
		]),
		element('p', element('time', formatDate(event), { datetime: event.date }), {
			"class": "date"
		}),
		element('address', event.city || "Online conference", {
			"class": event.country? "country-" + event.country : ""
		})
	]);
	
	if (event.comment) {
		li.appendChild(element('p', event.comment, {
			"class": "comment"
		}));
	}
	
	if (event.feedback) {
		li.appendChild(element('p', 
			element("a", "Feedback", {
				href: event.feedback,
				target: "_blank"
			}),
			{
				"class": "comment"
			}
		));
	}
	
	return li;
}


$$('.talks').forEach(function (list) {
	var file = list.getAttribute('data-source') || 'talks.json',
	    xhr = new XMLHttpRequest();
	
	xhr.open('GET', file, false);
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status < 400) {
				try {
					var events = JSON.parse(xhr.responseText);
				}
				catch (e) {
					list.innerHTML = 'Error parsing JSON file';
					window.console && console.error(e);
				}
				
				var fragmentPast = document.createDocumentFragment();
				var fragmentUpcoming = document.createDocumentFragment();
				
				var count = {
					total: 0,
					past: 0, upcoming: 0, types: {}
				};
				
				events.forEach(function(event) {
					if (!event.date) {
						return;
					}
					
					var template = eventTemplate(event);
					var time = new Date(event.date), now = new Date();
					
					if (time > now) {
						fragmentUpcoming.appendChild(template);
						count.upcoming++;
					}
					else {
						fragmentPast.appendChild(template);
						count.past++;
					}
					
					count.total++;

					for (var i=0, session; session = event.sessions[i++];) {
						var type = session.type.toLowerCase();
						count.types[type] = count.types[type] + 1 || 1;
					}
					
				});
				
				window.console && console.log(count);
				
				if (count.past) {
					var listPast = list.cloneNode();
					
					var h1Past = element("h1", "Past", { id: "past" });
					list.parentNode.insertBefore(h1Past, list.nextSibling);
					
					list.parentNode.insertBefore(listPast, list.nextSibling.nextSibling);
					
					h1Past.appendChild(element('span', " (" + count.past + " events)", { "class": "count" }));
					
					listPast.appendChild(fragmentPast);
				}
				
				if (count.upcoming) {
					var h1Upcoming = element("h1", "Upcoming", { id: "upcoming" });
					list.parentNode.insertBefore(h1Upcoming, list);
					
					h1Upcoming.appendChild(element('span', " (" + count.upcoming + " events)", { "class": "count" }));
					
					list.appendChild(fragmentUpcoming)
				}
				
			}
			else {
				list.innerHTML = 'Error loading file (' + xhr.status + ' ' + xhr.statusText + ')';
			}
		}
	};
	
	xhr.send(null);
});