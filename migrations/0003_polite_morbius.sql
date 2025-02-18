PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_address` (
	`id` text PRIMARY KEY NOT NULL,
	`cep` text,
	`estado` text,
	`cidade` text,
	`bairro` text,
	`endereco` text,
	`numero` text,
	`complemento` text
);
--> statement-breakpoint
INSERT INTO `__new_address`("id", "cep", "estado", "cidade", "bairro", "endereco", "numero", "complemento") SELECT "id", "cep", "estado", "cidade", "bairro", "endereco", "numero", "complemento" FROM `address`;--> statement-breakpoint
DROP TABLE `address`;--> statement-breakpoint
ALTER TABLE `__new_address` RENAME TO `address`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_auth` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_auth`("id", "name", "password", "email", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "password", "email", "deleted_at", "created_at", "updated_at" FROM `auth`;--> statement-breakpoint
DROP TABLE `auth`;--> statement-breakpoint
ALTER TABLE `__new_auth` RENAME TO `auth`;--> statement-breakpoint
CREATE UNIQUE INDEX `auth_email_unique` ON `auth` (`email`);--> statement-breakpoint
CREATE TABLE `__new_instruments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` text NOT NULL,
	`type` text NOT NULL,
	`categories` text,
	`description` text,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_instruments`("id", "name", "orchestra_id", "type", "categories", "description", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "orchestra_id", "type", "categories", "description", "deleted_at", "created_at", "updated_at" FROM `instruments`;--> statement-breakpoint
DROP TABLE `instruments`;--> statement-breakpoint
ALTER TABLE `__new_instruments` RENAME TO `instruments`;--> statement-breakpoint
CREATE TABLE `__new_list_instruments` (
	`id` text PRIMARY KEY NOT NULL,
	`orchestra_id` text NOT NULL,
	`instrument_id` text NOT NULL,
	`user_id` text NOT NULL,
	`owner` text NOT NULL,
	`position` text,
	`serie` text,
	`brand` text,
	`model` text,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_list_instruments`("id", "orchestra_id", "instrument_id", "user_id", "owner", "position", "serie", "brand", "model", "deleted_at", "created_at", "updated_at") SELECT "id", "orchestra_id", "instrument_id", "user_id", "owner", "position", "serie", "brand", "model", "deleted_at", "created_at", "updated_at" FROM `list_instruments`;--> statement-breakpoint
DROP TABLE `list_instruments`;--> statement-breakpoint
ALTER TABLE `__new_list_instruments` RENAME TO `list_instruments`;--> statement-breakpoint
CREATE TABLE `__new_orchestra` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`auth_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_orchestra`("id", "name", "auth_id", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "auth_id", "deleted_at", "created_at", "updated_at" FROM `orchestra`;--> statement-breakpoint
DROP TABLE `orchestra`;--> statement-breakpoint
ALTER TABLE `__new_orchestra` RENAME TO `orchestra`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brithday` text,
	`accessLevel` text(2) NOT NULL,
	`address_id` text,
	`orchestra_id` text,
	`instrument_id` text,
	`group_id` text,
	`auth_id` text NOT NULL,
	`active` integer DEFAULT true,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "brithday", "accessLevel", "address_id", "orchestra_id", "instrument_id", "group_id", "auth_id", "active", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "brithday", "accessLevel", "address_id", "orchestra_id", "instrument_id", "group_id", "auth_id", "active", "deleted_at", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE TABLE `__new_categories_instruments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_categories_instruments`("id", "name", "orchestra_id", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "orchestra_id", "deleted_at", "created_at", "updated_at" FROM `categories_instruments`;--> statement-breakpoint
DROP TABLE `categories_instruments`;--> statement-breakpoint
ALTER TABLE `__new_categories_instruments` RENAME TO `categories_instruments`;