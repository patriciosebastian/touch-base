require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

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
                res.status(403).json({ error: 'Unauthorized' });
            }
        } else {
            res.status(400).json({ error: 'Invalid token' });
        }
    } else {
        res.status(400).json({ error: 'Invalid token' });
    }
};


// ======== ROUTES ======== //

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
        const { rows } = await pool.query('SELECT * FROM contacts WHERE user_id = $1', [req.user.uid]);
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

app.listen(5300, () => {
    console.log("server has started on port 5300");
});