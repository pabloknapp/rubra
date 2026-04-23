/*
  Warnings:

  - You are about to drop the column `cidade` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `carroId` on the `propostas` table. All the data in the column will be lost.
  - You are about to drop the `carros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marcas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cartaId` to the `propostas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusProposta" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA');

-- CreateEnum
CREATE TYPE "Graduacao" AS ENUM ('PSA', 'BGS', 'CGC', 'TAG', 'MANAFIX', 'BECKETT', 'OUTRO');

-- CreateEnum
CREATE TYPE "Idioma" AS ENUM ('PORTUGUES', 'INGLES', 'JAPONES');

-- CreateEnum
CREATE TYPE "Raridade" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'HOLO_RARE', 'REVERSE_HOLO', 'ULTRA_RARE', 'FULL_ART', 'SECRET_RARE', 'ILLUSTRATION_RARE', 'SPECIAL_ILLUSTRATION_RARE', 'HYPER_RARE', 'PROMO');

-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('NORMAL', 'FOGO', 'AGUA', 'ELETRICO', 'GRAMA', 'GELO', 'LUTADOR', 'VENENO', 'TERRA', 'VOADOR', 'PSIQUICO', 'INSETO', 'PEDRA', 'FANTASMA', 'DRAGAO', 'SOMBRIO', 'ACO', 'FADA', 'ESTELAR');

-- DropForeignKey
ALTER TABLE "carros" DROP CONSTRAINT "carros_marcaId_fkey";

-- DropForeignKey
ALTER TABLE "propostas" DROP CONSTRAINT "propostas_carroId_fkey";

-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "cidade";

-- AlterTable
ALTER TABLE "propostas" DROP COLUMN "carroId",
ADD COLUMN     "cartaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "carros";

-- DropTable
DROP TABLE "marcas";

-- DropEnum
DROP TYPE "Combustiveis";

-- CreateTable
CREATE TABLE "colecoes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "colecoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartas" (
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

-- AddForeignKey
ALTER TABLE "cartas" ADD CONSTRAINT "cartas_colecaoId_fkey" FOREIGN KEY ("colecaoId") REFERENCES "colecoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propostas" ADD CONSTRAINT "propostas_cartaId_fkey" FOREIGN KEY ("cartaId") REFERENCES "cartas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
