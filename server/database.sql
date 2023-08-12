CREATE DATABASE touchbase;

CREATE TABLE contacts(
    contacts_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

ALTER TABLE contacts
ADD COLUMN first_name VARCHAR(50),
ADD COLUMN last_name VARCHAR(50),
ADD COLUMN email VARCHAR(255),
ADD COLUMN phone VARCHAR(30),
ADD COLUMN address1 VARCHAR(100),
ADD COLUMN address2 VARCHAR(50),
ADD COLUMN city VARCHAR(50),
ADD COLUMN state VARCHAR(30),
ADD COLUMN zip INTEGER,
ADD COLUMN categories VARCHAR(100),
ADD COLUMN photo_url VARCHAR(255),
ADD COLUMN photo_filename VARCHAR(255),
ADD COLUMN photo_mimetype VARCHAR(50),
ADD COLUMN photo_upload_time TIMESTAMP;

ALTER TABLE contacts 
ALTER COLUMN first_name SET NOT NULL,
ADD CONSTRAINT first_name_not_empty CHECK (first_name <> '');

ALTER TABLE contacts
ADD COLUMN user_id VARCHAR(255);

ALTER TABLE contacts
RENAME COLUMN description TO notes;


-- Validate on the frontend...on frontend, I would collect values of 'first_name' & 'last_name' and send them to my backend API

CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    cover_picture TEXT,
    about_text TEXT
);

CREATE TABLE group_contacts(
    group_id INT REFERENCES groups(group_id),
    contact_id INT REFERENCES contacts(contacts_id),
    PRIMARY KEY (group_id, contact_id)
);

ALTER TABLE group_contacts
RENAME COLUMN contact_id TO contacts_id;

ALTER TABLE group_contacts
DROP CONSTRAINT group_contacts_group_id_fkey;

ALTER TABLE group_contacts
ADD CONSTRAINT group_contacts_group_id_fkey FOREIGN KEY (group_id)
REFERENCES groups(group_id) ON DELETE CASCADE;
