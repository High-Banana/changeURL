const input = document.querySelectorAll(".toggleButton");

function checkOptionsStatus() {
  const redditButton = document.getElementById("toggleReddit");
  if (localStorage.getItem("changeRedditURL") === "true") {
    redditButton.classList.add("checked");
    console.log("on");
  } else {
    redditButton.classList.remove("checked");
    console.log("off");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  input.forEach((element) => {
    element.addEventListener("click", () => {
      // element.classList.toggle("checked");
      if (element.id === "toggleReddit") {
        //   isChangeRedditURLTrue = !isChangeRedditURLTrue;
        console.log(localStorage.getItem("changeRedditURL"));
        const changeRedditURLStatus: string | null = localStorage.getItem("changeRedditURL");
        if (changeRedditURLStatus === null || changeRedditURLStatus === "false") {
          localStorage.setItem("changeRedditURL", "true");
          console.log("set reddit url change to true");
          element.classList.add("checked");
        } else {
          localStorage.setItem("changeRedditURL", "false");
          console.log("set reddit url change to false");
          element.classList.remove("checked");
        }
      }
      console.log(element);
    });
  });

  checkOptionsStatus();
});
