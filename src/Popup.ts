const input = document.querySelectorAll(".toggleButton");
let redditURL: boolean = false;
let twitterURL: boolean = false;

type StorageResult = {
  changeRedditURL?: boolean;
  changeTwitterURL?: boolean;
};

// This part is only used for debugging
chrome.storage.local.get(["changeRedditURL", "changeTwitterURL"], (result: StorageResult) => {
  console.log(result);
  const changeRedditURL: boolean = result.changeRedditURL ?? false;
  const changeTwitterURL: boolean = result.changeTwitterURL ?? false;
  console.log(changeRedditURL);

  if (changeRedditURL) console.log("Change reddit url is enabled.");
  else console.log("Change reddit url is disabled.");

  if (changeTwitterURL) console.log("Change twitter url is enabled.");
  else console.log("Change twitter url is disabled.");
});

// Add class to button to make it look on or off
async function setToggleStatus() {
  const redditButton = document.getElementById("toggleReddit") as HTMLInputElement;
  const twitterButton = document.getElementById("toggleTwitter") as HTMLInputElement;
  if (await checkExtensionStatus("changeRedditURL")) {
    redditButton.classList.add("checked");
    console.log("change reddit on");
  } else {
    redditButton.classList.remove("checked");
    console.log("change reddit off");
  }
  if (await checkExtensionStatus("changeTwitterURL")) {
    twitterButton.classList.add("checked");
    console.log("change twitter on");
  } else {
    twitterButton.classList.remove("checked");
    console.log("change twitter off");
  }
}

function sendMessageToWebPage(redditURL: boolean, twitterURL: boolean) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id as number, { changeRedditURL: redditURL, changeTwitterURL: twitterURL }, (response) => {
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
      redditURL = false;
      element.classList.remove("checked");
    } else {
      chrome.storage.local.set({ changeRedditURL: true });
      console.log("set reddit url change to true");
      redditURL = true;
      element.classList.add("checked");
    }
  } else if (element.id === "toggleTwitter") {
    const extensionStatus = await checkExtensionStatus("changeTwitterURL");
    console.log(extensionStatus);
    if (extensionStatus === true) {
      chrome.storage.local.set({ changeTwitterURL: false });
      console.log("set twitter url change to false");
      twitterURL = false;
      element.classList.remove("checked");
    } else {
      chrome.storage.local.set({ changeTwitterURL: true });
      console.log("set twitter url change to true");
      twitterURL = true;
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
      sendMessageToWebPage(redditURL, twitterURL);
    });
  });

  setToggleStatus();
});
