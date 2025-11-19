const pool = require('../db');
const { s3 } = require('../utils/s3');

exports.getAllGroups = async (req, res) => {
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
};

exports.createGroup = async (req, res) => {
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
};

exports.getGroupById = async (req,res) => {
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
};

exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { group_name, about_text } = req.body;
    const { uid } = req.user;

    if (!group_name) {
      return res.status(400).json({ error: "Missing required field" });
    }

    const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);

    if (!group.rows[0]) {
      return res.status(404).json({ error: "Group not found or you do not have permission to update it" });
    }

    let cover_picture = group.rows[0].cover_picture;

    if (req.file) {
      if (cover_picture) {
        const deleteParams = {
          Bucket: 'touch-base-bucket',
          Key: cover_picture.split('/').pop()
        };

        await s3.deleteObject(deleteParams).promise();
      }

      cover_picture = req.file.location;
    }

    await pool.query("UPDATE groups SET group_name = $1, about_text = $2, cover_picture = $3 WHERE group_id = $4 AND user_id = $5", [group_name, about_text, cover_picture, groupId, uid]);

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
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

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
};

exports.addContactToGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const contactId = req.params.contactId;
    const { uid } = req.user;

    const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);

    if (!group.rows[0]) {
      return res.status(404).json({ error: 'Group not found or you do not have permission to add contacts to it' });
    }

    const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [contactId, uid]);

    if (!contact.rows[0]) {
      return res.status(404).json({ error: 'Contact not found or you do not have permission to add it to a group' });
    }

    await pool.query("INSERT INTO group_contacts (group_id, contacts_id) VALUES ($1, $2) RETURNING *", [groupId, contactId]);

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
};

exports.removeContactFromGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const contactId = req.params.contactId;
    const { uid } = req.user;

    const group = await pool.query("SELECT * FROM groups WHERE group_id = $1 AND user_id = $2", [groupId, uid]);

    if (!group.rows[0]) {
        return res.status(404).json({ error: 'Group not found or you do not have permission to remove contacts from it' });
    }

    const contact = await pool.query("SELECT * FROM contacts WHERE contacts_id = $1 AND user_id = $2", [contactId, uid]);

    if (!contact.rows[0]) {
      return res.status(404).json({ error: 'Contact not found or you do not have permission to remove it from a group' });
    }

    await pool.query("DELETE FROM group_contacts WHERE group_id = $1 AND contacts_id = $2", [groupId, contactId]);

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
};
