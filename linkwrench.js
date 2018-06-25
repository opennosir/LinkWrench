function openWithProtocol(link,tabid,protocol,explicit) {
	if (protocol.length==0) {
		if (explicit) {
			alert("You need to configure a protocol. Click the LinkWrench button in the Chrome extensions toolbar");
		}
		return;
	}
	if (protocol.substr(protocol.length-1)==":") {
		protocol=protocol.substr(0,protocol.length-1);
	}
	link=protocol+":"+link;
	
	if (explicit) {
		chrome.tabs.update(tabid, {url: link});
	} else {
		chrome.tabs.update(tabid, {
							url: chrome.extension.getURL("goback.html?"+link)
						});
	}
}

function onClickHandler(info, tab) {
	chrome.storage.local.get('protocol',function(result) {
								openWithProtocol(info["linkUrl"],tab.id,result['protocol'],true);
							});
};

function updateContextMenuEntry(protocol) {
	if (protocol.length==0) {
		return;
	}

	var headchar=protocol.substr(0,1);
	headchar=headchar.toUpperCase();	
	var title = "Open with "+headchar+protocol.substr(1);
    chrome.contextMenus.update("linkwrench1",{"title": title, "contexts":["link"]});
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {
    var title = "Open with LinkWrench";
    chrome.contextMenus.create({"title": title, "contexts":["link"],
                                         "id": "linkwrench1"});
										 
	chrome.storage.local.get('protocol',function(result) {
								if (typeof result['protocol']=="undefined") {
									chrome.storage.local.set({'protocol':''});
									result['protocol']='';
								}
								updateContextMenuEntry(result['protocol']);
							});								 
});

var errHistory=new Map();

chrome.webNavigation['onErrorOccurred'].addListener(function(data) {
	if (data.frameId==0) {
		if (data.error=="net::ERR_TUNNEL_CONNECTION_FAILED") {					
			var errEvent={url:data.url,timeStamp:data.timeStamp};
			var repeatedError=false;
			if (errHistory.has(data.tabId)) {
				var lastEntry=errHistory.get(data.tabId);
				if (lastEntry.url==data.url) {
					if (lastEntry.timeStamp+20000>data.timeStamp) {
						repeatedError=true;
					}
				}
			}
			errHistory.set(data.tabId,errEvent);

			if (!repeatedError) {
				chrome.storage.local.get('protocol',function(result) {
							openWithProtocol(data.url,data.tabId,result['protocol'],false);
				});
			}
			
			function clearOldEntries(value,key,map) {
				if (value.timeStamp+20000<data.timeStamp) {
					map.delete(key);
				}
			};
			
			errHistory.forEach(clearOldEntries);
		}
	};
});