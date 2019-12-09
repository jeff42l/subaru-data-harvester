
document.addEventListener("DOMContentLoaded", function(){
	document.addEventListener('click', function (event) {
		// If the clicked element doesn't have the right selector, bail
		if (event.target.matches('.start-collection')) {
			var resume = document.getElementById('resumefrom').value;
			start(resume);
		}
		return;
	}, false);
});

function start(resume) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		var data = { 
			directive: 'sdhStart', 
			resume: resume
		};
		const port = chrome.tabs.connect(tabs[0].id);
		port.postMessage(data);
	});
}
