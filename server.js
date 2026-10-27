// Local test server for Bible Companion (no Vercel account needed).
// Run:  node server.js     then open  http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");
const translate = require("./api/translate.js");

const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  // the translation function (same code Vercel runs)
  if (url.pathname === "/api/translate") {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", async () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch (e) { req.body = {}; }
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (obj) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(obj));
      };
      try {
        await translate(req, res);
      } catch (e) {
        res.status(500).json({ error: "Server error" });
      }
    });
    return;
  }

  // static files
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const full = path.join(__dirname, path.normalize(pathname));
  const blocked = !full.startsWith(__dirname + path.sep) ||
                  full.startsWith(path.join(__dirname, "api") + path.sep);

  if (blocked) {
    res.statusCode = 404;
    return res.end("Not found");
  }

  fs.readFile(full, (err, data) => {
    if (err) {
      res.statusCode = 404;
      return res.end("Not found");
    }
    res.setHeader("Content-Type", TYPES[path.extname(full)] || "application/octet-stream");
    res.end(data);
  });
}).listen(PORT, () => {
  console.log("Bible Companion running at http://localhost:" + PORT);
});