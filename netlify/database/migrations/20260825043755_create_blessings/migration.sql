CREATE TABLE "blessings" (
	"id" serial PRIMARY KEY,
	"child" text NOT NULL,
	"guest_name" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
