require('dotenv').config();
const express = require("express");
const app = express();
// const router = express.Router();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
const sgMail = require('@sendgrid/mail');

// Middleware

app.use(cors());
app.use(express.json()); //req.body

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Touch_Base",
      format: (req, file) => 'png',
      public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const parser = multer({ storage: storage });

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
app.post("/contacts", verifyToken, parser.single("photo"), async (req, res) => {
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
            photo_url = req.file.path;
            photo_filename = req.file.originalname;
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
    
    // try {
    //     const allContacts = await pool.query("SELECT * FROM contacts");
    //     res.json(allContacts.rows);
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).json({ error: "Server error" });
    // }
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
app.put("/contacts/:id", verifyToken, parser.single("photo"), async (req, res) => {
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
            photo_url = req.file.path;
            photo_filename = req.file.originalname;
            photo_mimetype = req.file.mimetype;
            photo_upload_time = new Date();
        }

        const updateContact = await pool.query("UPDATE contacts SET first_name = $1, last_name = $2, email = $3, phone = $4, address1 = $5, address2 = $6, city = $7, state = $8, zip = $9, categories = $10, photo_url = $11, photo_filename = $12, photo_mimetype = $13, photo_upload_time = $14, notes = $15 WHERE contacts_id = $16 AND user_id = $17", [first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes, id, uid]);

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

        let { photo_url } = contact.rows[0];
        
        if (photo_url) {
            // get public_id of the image from the photo_url
            let public_id = photo_url.split('/').pop().split('.')[0];

            // delete image from Cloudinary
            await cloudinary.uploader.destroy(public_id);
        }

        const deleteContact = await pool.query("DELETE FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

        res.json({ message: "Contact deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ======== GROUPS ROUTES ======== //

// Create a group
app.post("/app/groups", verifyToken, parser.single("cover_picture"), async (req, res) => {
    try {
        const { group_name, about_text } = req.body;
        const user_id = req.user.uid;
        let cover_picture = null;

        if (!group_name) {
            return res.status(400).json({ error: "Missing required field" });
        }

        if (req.file) {
            cover_picture = req.file.path;
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
app.put("/app/groups/:groupId", verifyToken, parser.single("cover_picture"), async (req, res) => {
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
            //delete old image from Cloudinary
            if (cover_picture) {
                // get public id of the image from the cover picture
                let public_id = cover_picture.split('/').pop().split('.')[0];
                // delete image
                await cloudinary.uploader.destroy(public_id);
            }

            // upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            // update cover_picture with new image URL
            cover_picture = result.url;
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

        const deleteGroup = await pool.query("DELETE FROM groups WHERE group_id = $1 AND user_id = $2", [id, uid]);
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

app.listen(5300, () => {
    console.log("server has started on port 5300");
});