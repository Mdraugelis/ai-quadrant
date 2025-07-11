#!/usr/bin/env node

// Test script to demonstrate CSV import functionality
// Run with: node scripts/test-csv-import.js

const fs = require('fs');
const path = require('path');

// Simple CommonJS version of the CSV parser functions for testing
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

const parseCSVData = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file appears to be empty or has no data rows.');
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const nameIndex = headers.findIndex(h => h.includes('project') || h.includes('name') || h.includes('initiative'));
  const categoryIndex = headers.findIndex(h => h.includes('category'));
  const phaseIndex = headers.findIndex(h => h.includes('phase') || h.includes('status'));
  const descriptionIndex = headers.findIndex(h => h.includes('description') || h.includes('desc'));
  const impactIndex = headers.findIndex(h => h.includes('impact'));
  const feasibilityIndex = headers.findIndex(h => h.includes('feasibility') || h.includes('feasible'));
  
  const importedData = [];
  let skippedRows = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.every(v => !v.trim())) continue;
    
    const name = values[nameIndex]?.trim() || `Initiative ${i}`;
    
    if (nameIndex === -1 && !values[0]?.trim()) {
      skippedRows++;
      continue;
    }
    
    let category = values[categoryIndex]?.trim() || 'Operational';
    const validCategories = ['Clinical', 'Operational', 'Financial', 'College', 'GHP'];
    if (!validCategories.includes(category)) {
      const matched = validCategories.find(c => 
        c.toLowerCase().includes(category.toLowerCase()) || 
        category.toLowerCase().includes(c.toLowerCase())
      );
      category = matched || 'Operational';
    }
    
    let phase = values[phaseIndex]?.trim()?.toLowerCase() || '';
    const phaseMap = {
      'implemented': 'implemented',
      'complete': 'implemented',
      'done': 'implemented',
      'planned': 'planned',
      'planning': 'planned',
      'scheduled': 'planned',
      'unplanned': 'unplanned',
      'idea': 'unplanned',
      'concept': 'unplanned'
    };
    
    if (phase === '') {
      phase = 'unplanned';
    } else {
      const matchedKey = Object.keys(phaseMap).find(key => 
        phase.includes(key) || key.includes(phase)
      );
      phase = matchedKey ? phaseMap[matchedKey] : 'unplanned';
    }
    
    const impact = Math.max(1, Math.min(5, parseFloat(values[impactIndex]) || 3));
    const feasibility = Math.max(1, Math.min(5, parseFloat(values[feasibilityIndex]) || 3));
    const description = values[descriptionIndex]?.trim() || 'No description provided';
    
    importedData.push({
      name,
      category,
      phase,
      description,
      impact,
      feasibility
    });
  }
  
  return {
    data: importedData,
    skippedRows,
    totalRows: lines.length - 1
  };
};

const generateNewId = (existingData) => {
  if (!existingData || existingData.length === 0) return 1;
  return Math.max(...existingData.map(d => d.id || 0)) + 1;
};

const validateProject = (project) => {
  if (!project) return false;
  
  const validCategories = ['Clinical', 'Operational', 'Financial', 'College', 'GHP'];
  const validPhases = ['implemented', 'planned', 'unplanned'];
  
  return (
    typeof project.name === 'string' &&
    project.name.trim().length > 0 &&
    validCategories.includes(project.category) &&
    validPhases.includes(project.phase) &&
    typeof project.impact === 'number' &&
    project.impact >= 1 && project.impact <= 5 &&
    typeof project.feasibility === 'number' &&
    project.feasibility >= 1 && project.feasibility <= 5 &&
    typeof project.description === 'string'
  );
};

console.log('🧪 Testing CSV Import Functionality\n');

try {
  // Read the example CSV file
  const csvPath = path.join(__dirname, '../src/test-data/example.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  console.log('📁 Reading example CSV file...');
  console.log('📄 CSV Content:');
  console.log(csvContent);
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Parse the CSV
  console.log('⚙️  Parsing CSV data...');
  const parseResult = parseCSVData(csvContent);
  
  console.log(`✅ Successfully parsed ${parseResult.data.length} projects`);
  console.log(`📊 Total rows: ${parseResult.totalRows}`);
  console.log(`⚠️  Skipped rows: ${parseResult.skippedRows}\n`);
  
  // Add IDs and validate
  console.log('🔢 Adding IDs and validating projects...\n');
  
  let existingData = [];
  const dataWithIds = parseResult.data.map((item, index) => {
    const newId = generateNewId(existingData);
    const projectWithId = { id: newId, ...item };
    existingData.push(projectWithId);
    
    const isValid = validateProject(projectWithId);
    
    console.log(`Project ${index + 1}: ${projectWithId.name}`);
    console.log(`  ID: ${projectWithId.id}`);
    console.log(`  Category: ${projectWithId.category}`);
    console.log(`  Phase: ${projectWithId.phase}`);
    console.log(`  Impact: ${projectWithId.impact}`);
    console.log(`  Feasibility: ${projectWithId.feasibility}`);
    console.log(`  Valid: ${isValid ? '✅' : '❌'}`);
    console.log('');
    
    return projectWithId;
  });
  
  // Summary
  const validProjects = dataWithIds.filter(p => validateProject(p));
  console.log('📈 Summary:');
  console.log(`  Total projects processed: ${dataWithIds.length}`);
  console.log(`  Valid projects: ${validProjects.length}`);
  console.log(`  Success rate: ${(validProjects.length / dataWithIds.length * 100).toFixed(1)}%`);
  
  // Phase distribution
  console.log('\n📊 Phase Distribution:');
  const phases = {};
  dataWithIds.forEach(p => {
    phases[p.phase] = (phases[p.phase] || 0) + 1;
  });
  Object.entries(phases).forEach(([phase, count]) => {
    console.log(`  ${phase}: ${count} projects`);
  });
  
  // Category distribution
  console.log('\n🏷️  Category Distribution:');
  const categories = {};
  dataWithIds.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} projects`);
  });
  
  console.log('\n🎉 CSV import test completed successfully!');
  
} catch (error) {
  console.error('❌ Error during CSV import test:', error.message);
  process.exit(1);
}