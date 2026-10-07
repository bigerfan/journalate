-- CreateEnum
CREATE TYPE "Side" AS ENUM ('long', 'short');

-- CreateEnum
CREATE TYPE "CloseReason" AS ENUM ('stop', 'target', 'manual');

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "starting_balance" DECIMAL(20,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "max_risk_pct" DECIMAL(7,4) NOT NULL,
    "strategies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" UUID NOT NULL,
    "pair" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "entry" DECIMAL(20,8) NOT NULL,
    "stop" DECIMAL(20,8) NOT NULL,
    "target" DECIMAL(20,8),
    "size" DECIMAL(20,8) NOT NULL,
    "risk_pct" DECIMAL(7,4) NOT NULL,
    "risk_amount" DECIMAL(20,8) NOT NULL,
    "fees" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "strategy" TEXT,
    "timeframe" TEXT,
    "notes" TEXT,
    "image_url" TEXT,
    "opened_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closes" (
    "id" UUID NOT NULL,
    "trade_id" UUID NOT NULL,
    "percent" DECIMAL(12,8) NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "reason" "CloseReason" NOT NULL,
    "fees" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "mistake" TEXT,
    "note" TEXT,
    "image_url" TEXT,
    "closed_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "closes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trades_opened_at_idx" ON "trades"("opened_at" DESC);

-- CreateIndex
CREATE INDEX "closes_trade_id_idx" ON "closes"("trade_id");

-- AddForeignKey
ALTER TABLE "closes" ADD CONSTRAINT "closes_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE settings
  ADD CONSTRAINT settings_single_row CHECK (id = 1),
  ADD CONSTRAINT settings_balance_positive CHECK (starting_balance > 0),
  ADD CONSTRAINT settings_risk_range CHECK (max_risk_pct > 0 AND max_risk_pct <= 100);

ALTER TABLE trades
  ADD CONSTRAINT trades_positive CHECK (entry > 0 AND stop > 0 AND size > 0 AND (target IS NULL OR target > 0)),
  ADD CONSTRAINT trades_nonneg CHECK (fees >= 0 AND risk_amount >= 0),
  ADD CONSTRAINT trades_levels CHECK (
    (side = 'long'  AND stop < entry AND (target IS NULL OR target > entry)) OR
    (side = 'short' AND stop > entry AND (target IS NULL OR target < entry))
  );

ALTER TABLE closes
  ADD CONSTRAINT closes_percent_range CHECK (percent > 0 AND percent <= 100),
  ADD CONSTRAINT closes_price_positive CHECK (price > 0),
  ADD CONSTRAINT closes_fees_nonneg CHECK (fees >= 0);