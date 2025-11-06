CREATE TABLE users(
   id INT AUTO_INCREMENT,
   email VARCHAR(100)  NOT NULL,
   password VARCHAR(255) ,
   hire_date DATETIME,
   created_at DATETIME,
   updated_at DATETIME,
   username VARCHAR(50)  NOT NULL,
   status VARCHAR(100) ,
   token VARCHAR(500) ,
   is_password_set TINYINT,
   PRIMARY KEY(id),
   UNIQUE(email),
   UNIQUE(username)
);

CREATE TABLE oauth_users(
   id INT AUTO_INCREMENT,
   access_token VARCHAR(255)  NOT NULL,
   access_token_issued_at DATETIME NOT NULL,
   access_token_expiration DATETIME NOT NULL,
   refresh_token VARCHAR(255)  NOT NULL,
   refresh_token_issued_at DATETIME NOT NULL,
   refresh_token_expiration DATETIME,
   granted_scopes VARCHAR(255) ,
   email VARCHAR(255) ,
   id_1 INT,
   PRIMARY KEY(id),
   UNIQUE(email),
   FOREIGN KEY(id_1) REFERENCES users(id)
);

CREATE TABLE user_profile(
   id INT AUTO_INCREMENT,
   first_name VARCHAR(50) ,
   last_name VARCHAR(50) ,
   phone VARCHAR(50) ,
   department VARCHAR(255) ,
   salary DECIMAL(10,2)  ,
   status VARCHAR(50) ,
   oauth_user_image_link VARCHAR(255) ,
   user_image BLOB,
   bio TEXT,
   youtube VARCHAR(255) ,
   twitter VARCHAR(255) ,
   facebook VARCHAR(255) ,
   country VARCHAR(100) ,
   _position_ VARCHAR(100) ,
   address VARCHAR(255) ,
   id_1 INT,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES users(id)
);

CREATE TABLE roles(
   id INT AUTO_INCREMENT,
   name VARCHAR(255) ,
   PRIMARY KEY(id)
);

CREATE TABLE employee(
   id INT AUTO_INCREMENT,
   username VARCHAR(45)  NOT NULL,
   first_name VARCHAR(45)  NOT NULL,
   last_name VARCHAR(45)  NOT NULL,
   email VARCHAR(45)  NOT NULL,
   password VARCHAR(80)  NOT NULL,
   provider VARCHAR(45) ,
   PRIMARY KEY(id)
);

CREATE TABLE email_template(
   template_id INT AUTO_INCREMENT,
   name VARCHAR(255) ,
   content TEXT,
   json_design TEXT,
   created_at DATETIME,
   id INT,
   PRIMARY KEY(template_id),
   UNIQUE(name),
   FOREIGN KEY(id) REFERENCES users(id)
);

CREATE TABLE customer_login_info(
   id INT AUTO_INCREMENT,
   password VARCHAR(255) ,
   username VARCHAR(255) ,
   token VARCHAR(500) ,
   password_set TINYINT,
   PRIMARY KEY(id),
   UNIQUE(token)
);

CREATE TABLE customer(
   customer_id INT AUTO_INCREMENT,
   name VARCHAR(255) ,
   address VARCHAR(255) ,
   city VARCHAR(255) ,
   state VARCHAR(255) ,
   phone VARCHAR(20) ,
   country VARCHAR(255) ,
   description TEXT,
   _position_ VARCHAR(255) ,
   twitter VARCHAR(255) ,
   facebook VARCHAR(255) ,
   youtube VARCHAR(255) ,
   created_at DATETIME,
   email VARCHAR(255) ,
   id INT,
   id_1 INT,
   PRIMARY KEY(customer_id),
   FOREIGN KEY(id) REFERENCES customer_login_info(id),
   FOREIGN KEY(id_1) REFERENCES users(id)
);

