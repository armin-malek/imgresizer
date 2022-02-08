const { parentPort } = require("worker_threads");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

parentPort.on("message", (data) => {
  startDl(data.imgs).then((imgs) => {
    parentPort.postMessage({ imgs });
  });
});

async function startDl(body) {
  let lins = [];
  await Promise.all(
    body.imgs.map(async (element) => {
      let tmp = await downloadImage(element, body.width);
      //console.log("before tmp", tmp);
      if (tmp != undefined) {
        //console.log("OK", tmp);
        tmp = tmp.replace("/app", "");
        //console.log("rr", tmp);
        lins.push(tmp);
      }
    })
  );
  console.log("DL");
  //console.log("return dl", lins);
  return lins;
}
async function downloadImage(url, width = 900) {
  let loc;
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    await sharp(res.data)
      .resize(width)
      .webp()
      .toBuffer()
      .then((data) => {
        loc =
          __dirname +
          "/files/" +
          url
            .split("/")
            .pop()
            .replace(".png", ".webp")
            .replace(".PNG", ".webp")
            .replace(".jpg", ".webp")
            .replace(".JPG", ".webp")
            .replace(".jpeg", ".webp")
            .replace(".JPEG", ".webp")
            .replace(".gif", ".webp")
            .replace(".GIF", ".webp");
        fs.promises.writeFile(loc, data);
        console.log(loc);
        return loc;
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
    }
  }
  //console.log(loc, "loc");
  return loc;
}
