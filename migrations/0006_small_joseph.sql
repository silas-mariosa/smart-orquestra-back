CREATE TABLE `group_list` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
