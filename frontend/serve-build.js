const fs = require("fs");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 3000;
const buildDir = path.join(__dirname, "build");

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain"
};

http.createServer((req, res) => {
  const requestedPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(buildDir, requestedPath === "/" ? "index.html" : requestedPath);
  const safePath = filePath.startsWith(buildDir) && fs.existsSync(filePath)
    ? filePath
    : path.join(buildDir, "index.html");
  const ext = path.extname(safePath);

  res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
  fs.createReadStream(safePath).pipe(res);
}).listen(port, () => {
  console.log(`Frontend running on http://localhost:${port}`);
});
