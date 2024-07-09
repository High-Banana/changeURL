window.onload = () => {
  const pathname = location.pathname;
  const protocol = location.protocol;
  const host = location.host;
  const search = location.search;
  console.log(location);
  console.log(search);
  if (host.includes("www")) {
    const modifiedURL = `${protocol}//${host.replace("www", "old")}${pathname}${search}`;
    console.log(modifiedURL);
    location.replace(modifiedURL);
  } else {
    console.log("no www in url");
    console.log(location);
  }
  decodeURL(search);
  //   document.cookie = "over18=1;secure;domain=.reddit.com";
  //   location.reload();
  //   console.log(document.cookie);
  console.log("finished execution");
};

function decodeURL(url) {
  let string;
  if (url.includes("?dest=")) {
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
}

// location.reload();
// console.log("after reloading");
