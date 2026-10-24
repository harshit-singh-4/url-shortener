CREATE TABLE `password_reset_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` text NOT NULL,
	`expires_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 HOUR),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_token_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_token_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;