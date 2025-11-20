const pool = require('../utils/db');
const resend = require('../utils/resend');

exports.sendEmailToContact = async (req, res) => {
  const { subject, message } = req.body;
  const contactId = req.params.contactId;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  try {
    const result = await pool.query('SELECT email FROM contacts WHERE contacts_id = $1', [contactId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Contact not found');
    }

    const contactEmail = result.rows[0].email;
    const msg = {
      to: contactEmail,
      from: fromEmail,
      subject: subject,
      text: message,
    };

    try {
      await resend.emails.send(msg);
      res.status(200).send('Email sent successfully');
    } catch (err) {
      res.status(500).send('Failed to send email');
      console.error(err.message);
    }
  } catch (err) {
    res.status(500).send('Server error while fetching contact email');
    console.error(err.message);
  }
};

exports.sendEmailToGroup = async (req, res) => {
  const { subject, message } = req.body;
  const groupId = req.params.groupId;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  try {
    const result = await pool.query(
      `SELECT contacts.email
      FROM contacts
      JOIN group_contacts ON contacts.contacts_id = group_contacts.contacts_id
      WHERE group_contacts.group_id = $1`,
      [groupId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('No contacts found in this group');
    }

    const contactEmails = result.rows.map(row => row.email);
    const msg = {
      to: contactEmails,
      from: fromEmail,
      subject: subject,
      text: message,
    };

    try {
      await resend.emails.send(msg);
      res.status(200).send('Email sent successfully');
    } catch (err) {
      res.status(500).send('Failed to send email');
      console.error(err.message);
    }
  } catch (err) {
    res.status(500).send('Server error while fetching contact emails');
    console.error(err.message);
  }
};
