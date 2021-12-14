window.load = function () {
  chrome.storage.sync.set({ key_present: false });
};
let bed = document.getElementById("bedroom");
chrome.storage.sync.get(["data"], function (result) {
  if (result.data) {
    document.getElementById(
      "bedroom"
    ).innerHTML = `<p><span>Address : </span>${result.data.address}</p>
    <hr/>
    <h4>zestimate_details :</h4>
    <p><span>Last_30-day_change : </span>${result.data.zestimate_details["Last_30-day_change"]}</p>
    <p><span>Zestimate-range : </span>${result.data.zestimate_details["Zestimate-range"]}</p>
    <p><span>Zestimate_per_sqft : </span>${result.data.zestimate_details["Zestimate_per_sqft"]}</p>
    <hr/>`;

    chrome.browserAction.setBadgeText({
      text: "", //an empty string displays nothing!
    });
  } else {
    document.getElementById("bedroom").innerHTML = "Click again!!";
    chrome.browserAction.setBadgeText({
      text: "", //an empty string displays nothing!
    });
  }
});
// const dd = document.getElementById("popup")
// dd.addEventListener('click', function(){
//   var popup = document.getElementById("myPopup");
//   alert("hi")
// }, false)

// {"address":"",
// "zestimate_details":{
//   "Last_30-day_change":"Utilities / Green Energy Details",
//   "Zestimate-range":"Travel times",
//   "Zestimate_per_sqft":"Community and Neighborhood Details"
// }
// }

localStorage.setItem("api__key", "c2c_123");
const hide_div = document.getElementById("hide_div");
const top_div = document.getElementById("top_div");

const btn = document.getElementById("c2c_btn");
btn.addEventListener("click", function (e) {
  e.preventDefault();
  top_div.classList.add("hide");
  bed.classList.add("hide");
  chrome.storage.sync.get(["key_present"], function (result) {
    console.log("this is our key : ", result.key_present);
    if (result.key_present) {
      chrome.storage.sync.get(["data"], (res) => {
        let data = res.data;
        if (data.address) {
          hide_div.innerHTML = `<div>
          <p><span>Address : </span>${data.address}</p>
          <hr/>
          <h4>zestimate_details :</h4>
          <p><span>Last_30-day_change : </span>${data.zestimate_details["Last_30-day_change"]}</p>
          <p><span>Zestimate-range : </span>${data.zestimate_details["Zestimate-range"]}</p>
          <p><span>Zestimate_per_sqft : </span>${data.zestimate_details["Zestimate_per_sqft"]}</p>
          <hr/>
          </div>
          <div><label>WebHook</label>
          <input id="webhook_input" style="width:90%; margin: 4px"></input>
          <button id="webhook_send">send</button></div>`;
          hide_div.classList.remove("hide");
          fun();
        } else {
          hide_div.innerHTML = `<h1>Data Is Not Valid</h1>
          <hr/>
          <p><span>Address : </span>${data.address}</p>
          <hr/>
          <h4>zestimate_details :</h4>
          <p><span>Last_30-day_change : </span>${data.zestimate_details["Last_30-day_change"]}</p>
          <p><span>Zestimate-range : </span>${data.zestimate_details["Zestimate-range"]}</p>
          <p><span>Zestimate_per_sqft : </span>${data.zestimate_details["Zestimate_per_sqft"]}</p>
          <hr/>
          `;
          hide_div.classList.remove("hide");
        }
      });
    } else {
      hide_div.classList.add("hide_cls");
      hide_div.classList.remove("hide");
    }
  });
});

let key = document.getElementById("api_key");
key.addEventListener("click", function (e) {
  e.preventDefault();
  let data = document.getElementById("input_api").value;
  console.log("working", data);
  if (data === localStorage.getItem("api__key")) {
    chrome.storage.sync.set({ key_present: true }, function () {
      console.log("key save in chrome store!!!");
    });
    chrome.storage.sync.get(["data"], (res) => {
      let data = res.data;
      if (data.address) {
        hide_div.innerHTML = `<div>
        <p><span>Address : </span>${data.address}</p>
        <hr/>
        <h4>zestimate_details :</h4>
        <p><span>Last_30-day_change : </span>${data.zestimate_details["Last_30-day_change"]}</p>
        <p><span>Zestimate-range : </span>${data.zestimate_details["Zestimate-range"]}</p>
        <p><span>Zestimate_per_sqft : </span>${data.zestimate_details["Zestimate_per_sqft"]}</p>
        <hr/>
        </div>
        <div><label>WebHook</label>
        <input id="webhook_input" style="width:90%; margin: 4px"></input>
        <button id="webhook_send">send</button></div>`;
        hide_div.classList.remove("hide_cls");
        fun();
      } else {
        hide_div.innerHTML = `<h1>Data IS Not Valid</h1>
        <hr/>
          <p><span>Address : </span>${data.address}</p>
          <hr/>
          <h4>zestimate_details :</h4>
          <p><span>Last_30-day_change : </span>${data.zestimate_details["Last_30-day_change"]}</p>
          <p><span>Zestimate-range : </span>${data.zestimate_details["Zestimate-range"]}</p>
          <p><span>Zestimate_per_sqft : </span>${data.zestimate_details["Zestimate_per_sqft"]}</p>
          <hr/>`;
        hide_div.classList.remove("hide_cls");
      }
    });
  } else {
    bed.innerHTML = `<h1>Your Api Is Wrong</h1>`;
    hide_div.classList.add("hide");
    bed.classList.remove("hide");
  }
});

function fun() {
  const webhook_send = document.getElementById("webhook_send");

  webhook_send.addEventListener("click", function (e) {
    e.preventDefault();
    const webhook_input = document.getElementById("webhook_input").value;
    chrome.storage.sync.get(["data"], async function (result) {
      try {
        if (webhook_input !== "http://localhost:3000/webhook") {
          throw new Error();
        }
        const payload = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        };
        const res = await fetch(webhook_input, payload);
        console.log(res);
        if (res.status == "404") {
          throw new Error();
        }
        hide_div.classList.remove("hide_cls");
        hide_div.innerHTML = `<h1>Data Send Successfully</h1>`;
      } catch (err) {
        hide_div.classList.remove("hide_cls");
        hide_div.innerHTML = `<h1>Getting Error</h>`;
      }
    });
  });
}
