-- Garante UUID via pgcrypto (Neon)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "admins" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
    "nome" VARCHAR(60) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "nivel" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
