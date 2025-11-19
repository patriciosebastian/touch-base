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
app.use('/groups', groupRoutes);
app.use('/app', emailRoutes);
app.use('/demo', demoRoutes);

// TODO: Rate Limiting and Size Checks: Implement rate limiting and file size checks to prevent abuse and ensure that my service can handle the load.
// TODO: Security: Ensure that the file being processed is indeed a CSV file and does not contain malicious code. This can be part of my validation step.
// TODO: Validate CSV Data: Before inserting the data into your database, validate the CSV data to ensure it meets my application's and database's constraints, such as required fields, data types, and value ranges.
// TODO: File Cleanup: If you're creating temporary files or need to clean up resources after processing (for files that are downloaded rather than streamed), ensure I have a mechanism in place to do so.

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
});