type URLParameters = {
  pathname: string;
  protocol: string;
  host: string;
  search: string;
};

type PopupMessage = {
  changeRedditURL?: boolean;
  changeTwitterURL?: boolean;
};

type ChromeStorageResult = {
  changeRedditURL?: boolean;
  changeTwitterURL?: boolean;
};

class URLDetails {
  pathname: string;
  protocol: string;
  host: string;
  search: string;

  constructor(location: URLParameters) {
    this.pathname = location.pathname;
    this.protocol = location.protocol;
    this.host = location.host;
    this.search = location.search;
  }

  getCurrentURLValues(): object {
    console.log({ pathname: this.pathname, protocol: this.protocol, host: this.host, search: this.search });
    return { pathname: this.pathname, protocol: this.protocol, host: this.host, search: this.search };
  }
}

window.onload = () => {
  const urlDetails = new URLDetails(location);
  const { pathname, protocol, host, search } = urlDetails.getCurrentURLValues() as URLParameters;
  console.log(location);
  console.log(pathname, protocol, host, search);
  chrome.storage.local.get(["changeRedditURL", "changeTwitterURL"], (result: ChromeStorageResult) => {
    console.log(result);
    if (result.changeRedditURL) changeRedditURL({ pathname, protocol, host, search });
    if (result.changeTwitterURL) changeTwitterURL({ pathname, protocol, host, search });
  });
  console.log("finished execution");
};

chrome.runtime.onMessage.addListener((message: PopupMessage, sender, sendResponse) => {
  if (message.changeRedditURL) {
    console.log("Reddit URL will be changed", message);
    const urlDetails = new URLDetails(location);
    const { pathname, protocol, host, search } = urlDetails.getCurrentURLValues() as URLParameters;
    changeRedditURL({ pathname, protocol, host, search });
    sendResponse({ URLchanged: true });
  } else {
    console.log("Reddit URL change has been turned off");
    sendResponse({ URLchanged: false });
  }
  if (message.changeTwitterURL) {
    console.log("Twitter URL will be changed", message);
    const urlDetails = new URLDetails(location);
    const { pathname, protocol, host, search } = urlDetails.getCurrentURLValues() as URLParameters;
    changeTwitterURL({ pathname, protocol, host, search });
    sendResponse({ URLchanged: true });
  } else {
    console.log("Twitter URL change has been turned off");
    sendResponse({ URLchanged: false });
  }
});

function changeRedditURL(params: URLParameters) {
  const { host, pathname, protocol, search } = params;
  if (host.includes("www")) {
    if (!pathname.includes("media") && !pathname.includes("gallery")) {
      const modifiedURL = `${protocol}//${host.replace("www", "old")}${pathname}${search}`;
      console.log(modifiedURL);
      location.replace(modifiedURL);
    }
  } else {
    console.log("no www in url");
    if (location.pathname.includes("/over18")) clickContinueButton();
  }
}

function changeTwitterURL(params: URLParameters) {
  const { host, pathname, protocol, search } = params;
  const modifiedURL = `${protocol}//${host.replace("x", "xcancel")}${pathname}${search}`;
  console.log(modifiedURL);
  location.replace(modifiedURL);
}

function clickContinueButton() {
  const buttons = document.querySelectorAll(".c-btn");
  buttons.forEach((button: Element) => {
    const valueAttribute = button.getAttribute("value");
    if (valueAttribute === "yes") {
      const continueButton = button as HTMLButtonElement;
      continueButton.click();
    }
  });
}

// function decodeURL(url: string): string {
//   let string: string = "";
//   if (url.includes("?dest=") || url.includes("media")) {
//     string = url.slice(url.indexOf("=") + 1);
//     console.log(string);
//   }

//   while (string.includes("%3A") || string.includes("%2F")) {
//     if (string.includes("%3A")) {
//       string = string.replace("%3A", ":");
//     }

//     if (string.includes("%2F")) {
//       string = string.replace("%2F", "/");
//     }
//   }
//   console.log(string);
//   return string;
// }
