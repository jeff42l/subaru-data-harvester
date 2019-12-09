// background script

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	if (message) {
		if (message.directive == 'processMenuData') {
			processMenuData(message.data, message.resume);
			callback(true);
		}
	}
});

function processMenuData(data, resume) {
	// first, save the json data
	var blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
	var sectiontitle = data.section.replace('/', '');
	var filename = 'menudata.json';
	
	saveBlob(blob, sectiontitle, filename).then(function(dlid) {
		// then load all urls and save them
		var urlbase = data.page.substr(0, data.page.lastIndexOf('/') + 1);
		
		var urlsToSave = getUrls(data, urlbase);
		if (resume) {
			var idx = urlsToSave.indexOf(resume);
			if (idx > 0) {
				urlsToSave = urlsToSave.slice(idx);
			}
		}

		console.log('About to start saving ' + urlsToSave.length + ' documents');

		saveUrls(urlsToSave, urlbase, sectiontitle).then(function(result) {
			console.log('SDH finished');
			updateTab(data.page);
		}, function(fail) {
			console.log(fail);
		});
	});
}

function getUrls(data, urlbase) {
	var links = [];

	for (var i = 0, m = data.links.length; i < m; i++) {
		links.push(data.links[i].url);
	}
	for (var j = 0, n = data.categories.length; j < n; j++) {
		var catlinks = getUrls(data.categories[j].data);
		links = links.concat(catlinks);
	}
	for (var k = 0, o = data.groups.length; k < o; k++) {
		var grouplinks = getUrls(data.groups[k].data);
		links = links.concat(grouplinks);
	} 

	return links;
}

function saveUrls(urls, urlbase, section) {
	var results = [];
	return urls.reduce(function(p, item) {
		return p.then(function() {
			return saveUrl(item, urlbase, section).then(function(dlid) {
				results.push(dlid);
				return delay(2000, results);
			});
		});

	}, Promise.resolve());
}

function delay(t, v) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
    });
}

function saveUrl(url, urlbase, section) {
	return new Promise(function (resolve, reject) {
		var save = urlbase + url;
		updateTab(save).then(function(tab) {
			return captureTab(tab);
		}).then(function(blob) {
			var filelocal = url.replace('.html','.mht');
			return saveBlob(blob, section, filelocal);
		}).then(function(dlid) {
			resolve(dlid);
		}).catch(function(err) {
			console.log(err);
		});
	});
}

function updateTab(url) {
	return new Promise(function (resolve, reject) {
		chrome.tabs.update({
			url: url
		}, function(tab) {
			var limit = 60;
			var interval = setInterval(function() {
				if (!tab || limit == 0) {
					clearInterval(interval);
					reject(tab);
				}

				chrome.tabs.get(tab.id, function(tabstat) {
					if (tabstat && tabstat.status == 'complete') {
						clearInterval(interval);
						resolve(tab);
					}	
				});
				
				limit -= 1;
			}, 500);
		});
	});
}

function captureTab(tab) {
	return new Promise(function (resolve, reject) {
		chrome.pageCapture.saveAsMHTML({
			tabId: tab.id
		}, function(blob) {
			resolve(blob);
		});
	});
}

function saveBlob(blob, subfolder, file) {
	return new Promise(function (resolve, reject) {
		var url = URL.createObjectURL(blob);
		var filename = 'sdh/' + subfolder + '/' + file;
		chrome.downloads.download({
			url: url,
			filename: filename,
			saveAs: false,
			conflictAction: chrome.downloads.FilenameConflictAction.overwrite
		}, function(downloadId) {
			resolve(downloadId);
		});
	});
}

