type URLParameters = {
  pathname: string;
  protocol: string;
  host: string;
  search: string;
};

let isChangeRedditURLTrue: boolean = false;

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.changeURL) {
    console.log("Ok URL will be changed", message);
    const pathname: string = location.pathname;
    const protocol: string = location.protocol;
    const host: string = location.host;
    const search: string = location.search;
    changeRedditURL({ pathname, protocol, host, search });
    sendResponse({ URLchanged: true });
  } else {
    console.log("URL change has been turned off");
    sendResponse({ URLchanged: false });
  }
});

window.onload = () => {
  const pathname: string = location.pathname;
  const protocol: string = location.protocol;
  const host: string = location.host;
  const search: string = location.search;
  console.log(location);
  console.log(search);
  chrome.storage.local.get(["changeRedditURL"], (result) => {
    if (result.changeRedditURL) changeRedditURL({ pathname, protocol, host, search });
  });
  console.log("finished execution");
};

function decodeURL(url: string): string {
  let string: string = "";
  if (url.includes("?dest=") || url.includes("media")) {
    string = url.slice(url.indexOf("=") + 1);
    console.log(string);
  }

  while (string.includes("%3A") || string.includes("%2F")) {
    if (string.includes("%3A")) {
      string = string.replace("%3A", ":");
    }

    if (string.includes("%2F")) {
      string = string.replace("%2F", "/");
    }
  }
  console.log(string);
  return string;
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
