CREATE TABLE `address` (
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
CREATE TABLE `auth` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_email_unique` ON `auth` (`email`);--> statement-breakpoint
CREATE TABLE `ensaios` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start` text NOT NULL,
	`end` text,
	`date` text,
	`orchestra_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `group_list` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` text NOT NULL,
	`user_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `grupos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`historia` text,
	`orchestra_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `instruments` (
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
CREATE TABLE `list_instruments` (
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
--> statement-breakpoint
CREATE TABLE `orchestra` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`auth_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brithday` text,
	`accessLevel` text(2) NOT NULL,
	`address_id` text,
	`whatsapp` text,
	`orchestra_id` text,
	`auth_id` text NOT NULL,
	`active` integer DEFAULT true,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `categories_instruments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`orchestra_id` text NOT NULL,
	`deleted_at` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
