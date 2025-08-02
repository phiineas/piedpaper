ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text DEFAULT 'credentials';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text;