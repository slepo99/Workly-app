CREATE TYPE "public"."project_status" AS ENUM('active', 'on_hold', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."project_status";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "status" SET DATA TYPE "public"."project_status" USING "status"::"public"."project_status";