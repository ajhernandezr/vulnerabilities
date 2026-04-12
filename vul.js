const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/user', (req, res) => {
    const input = req.query.name;

    // ❌ XSS
    res.send("<h1>Hello " + input + "</h1>");

    // ❌ Command Injection
    exec("ls " + input);

    // ❌ Path Traversal
    const fs = require('fs');
    const data = fs.readFileSync("/var/data/" + input, "utf8");

    res.send(data);
});

app.listen(3000);
