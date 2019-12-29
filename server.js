const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require("path")
const passport = require("passport");
const app = express();

const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");

const db = require("./config/keys").mongoURL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("mongoDB connect"))
    .catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);
// 使用routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
    })
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})