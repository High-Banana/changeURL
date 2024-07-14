const input = document.querySelectorAll(".toggleButton");
let changeURL: boolean = false;

function checkOptionsStatus() {
  const redditButton = document.getElementById("toggleReddit");
  if (localStorage.getItem("changeRedditURL") === "true") {
    redditButton.classList.add("checked");
    console.log("on");
    //return true
  } else {
    redditButton.classList.remove("checked");
    console.log("off");
    //return false
  }
}

function sendMessageToWebPage(changeURL: boolean) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { changeURL: changeURL }, (response) => {
      console.log("Response from webpage: ", response.message);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  input.forEach((element) => {
    element.addEventListener("click", () => {
      if (element.id === "toggleReddit") {
        const changeRedditURLStatus: string | null = localStorage.getItem("changeRedditURL");
        if (changeRedditURLStatus === null || changeRedditURLStatus === "false") {
          localStorage.setItem("changeRedditURL", "true");
          console.log("set reddit url change to true");
          changeURL = true;
          element.classList.add("checked");
        } else {
          localStorage.setItem("changeRedditURL", "false");
          console.log("set reddit url change to false");
          changeURL = false;
          element.classList.remove("checked");
        }
      }
      console.log(element);
      sendMessageToWebPage(changeURL);
    });
  });

  checkOptionsStatus();
});
