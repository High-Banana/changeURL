const input = document.querySelectorAll(".toggleButton");
let isChangeRedditURLTrue = false;
input.forEach((element) => {
    element.addEventListener("click", () => {
        // element.classList.toggle("checked");
        if (element.id === "toggleReddit") {
            isChangeRedditURLTrue = !isChangeRedditURLTrue;
            console.log(localStorage.getItem("changeRedditURL"));
            const changeRedditURLStatus = localStorage.getItem("changeRedditURL");
            if (changeRedditURLStatus === null || changeRedditURLStatus === "false") {
                localStorage.setItem("changeRedditURL", "true");
                console.log("set reddit url change to true");
                element.classList.add("checked");
            }
            else {
                localStorage.setItem("changeRedditURL", "false");
                console.log("set reddit url change to false");
                element.classList.remove("checked");
            }
        }
        console.log(element);
    });
});
function changeRedditURL(params) {
    const { host, pathname, protocol, search } = params;
    if (host.includes("www")) {
        if (!pathname.includes("media") && !pathname.includes("gallery")) {
            const modifiedURL = `${protocol}//${host.replace("www", "old")}${pathname}${search}`;
            console.log(modifiedURL);
            location.replace(modifiedURL);
        }
    }
    else {
        console.log("no www in url");
        if (location.pathname.includes("/over18"))
            clickContinueButton();
    }
}
window.onload = () => {
    const pathname = location.pathname;
    const protocol = location.protocol;
    const host = location.host;
    const search = location.search;
    console.log(location);
    console.log(search);
    if (isChangeRedditURLTrue)
        changeRedditURL({ pathname, protocol, host, search });
    console.log("finished execution");
};
function decodeURL(url) {
    let string;
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
    buttons.forEach((button) => {
        const valueAttribute = button.getAttribute("value");
        if (valueAttribute === "yes") {
            const continueButton = button;
            continueButton.click();
        }
    });
}
