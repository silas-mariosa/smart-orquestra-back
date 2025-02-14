CREATE TABLE `address` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cep` text,
	`estado` text,
	`cidade` text,
	`bairro` text,
	`endereco` text,
	`numero` text,
	`complemento` text
);
--> statement-breakpoint
CREATE TABLE `orchestra` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`auth_id` integer NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`brithday` text,
	`accessLevel` text(2) NOT NULL,
	`address_id` integer,
	`orchestra_id` integer,
	`instrument_id` integer,
	`group_id` integer,
	`auth_id` integer NOT NULL,
	`active` integer DEFAULT true,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
ALTER TABLE `auth` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `auth` DROP COLUMN `email_confirmed_at`;