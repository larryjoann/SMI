CREATE TABLE IF NOT EXISTS `depenses_ticket` (
     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
     `ticket_id` INT UNSIGNED DEFAULT NULL,
     `amount` DECIMAL(10,0) DEFAULT NULL,
    `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_ticket_id_ticket` (`ticket_id`),
    CONSTRAINT `fk_ticket_id_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `trigger_ticket` (`ticket_id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `depenses_lead` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `lead_id` INT UNSIGNED DEFAULT NULL,
   `amount` DECIMAL(10,0) DEFAULT NULL,
    `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_lead_id_lead` (`lead_id`),
    CONSTRAINT `fk_lead_id_lead` FOREIGN KEY (`lead_id`) REFERENCES `trigger_lead` (`lead_id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `budget_customer` (
     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
     `customer_id` INT UNSIGNED NOT NULL,
     `insert_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
     `amount` DECIMAL(10,0) DEFAULT NULL,
    `user_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_budget_customer` (`customer_id`),
    CONSTRAINT `fk_budget_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
    KEY `fk_budget_user` (`user_id`),
    CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `taux_alert` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `taux` DOUBLE NOT NULL,
    `update_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Création de la table principale
CREATE TABLE IF NOT EXISTS `import_customer` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_email` VARCHAR(100) NOT NULL,
    `customer_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Création de la table des tickets avec contraintes ENUM et CHECK
CREATE TABLE IF NOT EXISTS `import_lead_ticket` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_email` VARCHAR(100) NOT NULL,
    `subject_or_name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10,0) NOT NULL CHECK (`amount` >= 0),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `import_budget_customer` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `customer_email` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10,0) NOT NULL CHECK (`amount` >= 0),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO customer (name, email, created_at, user_id)
SELECT ic.customer_name, ic.customer_email, NOW(), 52
FROM import_customer ic;

INSERT INTO budget_customer (customer_id, insert_at, amount, user_id)
SELECT c.customer_id, NOW(), ibc.amount, 52
FROM import_budget_customer ibc
JOIN customer c ON ibc.customer_email = c.email;