CREATE TABLE trriger_lead(
   lead_id INT AUTO_INCREMENT,
   name VARCHAR(255) ,
   phone VARCHAR(20) ,
   status VARCHAR(50) ,
   meeting_id VARCHAR(255) ,
   google_drive TINYINT,
   google_drive_folder_id VARCHAR(255) ,
   id INT,
   id_1 INT,
   customer_id INT,
   PRIMARY KEY(lead_id),
   UNIQUE(meeting_id),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(id_1) REFERENCES users(id),
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE trigger_ticket(
   ticket_id INT AUTO_INCREMENT,
   subject VARCHAR(255) ,
   description TEXT,
   status VARCHAR(50) ,
   priority VARCHAR(50) ,
   created_at DATETIME,
   id INT,
   id_1 INT,
   customer_id INT,
   PRIMARY KEY(ticket_id),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(id_1) REFERENCES users(id),
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE trigger_contract(
   contract_id INT AUTO_INCREMENT,
   subject VARCHAR(255) ,
   status VARCHAR(100) ,
   description TEXT,
   start_date DATE,
   end_date DATE,
   amount DECIMAL(10,2)  ,
   google_drive TINYINT,
   google_drive_folder_id VARCHAR(255) ,
   created_at DATETIME,
   customer_id INT,
   id INT,
   lead_id INT,
   PRIMARY KEY(contract_id),
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(lead_id) REFERENCES trriger_lead(lead_id)
);

CREATE TABLE contract_settings(
   id INT AUTO_INCREMENT,
   amount TINYINT,
   subject TINYINT,
   description TINYINT,
   end_date TINYINT,
   start_date TINYINT,
   status TINYINT,
   template_id INT,
   template_id_1 INT,
   template_id_2 INT,
   template_id_3 INT,
   template_id_4 INT,
   template_id_5 INT,
   id_1 INT,
   id_2 INT,
   PRIMARY KEY(id),
   FOREIGN KEY(template_id) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_1) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_2) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_3) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_4) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_5) REFERENCES email_template(template_id),
   FOREIGN KEY(id_1) REFERENCES customer_login_info(id),
   FOREIGN KEY(id_2) REFERENCES users(id)
);

CREATE TABLE lead_action(
   id INT AUTO_INCREMENT,
   action VARCHAR(255) ,
   date_time DATETIME,
   lead_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(lead_id) REFERENCES trriger_lead(lead_id)
);

CREATE TABLE lead_settings(
   id INT AUTO_INCREMENT,
   status TINYINT,
   meeting TINYINT,
   phone TINYINT,
   name TINYINT,
   template_id INT,
   template_id_1 INT,
   template_id_2 INT,
   template_id_3 INT,
   id_1 INT,
   id_2 INT,
   PRIMARY KEY(id),
   FOREIGN KEY(template_id) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_1) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_2) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_3) REFERENCES email_template(template_id),
   FOREIGN KEY(id_1) REFERENCES customer_login_info(id),
   FOREIGN KEY(id_2) REFERENCES users(id)
);

CREATE TABLE ticket_settings(
   id INT AUTO_INCREMENT,
   priority TINYINT,
   subject TINYINT,
   description TINYINT,
   status TINYINT,
   template_id INT,
   template_id_1 INT,
   template_id_2 INT,
   template_id_3 INT,
   id_1 INT,
   id_2 INT,
   PRIMARY KEY(id),
   FOREIGN KEY(template_id) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_1) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_2) REFERENCES email_template(template_id),
   FOREIGN KEY(template_id_3) REFERENCES email_template(template_id),
   FOREIGN KEY(id_1) REFERENCES customer_login_info(id),
   FOREIGN KEY(id_2) REFERENCES users(id)
);

CREATE TABLE file(
   file_id INT AUTO_INCREMENT,
   file_name VARCHAR(100) ,
   file_data BLOB,
   file_type VARCHAR(255) ,
   contract_id INT,
   lead_id INT,
   PRIMARY KEY(file_id),
   FOREIGN KEY(contract_id) REFERENCES trigger_contract(contract_id),
   FOREIGN KEY(lead_id) REFERENCES trriger_lead(lead_id)
);

CREATE TABLE google_drive_file(
   id INT AUTO_INCREMENT,
   drive_file_id VARCHAR(255) ,
   drive_folder_id VARCHAR(255) ,
   contract_id INT,
   lead_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(contract_id) REFERENCES trigger_contract(contract_id),
   FOREIGN KEY(lead_id) REFERENCES trriger_lead(lead_id)
);

CREATE TABLE user_roles(
   id INT,
   id_1 INT,
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(id_1) REFERENCES roles(id)
);
