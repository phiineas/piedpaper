CREATE TABLE IF NOT EXISTS "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"content" text DEFAULT '',
	"starred" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
