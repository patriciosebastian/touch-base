require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");

const contactRoutes = require('./routes/contacts');
const groupRoutes = require('./routes/groups');
const emailRoutes = require('./routes/emails');
const demoRoutes = require('./routes/demo');

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.setTimeout(300000);
    next();
});

app.use('/contacts', contactRoutes);
app.use('/app/groups', groupRoutes);
app.use('/app', emailRoutes);
app.use('/demo', demoRoutes);

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
});