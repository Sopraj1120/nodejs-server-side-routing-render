const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to serve the layout with specific content and script
const servePage = (res, page) => {
  fs.readFile(path.join(__dirname, 'views', 'layout.html'), 'utf-8', (err, layoutData) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      return res.end('Error loading layout');
    }

    fs.readFile(path.join(__dirname, 'views', `${page}.html`), 'utf-8', (err, pageData) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('Page not found');
      }

      // Replace content placeholder
      let finalPage = layoutData.replace('{content}', pageData);

      // Insert the page-specific script
      const scriptTag = `<script src="/static/${page}.js"></script>`;
      finalPage = finalPage.replace('{content-script}', scriptTag);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(finalPage);
    });
  });
};

// Function to serve static files (CSS, JS, images)
const serveStatic = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/home') {
    servePage(res, 'home');
  } else if (req.url === '/about') {
    servePage(res, 'about');
  } else if (req.url === '/contact') {
    servePage(res, 'contact');
  } else if (req.url.startsWith('/static/')) {
    // Serve static JS/CSS files
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/plain';

    if (extname === '.js') contentType = 'application/javascript';
    if (extname === '.css') contentType = 'text/css';

    serveStatic(res, filePath, contentType);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
