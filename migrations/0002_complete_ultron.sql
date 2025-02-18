CREATE TABLE `instruments` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` integer NOT NULL,
	`type` text NOT NULL,
	`categories` integer,
	`description` text,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `list_instruments` (
	`id` integer PRIMARY KEY NOT NULL,
	`orchestra_id` integer NOT NULL,
	`instrument_id` integer NOT NULL,
	`user_id` integer NOT NULL,
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
CREATE TABLE `categories_instruments` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` integer NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_address` (
	`id` integer PRIMARY KEY NOT NULL,
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
	`id` integer PRIMARY KEY NOT NULL,
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
CREATE TABLE `__new_orchestra` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`auth_id` integer NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_orchestra`("id", "name", "auth_id", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "auth_id", "deleted_at", "created_at", "updated_at" FROM `orchestra`;--> statement-breakpoint
DROP TABLE `orchestra`;--> statement-breakpoint
ALTER TABLE `__new_orchestra` RENAME TO `orchestra`;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` integer PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_user`("id", "name", "brithday", "accessLevel", "address_id", "orchestra_id", "instrument_id", "group_id", "auth_id", "active", "deleted_at", "created_at", "updated_at") SELECT "id", "name", "brithday", "accessLevel", "address_id", "orchestra_id", "instrument_id", "group_id", "auth_id", "active", "deleted_at", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;