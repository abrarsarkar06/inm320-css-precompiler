const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicRoot = path.resolve(__dirname, '..', 'public');
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end('Method not allowed');
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400);
        response.end('Bad request');
        return;
    }

    const filePath = path.resolve(publicRoot, `.${pathname}`);
    if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    const resolvedPath = pathname.endsWith('/')
        ? path.join(filePath, 'index.html')
        : filePath;

    fs.stat(resolvedPath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            response.writeHead(404);
            response.end('Not found');
            return;
        }

        response.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream'
        });
        if (request.method === 'HEAD') {
            response.end();
            return;
        }

        const stream = fs.createReadStream(resolvedPath);
        stream.on('error', (error) => {
            console.error(`Failed to read ${resolvedPath}:`, error);
            if (!response.headersSent) {
                response.writeHead(500);
            }
            response.end('Internal server error');
        });
        stream.pipe(response);
    });
}).listen(3000, () => {
    console.log('Serving public/ at http://localhost:3000');
});
