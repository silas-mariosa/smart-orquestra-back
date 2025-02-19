CREATE TABLE `louvores` (
	`id` text PRIMARY KEY NOT NULL,
	`nameLouvor` text NOT NULL,
	`description` text,
	`orchestra_id` text NOT NULL,
	`pdf` text,
	`mp3` text,
	`instrumentos` text,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
