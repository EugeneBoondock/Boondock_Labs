CREATE TABLE quote_items_verified_market (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  position INTEGER NOT NULL,
  service_code TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_minor INTEGER,
  line_total_minor INTEGER,
  pricing_source TEXT NOT NULL CHECK (pricing_source IN ('catalog','review','verified_market')),
  UNIQUE (quote_id, position)
);

INSERT INTO quote_items_verified_market
  (id,quote_id,position,service_code,description,quantity,unit_price_minor,line_total_minor,pricing_source)
SELECT id,quote_id,position,service_code,description,quantity,unit_price_minor,line_total_minor,pricing_source
FROM quote_items;

DROP TABLE quote_items;
ALTER TABLE quote_items_verified_market RENAME TO quote_items;
