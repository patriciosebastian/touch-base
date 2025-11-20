const pool = require('../utils/db');
const { s3 } = require('../utils/s3');
const Papa = require('papaparse');
const format = require('pg-format');

exports.getAllContacts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY first_name ASC, last_name ASC', [req.user.uid]);
    res.send(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

    if (contact.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found or you do not have permission to view it' });
    }

    res.json(contact.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address1, address2, city, state, zip, categories, notes } = req.body;

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
};

exports.importContacts = async (req, res) => {
  try {
    const { uid } = req.user;
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: "Missing required field, No file uploaded" });
    }

    const s3Stream = s3.getObject({
        Bucket: 'touch-base-bucket',
        Key: file.key
    }).createReadStream();

    s3Stream.on('error', (err) => {
        console.error('S3 Stream Error:', err);
        res.status(500).json({ error: "Error reading file" });
    });

    let parsedData = [];

    Papa.parse(s3Stream, {
      header: true,
      dynamicTyping: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          console.error('Error parsing CSV:', results.errors);
          return res.status(500).json({ error: "Error parsing CSV" });
        }

        parsedData = results.data;

        const client = await pool.connect();

        try {
          await client.query('BEGIN');

          const existingContacts = await client.query('SELECT email FROM contacts WHERE user_id = $1', [uid]);

          const existingEmails = new Set(existingContacts.rows.map(contact => contact.email));

          const filteredContacts = parsedData.filter(contact => {
            if (existingEmails.has(contact.email)) {
              console.log(`Duplicate contact found: ${contact.email}`);
              return false;
            }
            return true;
          });

          const contactsToInsert = filteredContacts.map(contact => [
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

          if (contactsToInsert.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "No new contacts to import" });
          }

          if (contactsToInsert.length > 0) {
            const query = format(
              'INSERT INTO contacts (user_id, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, notes) VALUES %L', contactsToInsert
            );

            await client.query(query);
          }

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
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address1, address2, city, state, zip, categories, notes } = req.body;
    const { uid } = req.user;

    if (!first_name) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

    if (!contact.rows[0]) {
      return res.status(404).json({ error: 'Contact not found or you do not have permission to update it' });
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
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

    if (!contact.rows[0]) {
      return res.status(404).json({ error: 'Contact not found or you do not have permission to delete it' });
    }

    let { photo_url, photo_filename } = contact.rows[0];

    if (photo_url) {
      await s3.deleteObject({ Bucket: 'touch-base-bucket', Key: photo_filename }).promise();
    }

    await pool.query("DELETE FROM contacts WHERE contacts_id = $1 AND user_id = $2", [id, uid]);

    res.json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};
