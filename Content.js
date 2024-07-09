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
  console.log("finished execution");
};
