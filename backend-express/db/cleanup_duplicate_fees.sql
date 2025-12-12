-- SQL script to remove duplicate fees from database
-- This will keep only one instance of each fee name per customer

-- First, let's see what duplicates exist
SELECT name, COUNT(*) as count 
FROM fees 
WHERE customer_id = 'test-customer-1'
GROUP BY name 
HAVING COUNT(*) > 1;

-- Delete duplicates, keeping only the one with the lowest ID
DELETE FROM fees
WHERE id NOT IN (
  SELECT MIN(id)
  FROM fees
  WHERE customer_id = 'test-customer-1'
  GROUP BY name
);

-- Verify the result
SELECT id, name, calculation_type, amount, application_type, enabled
FROM fees
WHERE customer_id = 'test-customer-1'
ORDER BY id;
