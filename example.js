const express = require('express');
const { execFile } = require('child_process');
const app = express();

app.get('/user', (req, res) => {
    const input = req.query.name;

    // ❌ XSS
    res.send("<h1>Hello " + input + "</h1>");

    // ✅ Avoid command injection by not invoking a shell
    execFile("ls", [input], (err) => {
        if (err) {
            console.error(err);
        }
    });

    // ❌ Path Traversal
    const fs = require('fs');
    const data = fs.readFileSync("/var/data/" + input, "utf8");

    res.send(data);
});

app.listen(3000);

