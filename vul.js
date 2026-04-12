const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const app = express();

app.get('/user', (req, res) => {
    const input = req.query.name;

    // ❌ XSS
    res.send("<h1>Hello " + input + "</h1>");

    // ✅ Safer command execution (no shell)
    execFile("ls", [input], (err) => {
        if (err) {
            console.error(err);
        }
    });

    // ✅ Path Traversal mitigation: resolve under a fixed root and enforce containment
    const fs = require('fs');
    const DATA_ROOT = "/var/data";
    const resolvedPath = path.resolve(DATA_ROOT, input);
    if (!(resolvedPath === DATA_ROOT || resolvedPath.startsWith(DATA_ROOT + path.sep))) {
        return res.status(403).send("Forbidden");
    }
    const data = fs.readFileSync(resolvedPath, "utf8");

    res.send(data);
});

app.listen(3000);
