function updateProtocol() {
	var text=document.getElementById("protocolname").value;
	chrome.storage.local.set({'protocol':text});
	var menutext="LinkWrench";
	if (text.length>0) {
		var headchar=text.substr(0,1);
		headchar=headchar.toUpperCase();
		menutext=headchar+text.substr(1);
	}
	chrome.contextMenus.update("linkwrench1",{"title": "Open with "+menutext, "contexts":["link"]});
	window.close();
}

function setProtocolText(protocol) {
	document.getElementById("protocolname").value=protocol;
}

chrome.storage.local.get('protocol',function(result) {
	if (typeof result['protocol']=="undefined") return;
	setProtocolText(result['protocol']);
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("save").addEventListener("click", updateProtocol);
});

