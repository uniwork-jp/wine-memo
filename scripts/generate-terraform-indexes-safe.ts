#!/usr/bin/env tsx

import { wineIndexes, generateTerraformIndexes, validateIndexesAgainstSchema } from '../lib/firestoreIndexes';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { createInterface } from 'readline';

(async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, resolve);
    });
  };

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

# Note: Outputs are defined in outputs.tf to avoid duplicates
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

  // Ask for confirmation before applying
  console.log('\n⚠️  This will apply changes to your Firebase infrastructure.');
  const answer = await question('Do you want to apply these changes? (y/N): ');

  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('❌ Changes not applied. You can manually run:');
    console.log('   cd infra/firebase');
    console.log('   terraform plan');
    console.log('   terraform apply');
    rl.close();
    process.exit(0);
  }

  // Automatically run Terraform commands
  console.log('\n🚀 Applying Terraform changes...');

  try {
    // Change to the firebase directory
    const firebaseDir = join(__dirname, '../infra/firebase');
    process.chdir(firebaseDir);
    
    console.log('📋 Running terraform plan...');
    execSync('terraform plan', { stdio: 'inherit' });
    
    console.log('✅ Terraform plan completed successfully');
    
    const applyAnswer = await question('Do you want to apply these changes? (y/N): ');
    
    if (applyAnswer.toLowerCase() !== 'y' && applyAnswer.toLowerCase() !== 'yes') {
      console.log('❌ Changes not applied.');
      rl.close();
      process.exit(0);
    }
    
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
  } finally {
    rl.close();
  }
})(); 