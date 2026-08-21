CREATE TABLE IF NOT EXISTS `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`cover_image_url` text NOT NULL,
	`repository_url` text NOT NULL,
	`deploy_url` text,
	`tech_stack` text NOT NULL,
	`published` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `projects_slug_unique` ON `projects` (`slug`);
