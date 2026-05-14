-- Migration inicial (Neon DB vazio)
-- A migration anterior havia sido gerada em cima de um schema legado (carros/marcas),
-- o que quebrava em bancos vazios. Este SQL cria o schema atual do Prisma.

-- Enums (cria somente se não existirem)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StatusProposta') THEN
    CREATE TYPE "StatusProposta" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Graduacao') THEN
    CREATE TYPE "Graduacao" AS ENUM ('PSA', 'BGS', 'CGC', 'TAG', 'MANAFIX', 'BECKETT', 'OUTRO');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Idioma') THEN
    CREATE TYPE "Idioma" AS ENUM ('PORTUGUES', 'INGLES', 'JAPONES');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Raridade') THEN
    CREATE TYPE "Raridade" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'HOLO_RARE', 'REVERSE_HOLO', 'ULTRA_RARE', 'FULL_ART', 'SECRET_RARE', 'ILLUSTRATION_RARE', 'SPECIAL_ILLUSTRATION_RARE', 'HYPER_RARE', 'PROMO');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Tipo') THEN
    CREATE TYPE "Tipo" AS ENUM ('NORMAL', 'FOGO', 'AGUA', 'ELETRICO', 'GRAMA', 'GELO', 'LUTADOR', 'VENENO', 'TERRA', 'VOADOR', 'PSIQUICO', 'INSETO', 'PEDRA', 'FANTASMA', 'DRAGAO', 'SOMBRIO', 'ACO', 'FADA', 'ESTELAR');
  END IF;
END $$;

-- Tabelas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "colecoes" (
  "id" SERIAL NOT NULL,
  "nome" VARCHAR(30) NOT NULL,
  CONSTRAINT "colecoes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "cartas" (
  "id" SERIAL NOT NULL,
  "imagem" TEXT NOT NULL,
  "pokemon" VARCHAR(30) NOT NULL,
  "tipo" "Tipo" NOT NULL DEFAULT 'NORMAL',
  "graduacao" "Graduacao" NOT NULL DEFAULT 'OUTRO',
  "nota" SMALLINT NOT NULL,
  "idioma" "Idioma" NOT NULL DEFAULT 'PORTUGUES',
  "ano" SMALLINT NOT NULL,
  "raridade" "Raridade" NOT NULL DEFAULT 'COMMON',
  "preco" DECIMAL(10,2) NOT NULL,
  "destaque" BOOLEAN NOT NULL DEFAULT true,
  "colecaoId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cartas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "clientes" (
  "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid()::text,
  "nome" VARCHAR(60) NOT NULL,
  "email" VARCHAR(40) NOT NULL,
  "senha" VARCHAR(60) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- Prisma espera email único
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'clientes_email_key'
  ) THEN
    CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "propostas" (
  "id" SERIAL NOT NULL,
  "clienteId" VARCHAR(36) NOT NULL,
  "cartaId" INTEGER NOT NULL,
  "descricao" VARCHAR(255) NOT NULL,
  "resposta" VARCHAR(255),
  "status" "StatusProposta" NOT NULL DEFAULT 'PENDENTE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "propostas_pkey" PRIMARY KEY ("id")
);

-- FKs (com guardas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cartas_colecaoId_fkey'
  ) THEN
    ALTER TABLE "cartas"
      ADD CONSTRAINT "cartas_colecaoId_fkey"
      FOREIGN KEY ("colecaoId") REFERENCES "colecoes"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'propostas_clienteId_fkey'
  ) THEN
    ALTER TABLE "propostas"
      ADD CONSTRAINT "propostas_clienteId_fkey"
      FOREIGN KEY ("clienteId") REFERENCES "clientes"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'propostas_cartaId_fkey'
  ) THEN
    ALTER TABLE "propostas"
      ADD CONSTRAINT "propostas_cartaId_fkey"
      FOREIGN KEY ("cartaId") REFERENCES "cartas"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
