CREATE TABLE `is_email_valid` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(8) NOT NULL,
	`expires_at` timestamp DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `is_email_valid_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `is_email_valid` ADD CONSTRAINT `is_email_valid_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;