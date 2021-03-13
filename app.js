let http = require("http");
let fs = require("fs");
let path = require("path");

const PORT = 3000;
const map = {
	".js": "text/javascript",
	".json": "application/json",
	".css": "text/css",
	".ico": "image/x-icon",
	".html": "text/html",
	".mp4": "video/mp4",
	".png": "image/png",
	".jpg": "image/jpeg",
};

const server = http.createServer(function (req, res) {
	let url = req.url.toLowerCase();
	let ext = path.extname(url);
	let urlSplit = url.split("/").filter(t => t);

	if (url === "/") {
		pathname = "index.html";
		ext = ".html";
	} else if (url === "/about") {
		pathname = "about.html";
		ext = ".html";
	} else if (
		urlSplit.length === 3 &&
		urlSplit[0] === "img" &&
		urlSplit[1] === "gallery" &&
		path.extname(urlSplit[2]) === ".jpg"
	) {
		pathname = `img/gallery/${urlSplit[2]}`;
		ext = ".jpg";
	} else if (
		urlSplit.length === 2 &&
		urlSplit[0] === "video" &&
		path.extname(urlSplit[1]) === ".mp4"
	) {
		pathname = `video/students/${urlSplit[1]}`;
		ext = ".mp4";
	} else {
		pathname = url;
	}

	fs.readFile(path.join(__dirname, pathname), function (err, content) {
		if (err) {
			fs.readFile(path.join(__dirname, "error.html"), (err, data) => {
				if (err) {
					res.writeHead(500);
					res.end("500 - Internal error with a response code 500");
				} else {
					res.writeHead(404, {
						"Content-Type": "text/html",
					});
					res.end(data);
				}
			});
		} else {
			res.writeHead(200, { "Content-Type": map[ext] || "text/plain" });
			res.end(content, "utf-8");
		}
	});
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
