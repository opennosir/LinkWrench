function goback() {
	window.history.go(-2);
}

function updateMessage(protocol) {
	var msg=document.getElementById('message');
	if (protocol.length>0) {		
		var headchar=protocol.substr(0,1);
		headchar=headchar.toUpperCase();
		var msgtext=headchar+protocol.substr(1);
		msg.innerHTML="Page redirected to "+msgtext;
	} else {
		msg.innerHTML="LinkWrench has redirected this page";
	}
	
	window.setTimeout(goback,2000);
	var query = window.location.search.substring(1);
	chrome.tabs.update(null, {url: query});  
}



document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get('protocol',function(result) {
								updateMessage(result['protocol']);
	});
});

		