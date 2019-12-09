// client script
console.log('SDH Client Loaded');

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener((request) => {
		if (request.directive == "sdhStart") {	
			// gather data and send back
			gatherData(request.resume);
		}
	});
});

function gatherData(resume) {
	console.log('SDH Gathering');
	var data = recurseMenu($('#treemenu > ol'));
	data.page = window.location.href;
	data.section = $('#titlesisec').html();

	var payload = {
		directive: 'processMenuData', 
		data: data,
		resume: resume
	};

	chrome.runtime.sendMessage(payload, function(response) {
		console.log('SDH Complete');
	});

	return data;
}

function recurseMenu(start) {
	var data = {
		links: [],
		categories: [],
		groups: []
	};

	start.children('li').each(function() {
		var li = $(this);
		var label = li.children('label');
		var labeltext = label.html();
		if (label.is('.si')) {
			// load content
			var id = label.data('id');
			var filename = "data/" + id.substring(0,4) + "/" + id + ".html" + window.location.hash.toLowerCase();
			data.links.push({
				label: labeltext,
				url: filename
			});
			//console.log('   ' + labeltext + ': ' + filename);
		} else if (label.is('.sicat')) {
			//console.log('CAT: ' + labeltext);
			var catdata = recurseMenu(label.next('ol'));
			data.categories.push({
				label: labeltext,
				data: catdata
			});
		} else if (label.is('.sigroup')) {
			//console.log('  GROUP: ' + labeltext);
			var groupdata = recurseMenu(label.next('ol'));
			data.groups.push({
				label: labeltext, 
				data: groupdata
			});
		}
	});

	return data;
}
