require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
var admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const Papa = require('papaparse');
const request = require('request');

var serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
};

// Middleware

app.use(cors());
app.use(express.json()); //req.body

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3({
    httpOptions: {
        timeout: 600000
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "touch-base-bucket",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Authentication
// verify Id token, attach decoded token to req
const verifyToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization || '';
    const components = authorizationHeader.split(' ');

    if (components.length === 2) {
        const type = components[0];
        const token = components[1];

        if (type === 'Bearer') {
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                req.user = decodedToken;
                next();
            } catch (e) {
                if (e.errorInfo && e.errorInfo.code === 'auth/id-token-expired') {
                    res.status(401).json({ error: "Token expired" });
                    console.log('Token Expired');
                } else {
                    res.status(403).json({ error: 'Unauthorized' });
                }
            }
        } else {
            res.status(400).json({ error: 'Invalid token' });
        }
    } else {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// ======== CONTACTS ROUTES ======== //

// Create a contact
app.post("/contacts", verifyToken, upload.single("photo"), async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address1, address2, city, state, zip, categories, notes } = req.body;

        // Check for required values
        if (!first_name) {
            return res.status(400).json({ error: "Missing required field" });
        }

        let photo_url = null;
        let photo_filename = null;
        let photo_mimetype = null;
        let photo_upload_time = null;

        if (req.file) {
            photo_url = req.file.location;
            photo_filename = req.file.key;
            photo_mimetype = req.file.mimetype;
            photo_upload_time = new Date();
        }

        const user_id = req.user.uid;

        const newContact = await pool.query("INSERT INTO contacts (user_id, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *", [user_id, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes]
        );

        res.status(201).json(newContact.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all contacts
app.get("/contacts", verifyToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY first_name ASC, last_name ASC', [req.user.uid]);
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get a contact
app.get("/contacts/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user; // get uid from decoded token
        const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

        if (contact.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found or you do not have persmission to view it' });
        }

        res.json(contact.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" }); 
    }
});

// Update a contact
app.put("/contacts/:id", verifyToken, upload.single("photo"), async (req, res) => {
    try {
        const { id } = req. params;
        const { first_name, last_name, email, phone, address1, address2, city, state, zip, categories, notes } = req.body;
        const { uid } = req.user;

        if (!first_name) {
            return res.status(400).json({ error: 'Missing required field' });
        }

        const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);
        if (!contact.rows[0]) {
            return res.status (404).json({ error: 'Contact not found or you do not have permission to update it' });
        }

        let { photo_url, photo_filename, photo_mimetype, photo_upload_time } = contact.rows[0];

        if (req.file) {
            photo_url = req.file.location;
            photo_filename = req.file.key;
            photo_mimetype = req.file.mimetype;
            photo_upload_time = new Date();
        }

        await pool.query("UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone = $4, address1 = $5, address2 = $6, city = $7, state = $8, zip = $9, categories = $10, photo_url = $11, photo_filename = $12, photo_mimetype = $13, photo_upload_time = $14, notes = $15 WHERE contacts_id = $16 AND user_id = $17", [first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes, id, uid]);

        res.json({ message: "Contact was updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a contact
app.delete("/contacts/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);
        
        if (!contact.rows[0]) {
            return res.status(404).json({ error: 'Contact not found or you do not have permission to delete it' });
        }

        let { photo_url, photo_filename } = contact.rows[0];
        
        if (photo_url) {
            // delete image from S3
            await s3.deleteObject({ Bucket: 'touch-base-bucket', Key: photo_filename }).promise();
        }

        await pool.query("DELETE FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

        res.json({ message: "Contact deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Import contacts
app.post("/app/import-contacts", verifyToken, upload.single("file"), async (req, res) => {
    try {
        const { uid } = req.user;
        const { file } = req;

        if (!file) {
            return res.status(400).json({ error: "Missing required field, No file uploaded" });
        }

        const fileRows = await pool.query("SELECT * FROM contacts WHERE user_id = $1", [uid]);
        if (fileRows.rows.length > 0) {
            return res.status(400).json({ error: "Contacts already exist. Please delete existing contacts before importing a new file" });
        }

        // generate a signed URL for the file
        const s3FileUrl = s3.getSignedUrl('getObject', {
            Bucket: 'touch-base-bucket',
            Key: file.key,
            Expires: 60
        });

        // stream the csv from s3 and parse it with papa parse
        Papa.parse(request(s3FileUrl), {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: async (results) => {
                if (results.errors.length > 0) {
                    console.error('Error parsing CSV:', results.errors);
                    return res.status(500).json({ error: "Error parsing CSV" });
                }

                const contacts = results.data.map(contact => [
                    uid,
                    contact.first_name,
                    contact.last_name,
                    contact.email,
                    contact.phone,
                    contact.address1,
                    contact.address2,
                    contact.city,
                    contact.state,
                    contact.zip,
                    contact.categories,
                    contact.photo_url,
                    contact.photo_filename,
                    contact.photo_mimetype,
                    contact.photo_upload_time,
                    contact.notes
                ]);

                const client = await pool.connect();
                try {
                    await client.query('BEGIN');
                    const query = format('INSERT INTO contacts (user_id, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes) VALUES %L', contacts);
                    await client.query(query);
                    await client.query('COMMIT');
                    res.status(201).json({ message: "Contacts imported successfully" });
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error('Database error:', err);
                    res.status(500).json({ error: "Database error" });
                } finally {
                    client.release();
                }
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ error: "Error parsing CSV" });
            }
        });
        // TODO: login to AWS/S3
        // TODO: test with postman
        // TODO: File Cleanup: If you're creating temporary files or need to clean up resources after processing (for files that are downloaded rather than streamed), ensure I have a mechanism in place to do so.
        // TODO: Rate Limiting and Size Checks: Implement rate limiting and file size checks to prevent abuse and ensure that my service can handle the load.
        // TODO: Security: Ensure that the file being processed is indeed a CSV file and does not contain malicious code. This can be part of my validation step.
        // TODO: Validate CSV Data: Before inserting the data into your database, validate the CSV data to ensure it meets my application's and database's constraints, such as required fields, data types, and value ranges.
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ======== GROUPS ROUTES ======== //

// Create a group
app.post("/app/groups", verifyToken, upload.single("cover_picture"), async (req, res) => {
    try {
        const { group_name, about_text } = req.body;
        const user_id = req.user.uid;
        let cover_picture = null;

        if (!group_name) {
            return res.status(400).json({ error: "Missing required field" });
        }

        if (req.file) {
            cover_picture = req.file.location;
        }

        const newGroup = await pool.query("INSERT INTO groups (user_id, group_name, cover_picture, about_text) VALUES($1, $2, $3, $4) RETURNING *", [user_id, group_name, cover_picture, about_text]);
        
        res.status(201).json(newGroup.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a contact to a group
app.post('/app/groups/:groupId/contacts/:contactId', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const contactId = req.params.contactId;
        const { uid } = req.user;

        // Verify that the group belongs to the logged-in user
        const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);
        if (!group.rows[0]) {
            return res.status(404).json({ error: 'Group not found or you do not have permission to add contacts to it' });
        }

        // Also verify that the contact belongs to the logged-in user
        const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [contactId, uid]);
        if (!contact.rows[0]) {
            return res.status(404).json({ error: 'Contact not found or you do not have permission to add it to a group' });
        }

        // Add contact to the group
        await pool.query("INSERT INTO group_contacts (group_id, contacts_id) VALUES ($1, $2) RETURNING *", [groupId, contactId]);

        // Fetch updated group data
        const updatedGroup = await pool.query(
            `SELECT g.group_id, g.group_name, g.about_text, g.cover_picture,
                json_agg(
                    json_build_object(
                        'contacts_id', c.contacts_id, 'notes', c.notes, 'first_name', c.first_name, 'last_name', c.last_name,
                        'email', c.email, 'phone', c.phone, 'address1', c.address1, 'address2', c.address2, 'city', c.city,
                        'state', c.state, 'zip', c.zip, 'photo_url', c.photo_url
                    )
                ) AS contacts
            FROM groups g
            JOIN group_contacts gc ON g.group_id = gc.group_id
            JOIN contacts c ON gc.contacts_id = c.contacts_id
            WHERE g.group_id = $1
            GROUP BY g.group_id`,
            [groupId]
        );

        res.status(201).json(updatedGroup.rows[0]);
    } catch (err) {
        console.error(err.message);
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all groups
app.get("/app/groups", verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;

        const groups = await pool.query(
            `SELECT g.group_id, g.group_name, g.about_text, g.cover_picture, 
                COALESCE(
                    json_agg(
                        json_build_object(
                            'contacts_id', c.contacts_id, 'notes', c.notes, 'first_name', c.first_name, 'last_name', c.last_name, 
                            'email', c.email, 'phone', c.phone, 'address1', c.address1, 'address2', c.address2, 'city', c.city, 
                            'state', c.state, 'zip', c.zip, 'photo_url', c.photo_url
                        )
                    ) FILTER (WHERE gc.contacts_id IS NOT NULL), 
                    '[]'
                ) AS contacts
            FROM groups AS g
            LEFT JOIN group_contacts gc ON g.group_id = gc.group_id
            LEFT JOIN contacts c ON gc.contacts_id = c.contacts_id
            WHERE g.user_id = $1
            GROUP BY g.group_id`,
            [uid]
        );

        if (!groups.rows.length) {
            return res.status(404).json({ error: 'No groups found' });
        }

        res.json(groups.rows);        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get a group
app.get("/app/groups/:groupId", verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { uid } = req.user;

        const group = await pool.query(
            `SELECT g.group_id, g.group_name, g.about_text, g.cover_picture, 
                COALESCE(
                    json_agg(
                        json_build_object(
                            'contacts_id', c.contacts_id, 'notes', c.notes, 'first_name', c.first_name, 'last_name', c.last_name, 
                            'email', c.email, 'phone', c.phone, 'address1', c.address1, 'address2', c.address2, 'city', c.city, 
                            'state', c.state, 'zip', c.zip, 'photo_url', c.photo_url
                        )
                    ) FILTER (WHERE gc.contacts_id IS NOT NULL), 
                    '[]'
                ) AS contacts
            FROM groups g
            LEFT JOIN group_contacts gc ON g.group_id = gc.group_id
            LEFT JOIN contacts c ON gc.contacts_id = c.contacts_id
            WHERE g.group_id = $1 AND g.user_id = $2
            GROUP BY g.group_id`,
            [groupId, uid]
        );
        
        if (!group.rows[0]) {
            return res.status(404).json({ error: 'Group not found or you do not have permission to view it' });
        }

        res.json(group.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Update a group
app.put("/app/groups/:groupId", verifyToken, upload.single("cover_picture"), async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { group_name, about_text } = req.body;
        const { uid } = req.user;

        if (!group_name) {
            return res.status(400).json({ error: "Missing required field" });
        }

        // verify if group belongs to logged-in user
        const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);
        if (!group.rows[0]) {
            return res.status (404).json({ error: "Group not found or you do not have permission to update it" });
        }

        let cover_picture = group.rows[0].cover_picture;

        if (req.file) {
            //delete old image from S3 if exists
            if (cover_picture) {
                const deleteParams = {
                    Bucket: 'touch-base-bucket',
                    Key: cover_picture.split('/').pop()
                };
                await s3.deleteObject(deleteParams).promise();
            }

            // multer-s3 automatically uploads the file to S3 for you
            // so just update cover_picture with new S3 URL
            cover_picture = req.file.location;
        }

        // update
        await pool.query("UPDATE groups SET group_name = $1, about_text = $2, cover_picture = $3 WHERE group_id = $4 AND user_id = $5", [group_name, about_text, cover_picture, groupId, uid]);

        // Fetch updated group data
        const updatedGroup = await pool.query(
            `SELECT g.group_id, g.group_name, g.about_text, g.cover_picture, 
                COALESCE(
                    json_agg(
                        json_build_object(
                            'contacts_id', c.contacts_id, 'notes', c.notes, 'first_name', c.first_name, 'last_name', c.last_name, 
                            'email', c.email, 'phone', c.phone, 'address1', c.address1, 'address2', c.address2, 'city', c.city, 
                            'state', c.state, 'zip', c.zip, 'photo_url', c.photo_url
                        )
                    ) FILTER (WHERE gc.contacts_id IS NOT NULL), 
                    '[]'
                ) AS contacts
            FROM groups g
            LEFT JOIN group_contacts gc ON g.group_id = gc.group_id
            LEFT JOIN contacts c ON gc.contacts_id = c.contacts_id
            WHERE g.group_id = $1
            GROUP BY g.group_id`,
            [groupId]
        );

        res.status(200).json(updatedGroup.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a group
app.delete("/app/groups/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        // verify if group belongs to user
        const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [id, uid]);

        if (!group.rows[0]) {
            return res.status(404).json({ error: 'Group not found or you do not have permission to delete it' });
        }

        await pool.query("DELETE FROM groups WHERE group_id = $1 AND user_id = $2", [id, uid]);
        res.json({ message: "Group deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a contact from a group
app.delete('/app/groups/:groupId/contacts/:contactId', verifyToken, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const contactId = req.params.contactId;
        const { uid } = req.user;

        // Verify that the group belongs to the logged-in user
        const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);
        if (!group.rows[0]) {
            return res.status(404).json({ error: 'Group not found or you do not have permission to remove contacts from it' });
        }

        // Verify that the contact belongs to the logged-in user
        const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [contactId, uid]);
        if (!contact.rows[0]) {
            return res.status(404).json({ error: 'Contact not found or you do not have permission to remove it from a group' });
        }

        // Remove the contact from the group
        await pool.query("DELETE FROM group_contacts WHERE group_id = $1 AND contacts_id = $2", [groupId, contactId]);

        // Fetch the updated group data
        const updatedGroup = await pool.query(
            `SELECT g.group_id, g.group_name, g.about_text, g.cover_picture, 
                COALESCE(
                    json_agg(
                        json_build_object(
                            'contacts_id', c.contacts_id, 'notes', c.notes, 'first_name', c.first_name, 'last_name', c.last_name, 
                            'email', c.email, 'phone', c.phone, 'address1', c.address1, 'address2', c.address2, 'city', c.city, 
                            'state', c.state, 'zip', c.zip, 'photo_url', c.photo_url
                        )
                    ) FILTER (WHERE gc.contacts_id IS NOT NULL), 
                    '[]'
                ) AS contacts
            FROM groups g
            LEFT JOIN group_contacts gc ON g.group_id = gc.group_id
            LEFT JOIN contacts c ON gc.contacts_id = c.contacts_id
            WHERE g.group_id = $1
            GROUP BY g.group_id`,
            [groupId]
        );

        res.json(updatedGroup.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ======== EMAIL ROUTES ======== //

// Send email to individual contact
app.post('/app/contacts/:contactId/email', verifyToken, async (req, res) => {
    const { subject, message } = req.body;
    const contactId = req.params.contactId;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    // fetch the contacts email
    try {
        const result = await pool.query('SELECT email FROM contacts WHERE contacts_id = $1', [contactId]);

        if (result.rows.length === 0) {
            return res.status(404).send('Contact not found');
        }
        
        // grab contacts email & construct the email
        const contactEmail = result.rows[0].email;
        const msg = {
            to: contactEmail,
            from: fromEmail,
            subject: subject,
            text: message,
        };

        // send it!
        try {
            await sgMail.send(msg);
            res.status(200).send('Email sent successfully');
        } catch (err) {
            res.status(500).send('Failed to send email');
            console.error(err.message);
        }
    } catch (err) {
        res.status(500).send('Server error while fetching contact email');
        console.error(err.message);
    }
});

// Send email to a group
app.post('/app/groups/:groupId/email', async (req, res) => {
    const { subject, message } = req.body;
    const groupId = req.params.groupId;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    // fetch the emails associated to the group
    try {
        const result = await pool.query(`
            SELECT contacts.email
            FROM contacts
            JOIN group_contacts ON contacts.contacts_id = group_contacts.contacts_id
            WHERE group_contacts.group_id = $1
        `, [groupId]);
        console.log(result);

        if (result.rows.length === 0) {
            return res.status(404).send('No contacts found in this group');
        }
        
        // grab emails & construct the email
        const contactEmails = result.rows.map(row => row.email);
        const msg = {
            to: contactEmails,
            from: fromEmail,
            subject: subject,
            text: message,
        };

        // send it!
        try {
            await sgMail.send(msg);
            res.status(200).send('Email sent successfully');
        } catch (err) {
            res.status(500).send('Failed to send email');
            console.error(err.message);
        }
    } catch (err) {
        res.status(500).send('Server error while fetching contact emails');
        console.error(err.message);
    }
});

// ==== DEMO LOGOUT ==== //

// Delete and re-insert demo data
app.post("/demo/logout", async (req, res) => {
    try {
        // Check for demo user
        if (req.body.user_id !== "h8j3g6KvbsSXNBjyEysqAawGbJy2") {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // Begin transaction
        await pool.query('BEGIN');

        // Delete data related to demo user
        await pool.query('DELETE FROM public.contacts WHERE user_id = $1', [req.body.user_id]);
        await pool.query('DELETE FROM public.groups WHERE user_id = $1', [req.body.user_id]);
        await pool.query('DELETE FROM public.group_contacts WHERE group_id NOT IN (SELECT group_id FROM public.groups)');

        // Insert demo data into contacts
        const contactsInsertQuery = `
            INSERT INTO public.contacts (contacts_id, notes, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, user_id)
            VALUES 
            /***** Contacts Data *****/
            (37, '', 'Andrew', 'Davis', 'andavisv88@hotmail.com', '916-454-9635', '161 Park Avenue', '', 'Sacramento', 'CA', '95817', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900193000-andrew-power-y9L5-wmifaY-unsplash.jpg', '1694900193000-andrew-power-y9L5-wmifaY-unsplash.jpg', 'image/jpeg', '2023-09-16 14:36:34.156', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (36, '', 'Carlos', 'Gonzalez', 'csgonzales90@gmail.com', '310-709-0333', '1007 Jett Lane', '', 'Burbank', 'CA', '91504', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900411143-carlos-gil-GfuvYM8LPPQ-unsplash.jpg', '1694900411143-carlos-gil-GfuvYM8LPPQ-unsplash.jpg', 'image/jpeg', '2023-09-16 14:40:12.121', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (20, '', 'Deborah', 'Kline', 'deborahlorenkline@gmail.com', '404-751-8919', '3524 Despard Street', '', 'Chamblee', 'GA', '30341', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900483879-tony-luginsland-OswNOXPNU1k-unsplash.jpg', '1694900483879-tony-luginsland-OswNOXPNU1k-unsplash.jpg', 'image/jpeg', '2023-09-16 14:41:24.562', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (32, '', 'Donald', 'Morrow', 'donaldmorrow.pauc@hotmail.com', '256-331-7934', '4008 Turnpike Drive', '', 'Calumet', 'MI', '49913', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900501742-foto-sushi-6anudmpILw4-unsplash.jpg', '1694900501742-foto-sushi-6anudmpILw4-unsplash.jpg', 'image/jpeg', '2023-09-16 14:41:42.712', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (33, '', 'Harold', 'Ramis', 'ramisrh@gmail.com', '518-594-0517', '4926 Oak Drive', '', 'Ellenburg Depot', 'NY', '12935', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900544650-foto-sushi-ocOW8-uiAjk-unsplash.jpg', '1694900544650-foto-sushi-ocOW8-uiAjk-unsplash.jpg', 'image/jpeg', '2023-09-16 14:42:25.77', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (14, '', 'Jan', 'Wenger', 'jwenger@gmail.com', '863-784-1794', '3590 Ethels Lane', '', 'Avion Park', 'FL', '33825', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900579750-jason-moyer-A73ah5JKtVA-unsplash.jpg', '1694900579750-jason-moyer-A73ah5JKtVA-unsplash.jpg', 'image/jpeg', '2023-09-16 14:43:00.505', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (31, '', 'Joshua', 'Drum', 'drummerjosh@gmail.com', '818-812-4216', '4482 Koontz Lane', '', 'Los Angeles', 'CA', '90017', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900613333-tyler-nix-ZGa9d1a_4tA-unsplash.jpg', '1694900613333-tyler-nix-ZGa9d1a_4tA-unsplash.jpg', 'image/jpeg', '2023-09-16 14:43:33.972', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (24, '', 'Lindsay', 'Black', 'lkarineblack@yahoo.com', '925-389-5992', '4169 Park Street', '', 'Concord', 'CA', '94520', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900636303-clay-elliot-mpDV4xaFP8c-unsplash.jpg', '1694900636303-clay-elliot-mpDV4xaFP8c-unsplash.jpg', 'image/jpeg', '2023-09-16 14:43:57.325', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (30, '', 'Nicholas', 'Bolster', 'nichbolster@gmail.com', '843-622-0832', '1856 Khale Street', '', 'Chesterfield', 'SC', '29709', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900657728-petr-sevcovic-auCjz0gucr0-unsplash.jpg', '1694900657728-petr-sevcovic-auCjz0gucr0-unsplash.jpg', 'image/jpeg', '2023-09-16 14:44:18.996', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (17, '', 'Reyna', 'Elliott', 'reyna.hermaverna@hotmail.com', '203-610-7205', 'address1', '4218 Whitman Court', 'Haven', 'CT', '16511', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900696965-michael-dam-mEZ3PoFGs_k-unsplash.jpg', '1694900696965-michael-dam-mEZ3PoFGs_k-unsplash.jpg', 'image/jpeg', '2023-09-16 14:44:57.525', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (21, '', 'Ruth', 'Chase', 'ruthchase@hotmail.com', '440-794-5035', '1570 Harley Vincent Drive', '', 'Cleveland', 'OH', '44155', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900709879-christina-wocintechchat-com-SJvDxw0azqw-unsplash.jpg', '1694900709879-christina-wocintechchat-com-SJvDxw0azqw-unsplash.jpg', 'image/jpeg', '2023-09-16 14:45:11.219', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (23, '', 'Sara', 'Endicott', 'sara.endicott@gmail.com', '850-487-3062', '3511 Morgan Street', '', 'Tallahassee', 'FL', '32301', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900729539-christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.jpg', '1694900729539-christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.jpg', 'image/jpeg', '2023-09-16 14:45:30.89', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (25, '', 'Valorie', 'Bressler', 'valorie.schaef@yahoo.com', '402-565-8805', '1569 Commerce Boulevard', '', 'Hoskins', 'NE', '68740', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900787342-karsten-winegeart-bwDnRf-r4u8-unsplash.jpg', '1694900787342-karsten-winegeart-bwDnRf-r4u8-unsplash.jpg', 'image/jpeg', '2023-09-16 14:46:28.244', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (35, '', 'William', 'McCullough', 'williammccullough8@gmail.com', '209-245-2041', '3352 Maple Avenue', '', 'Plymouth', 'CA', '95669', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694901753746-taylor-grote-UiVe5QvOhao-unsplash%20%281%29.jpg', '1694901753746-taylor-grote-UiVe5QvOhao-unsplash (1).jpg', 'image/jpeg', '2023-09-16 15:02:34.924', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (34, '', 'Amir', 'Taghi', 'amirtaghi@gmail.com', '707-697-4976', '3944 Davis Avenue', '', 'Oakland', 'CA', '94612', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902004343-willian-souza-p5BoBF0XJUA-unsplash.jpg', '1694902004343-willian-souza-p5BoBF0XJUA-unsplash.jpg', 'image/jpeg', '2023-09-16 15:06:45.435', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (19, '', 'Darla', 'Thompson', 'dar.lehne4@gmail.com', '706-366-7118', '2485 Davis Street', '', 'Columbus', 'GA', '31901', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900442685-tony-luginsland-ZAo0cKz_IKM-unsplash.jpg', '1694900442685-tony-luginsland-ZAo0cKz_IKM-unsplash.jpg', 'image/jpeg', '2023-09-16 14:40:43.645', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (28, '', 'Gregory', 'Hodges', 'gleoniehodges@hotmail.com', '812-869-6145', '1213 Stratford Park', '', 'Seymour', 'IL', '47274', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900515527-josh-scorpio-H3Tuh0hwYQk-unsplash.jpg', '1694900515527-josh-scorpio-H3Tuh0hwYQk-unsplash.jpg', 'image/jpeg', '2023-09-16 14:41:56.78', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (29, '', 'James', 'Harris', 'jkaleharris@yahoo.com', '731-501-4628', '1653 Melville Street', '', 'Memphis', 'TN', '38141', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900558605-ryan-hoffman-v7Jja2ChN6s-unsplash.jpg', '1694900558605-ryan-hoffman-v7Jja2ChN6s-unsplash.jpg', 'image/jpeg', '2023-09-16 14:42:39.761', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (18, '', 'Janice', 'Sampson', 'J.willis.sampson@gmail.com', '407-437-1392', '3292 Stoneybrook Road', '', 'Orlando', 'FL', '32805', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900596637-alexandra-lowenthal-vO3NGxiJSgU-unsplash.jpg', '1694900596637-alexandra-lowenthal-vO3NGxiJSgU-unsplash.jpg', 'image/jpeg', '2023-09-16 14:43:17.847', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (26, '', 'Sharon', 'Markowitz', 'smarkowitz@hotmail.com', '914-574-4860', '4405 Mount Tabor', '', 'Westbury', 'NY', '11590', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900746707-alex-starnes-WYE2UhXsU1Y-unsplash.jpg', '1694900746707-alex-starnes-WYE2UhXsU1Y-unsplash.jpg', 'image/jpeg', '2023-09-16 14:45:47.4', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (22, '', 'Tanya', 'Olson', 'Tanya1989@gmail.com', '215-845-3591', '988 Glen Falls Road', '', 'Philadelphia', 'PA', '19103', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900760649-christina-wocintechchat-com-Zpzf7TLj_gA-unsplash.jpg', '1694900760649-christina-wocintechchat-com-Zpzf7TLj_gA-unsplash.jpg', 'image/jpeg', '2023-09-16 14:46:01.342', 'h8j3g6KvbsSXNBjyEysqAawGbJy2'),
            (27, '', 'Wayne', 'Johnson', 'waynejohnson@yahoo.com', '773-355-0371', '2633 Oakmound Drive', '', 'Chicago', 'IL', '60605', '', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900804197-linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg', '1694900804197-linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg', 'image/jpeg', '2023-09-16 14:46:45.173', 'h8j3g6KvbsSXNBjyEysqAawGbJy2')
        `;

        // Insert demo data into groups
        const groupsInsertQuery = `
            INSERT INTO public.groups (group_id, user_id, group_name, cover_picture, about_text)
            VALUES 
            /***** Groups Data *****/
            (8, 'h8j3g6KvbsSXNBjyEysqAawGbJy2', 'Book Club', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902514738-alexander-wende-IQuzsQv_bO4-unsplash.jpg', 'Every Wednesday'),
            (9, 'h8j3g6KvbsSXNBjyEysqAawGbJy2', 'RUN', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902560570-steven-lelham-atSaEOeE8Nk-unsplash%20%281%29.jpg', 'Running squad'),
            (6, 'h8j3g6KvbsSXNBjyEysqAawGbJy2', 'Small Group', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902578651-toa-heftiba-l_ExpFwwOEg-unsplash.jpg', 'Church group'),
            (7, 'h8j3g6KvbsSXNBjyEysqAawGbJy2', 'Birthday Party', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902595822-nikhita-singhal-k8y9HrzonOQ-unsplash%20%281%29.jpg', '35!!!!'),
            (1, 'h8j3g6KvbsSXNBjyEysqAawGbJy2', 'Guys Night', 'https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902625172-joshua-aragon-KDWRyoHUlvo-unsplash.jpg', 'Legends doing legendary things')
        `;

        // Insert demo data into group_contacts
        const groupContactsInsertQuery = `
            INSERT INTO public.group_contacts (group_id, contacts_id)
            VALUES 
            /***** Group Contacts Data *****/
            (1, 31),
            (1, 34),
            (1, 35),
            (1, 36),
            (1, 30),
            (6, 23),
            (6, 25),
            (6, 18),
            (6, 36),
            (6, 37),
            (6, 30),
            (7, 23),
            (7, 37),
            (7, 36),
            (7, 35),
            (7, 22),
            (7, 17),
            (7, 24),
            (7, 28),
            (7, 18),
            (7, 29),
            (7, 31),
            (7, 14),
            (7, 25),
            (7, 27),
            (7, 34),
            (7, 33),
            (8, 37),
            (8, 34),
            (8, 30),
            (8, 26),
            (8, 17),
            (8, 24),
            (9, 17),
            (9, 23),
            (9, 35),
            (9, 33),
            (9, 28),
            (9, 22)
        `;

        await pool.query(contactsInsertQuery);
        await pool.query(groupsInsertQuery);
        await pool.query(groupContactsInsertQuery);

        // Commit transaction
        await pool.query('COMMIT');

        res.json({ message: "Logged out and demo data restored!" });

    } catch (err) {
        // Rollback in case of errors
        await pool.query('ROLLBACK');

        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5300;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
});