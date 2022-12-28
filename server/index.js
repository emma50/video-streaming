const { Console } = require("console");
const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/src/index.html");
});

app.get("/video", function (req, res) {
  // Provide range header to determine what part of the video is sent back
  let range = req.headers.range;
    if (!range) {
      range = 'bytes=0-1048575'
    }

    const videoPath = __dirname + "/src/video/do-biz.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": (end - start) + 1,
      "Content-Type": "video/mp4",
    }
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res)
})

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});