let express = require('express');
let path = require('path');
let templates = require('./src/util/templates.js');

let app = express();

app.get('/', (req, res) => {
    res.send(templates.get('index')());
});

app.use('/dist/js/', express.static(path.join(__dirname, 'dist/js/')));

let port = process.env.PORT || 8080;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Qblog is listening on port ${port}.`));
