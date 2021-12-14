// chrome.browserAction.onClicked.addListener(function(activeTab)
// {

//     chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//         let url = tabs[0].url;
//         fetch(url).then(r => r.text()).then(html => {
//        fetch('http://localhost:3000/data', {
//                 method: 'POST',
//                 headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({html})
//             });
//             // alert(html );
//           });
// //             chrome.tabs.create({'url': url}, function(tab) {
// //               alert(JSON.stringify(tab))
// //   });
//     });

//     // window.open("https://www.zillow.com/homes/4201-Montreal-Ave_rb/79256992_zpid/")
//   });

// const userAction = async () => {
//     chrome.runtime.onMessage.addListener(function(request, sender) {
//         if (request.action == "getSource") {
//             this.pageSource = request.source;
//             var title = this.pageSource.match(/<title[^>]*>([^<]+)<\/title>/)[1];
//             alert(JSON.stringify(request))
//         }
//     });

//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

//         chrome.tabs.executeScript(
//             tabs[0].id,
//             { code: 'var s = document.documentElement.outerHTML; chrome.runtime.sendMessage({action: "getSource", source: s});' }
//         );
//     });
//   }

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "popup-modal" });
    });
  chrome.browserAction.setBadgeText({
    text: "", //an empty string displays nothing!
  });
  if (changeInfo.status == "complete") {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      let url = tabs[0].url;
      if (url.includes("zillow")) {
        fetch(url)
          .then((r) => r.text())
          .then((html) => {
            fetch("http://localhost:3000/data", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ html }),
            })
              .then((response) => response.json())
              .then((data) => {
                chrome.storage.sync.set({ data: data }, function () {
                  chrome.browserAction.setBadgeText({ text: "1" });
                });
              });
          });
      } else {
        chrome.browserAction.setBadgeText({
          text: "", //an empty string displays nothing!
        });
      }
    });
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "popup-modal" });
    });
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    chrome.browserAction.setBadgeText({
      text: "", //an empty string displays nothing!
    });
    let url = tabs[0].url;
    chrome.storage.sync.clear(function () {
      if (url.includes("https://www.zillow.com/homes")) {
        fetch(url)
          .then((r) => r.text())
          .then((html) => {
            fetch("http://localhost:3000/data", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ html }),
            })
              .then((response) => response.json())
              .then((data) => {
                chrome.storage.sync.set({ data: data }, function () {
                  chrome.browserAction.setBadgeText({ text: "1" });
                });
              });
          });
      } else {
      }
    });
  });
});
