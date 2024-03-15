console.log("content script loaded - allfields");
document.body.style.border = "5px solid green";
runtime.onMessage.addListener((data, sender) => {
  if (data.message === "aws_zaragoza") {
    console.log("We're in AWS Zaragoza!");
    document.body.style.border = "5px solid red";
    return Promise.resolve("done");
  }
  return false;
});
