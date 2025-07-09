#!/usr/bin/env tsx

import { wineIndexes, generateTerraformIndexes, validateIndexesAgainstSchema } from '../lib/firestoreIndexes';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

console.log('🔍 Validating indexes against Zod schemas...');
const isValid = validateIndexesAgainstSchema(wineIndexes);

if (!isValid) {
  console.error('❌ Index validation failed!');
  process.exit(1);
}

console.log('✅ All indexes are valid against Zod schemas');

console.log('📝 Generating Terraform index configuration...');
const terraformConfig = generateTerraformIndexes(wineIndexes);

// Add header and imports
const fullConfig = `# Auto-generated Terraform configuration from Zod schemas
# Generated on: ${new Date().toISOString()}
# Source: lib/zodSchemas.ts

${terraformConfig}

# Output the index information
output "firestore_indexes" {
  description = "List of created Firestore indexes"
  value = [
    google_firestore_index.wines_created_at_desc.id,
    google_firestore_index.wines_characteristics.id,
    google_firestore_index.wines_region_grape.id,
    google_firestore_index.wines_rating.id,
    google_firestore_index.wines_vintage.id,
    google_firestore_index.wines_name_search.id
  ]
}

output "index_descriptions" {
  description = "Descriptions of all indexes"
  value = {
    wines_created_at_desc = "Index for listing wines by creation date (newest first)",
    wines_characteristics = "Index for wine characteristics queries and filtering", 
    wines_region_grape = "Index for region and grape variety searches",
    wines_rating = "Index for rating-based queries",
    wines_vintage = "Index for vintage-based queries",
    wines_name_search = "Index for name-based searches"
  }
}
`;

// Write to file
const outputPath = join(__dirname, '../infra/firebase/generated-indexes.tf');
writeFileSync(outputPath, fullConfig);

console.log(`✅ Generated Terraform configuration: ${outputPath}`);
console.log(`📊 Created ${wineIndexes.length} indexes:`);

wineIndexes.forEach(index => {
  console.log(`   - ${index.name}: ${index.description}`);
  console.log(`     Fields: ${index.fields.map(f => f.field_path).join(', ')}`);
});

// Automatically run Terraform commands
console.log('\n🚀 Automatically applying Terraform changes...');

try {
  // Change to the firebase directory
  const firebaseDir = join(__dirname, '../infra/firebase');
  process.chdir(firebaseDir);
  
  console.log('📋 Running terraform plan...');
  execSync('terraform plan', { stdio: 'inherit' });
  
  console.log('✅ Terraform plan completed successfully');
  console.log('🔧 Running terraform apply...');
  execSync('terraform apply -auto-approve', { stdio: 'inherit' });
  
  console.log('🎉 Successfully applied all Terraform changes!');
  console.log('✨ Your Firestore indexes are now live and ready to use.');
  
} catch (error) {
  console.error('❌ Terraform execution failed:', error);
  console.log('\n💡 You can manually run the commands:');
  console.log('   cd infra/firebase');
  console.log('   terraform plan');
  console.log('   terraform apply');
  process.exit(1);
} 