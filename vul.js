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
    let rootReal;
    let resolvedPath;
    try {
        rootReal = fs.realpathSync(DATA_ROOT);
        const candidatePath = path.resolve(rootReal, input);
        resolvedPath = fs.realpathSync(candidatePath);
    } catch (e) {
        return res.status(403).send("Forbidden");
    }
    if (!(resolvedPath === rootReal || resolvedPath.startsWith(rootReal + path.sep))) {
        return res.status(403).send("Forbidden");
    }
    const data = fs.readFileSync(resolvedPath, "utf8");

    res.send(data);
});

app.listen(3000);
