let express = require('express');

let app = express();

app.get('/', (req, res) => { res.send('Welcome to Qblog'); });

let port = process.env.PORT || 8080;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Qblog is listening on port ${port}.`));
