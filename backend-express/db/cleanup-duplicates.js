// Script to clean up duplicate fees in the database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'calculator.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking for duplicate fees...\n');

// First, show duplicates
db.all(`
  SELECT name, COUNT(*) as count 
  FROM fees 
  WHERE customer_id = 'test-customer-1'
  GROUP BY name 
  HAVING COUNT(*) > 1
`, (err, duplicates) => {
  if (err) {
    console.error('❌ Error checking duplicates:', err);
    return;
  }

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!');
    db.close();
    return;
  }

  console.log('Found duplicates:');
  duplicates.forEach(dup => {
    console.log(`  - "${dup.name}": ${dup.count} copies`);
  });

  console.log('\n🗑️  Removing duplicates (keeping first occurrence)...\n');

  // Delete duplicates, keeping only the one with the lowest ID
  db.run(`
    DELETE FROM fees
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM fees
      WHERE customer_id = 'test-customer-1'
      GROUP BY name
    )
  `, function(err) {
    if (err) {
      console.error('❌ Error deleting duplicates:', err);
      db.close();
      return;
    }

    console.log(`✅ Deleted ${this.changes} duplicate fees\n`);

    // Show remaining fees
    db.all(`
      SELECT id, name, calculation_type, amount, application_type, enabled
      FROM fees
      WHERE customer_id = 'test-customer-1'
      ORDER BY id
    `, (err, fees) => {
      if (err) {
        console.error('❌ Error fetching fees:', err);
      } else {
        console.log('Remaining fees:');
        fees.forEach(fee => {
          console.log(`  [${fee.id}] ${fee.name} - ${fee.calculation_type} ${fee.amount} Kč (${fee.application_type}) ${fee.enabled ? '✓' : '✗'}`);
        });
      }
      
      db.close();
      console.log('\n✅ Database cleanup complete!');
    });
  });
});
