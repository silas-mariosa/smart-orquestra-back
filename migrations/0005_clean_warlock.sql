CREATE TABLE `grupos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`historia` text,
	`orchestra_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
