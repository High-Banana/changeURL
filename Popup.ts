const input = document.querySelectorAll(".toggleButton");
let changeURL: boolean = false;

// This part is only used for debugging
chrome.storage.local.get(["changeRedditURL"], (result) => {
  // Access the value from the result object
  const extensionStatus = result.changeRedditURL;
  console.log(extensionStatus);

  // Use the value in an if statement
  if (extensionStatus) {
    // Perform actions when the status is true
    console.log("Extension is enabled.");
  } else {
    // Perform actions when the status is false or undefined
    console.log("Extension is disabled.");
  }
});

async function setToggleStatus() {
  const redditButton = document.getElementById("toggleReddit");
  if (await checkExtensionStatus("changeRedditURL")) {
    redditButton.classList.add("checked");
    console.log("on");
  } else {
    redditButton.classList.remove("checked");
    console.log("off");
  }
}

function sendMessageToWebPage(changeURL: boolean) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { changeURL: changeURL }, (response) => {
      console.log("Changed URL: ", response.URLchanged);
    });
  });
}

async function handleChromeStorage(element: Element) {
  if (element.id === "toggleReddit") {
    const extensionStatus = await checkExtensionStatus("changeRedditURL");
    console.log(extensionStatus);
    if (extensionStatus === true) {
      chrome.storage.local.set({ changeRedditURL: false });
      console.log("set reddit url change to false");
      changeURL = false;
      element.classList.remove("checked");
    } else {
      chrome.storage.local.set({ changeRedditURL: true });
      console.log("set reddit url change to true");
      changeURL = true;
      element.classList.add("checked");
    }
  }
}

async function checkExtensionStatus(valueToGet: string): Promise<boolean> {
  try {
    const result = await new Promise<Record<string, boolean>>((resolve) => {
      chrome.storage.local.get([valueToGet], (items) => resolve(items));
    });
    return result[valueToGet] === true;
  } catch (error) {
    console.log("Error occured while getting extension status: ", error);
    // return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  input.forEach((element) => {
    element.addEventListener("click", () => {
      handleChromeStorage(element);
      //   sendMessageToWebPage(changeURL);
    });
  });

  setToggleStatus();
});
