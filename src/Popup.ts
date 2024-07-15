const input = document.querySelectorAll(".toggleButton");
let changeURL: boolean = false;

// This part is only used for debugging
chrome.storage.local.get(["changeRedditURL"], (result) => {
  const extensionStatus = result.changeRedditURL;
  console.log(extensionStatus);
  if (extensionStatus) {
    console.log("Extension is enabled.");
  } else {
    console.log("Extension is disabled.");
  }
});

async function setToggleStatus() {
  const redditButton = document.getElementById("toggleReddit") as HTMLInputElement;
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
    if (tabs && tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id as number, { changeURL: changeURL }, (response) => {
        console.log("Changed URL: ", response.URLchanged);
      });
    }
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
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  input.forEach((element) => {
    element.addEventListener("click", async () => {
      await handleChromeStorage(element);
      sendMessageToWebPage(changeURL);
    });
  });

  setToggleStatus();
});
