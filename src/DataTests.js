// Comprehensive test cases for AI Quadrant data operations
// Run these in browser console to verify functionality

class DataIntegrityTests {
  constructor() {
    this.testResults = [];
    this.testData = [
      { id: 1, name: "Test Project 1", feasibility: 3.0, impact: 4.0, category: "Clinical", description: "Test description 1" },
      { id: 2, name: "Test Project 2", feasibility: 2.5, impact: 3.5, category: "Operational", description: "Test description 2" }
    ];
  }

  log(testName, result, details = '') {
    const status = result ? '✅ PASS' : '❌ FAIL';
    const message = `${status}: ${testName}${details ? ' - ' + details : ''}`;
    this.testResults.push({ testName, result, details, message });
    console.log(message);
  }

  // Test ID generation for uniqueness and consistency
  testIdGeneration() {
    console.log('\n🔍 Testing ID Generation...');
    
    // Test 1: Empty array should start with ID 1
    const emptyArrayId = this.generateNewId([]);
    this.log('Empty array ID generation', emptyArrayId === 1, `Expected: 1, Got: ${emptyArrayId}`);
    
    // Test 2: Sequential ID generation
    const testIds = [1, 2, 3];
    const nextId = this.generateNewId(testIds.map(id => ({ id })));
    this.log('Sequential ID generation', nextId === 4, `Expected: 4, Got: ${nextId}`);
    
    // Test 3: Non-sequential ID handling (gaps)
    const gappedIds = [1, 3, 7];
    const gappedNextId = this.generateNewId(gappedIds.map(id => ({ id })));
    this.log('Gap-tolerant ID generation', gappedNextId === 8, `Expected: 8, Got: ${gappedNextId}`);
    
    // Test 4: Duplicate ID prevention
    const duplicateTest = [1, 2, 2, 3];
    const noDuplicateId = this.generateNewId(duplicateTest.map(id => ({ id })));
    this.log('Duplicate-resistant ID generation', noDuplicateId === 4, `Expected: 4, Got: ${noDuplicateId}`);
  }

  // Test localStorage persistence
  testLocalStoragePersistence() {
    console.log('\n🔍 Testing localStorage Persistence...');
    
    const testKey = 'test-ai-quadrant-data';
    const testData = this.testData;
    
    try {
      // Test 1: Save data
      localStorage.setItem(testKey, JSON.stringify(testData));
      this.log('localStorage save', true);
      
      // Test 2: Retrieve data
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      const dataMatches = JSON.stringify(retrieved) === JSON.stringify(testData);
      this.log('localStorage retrieve', dataMatches, `Data integrity: ${dataMatches}`);
      
      // Test 3: Large data handling
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Project ${i + 1}`,
        feasibility: Math.random() * 5,
        impact: Math.random() * 5,
        category: ['Clinical', 'Operational', 'Financial'][i % 3],
        description: `Description for project ${i + 1}`
      }));
      
      localStorage.setItem(testKey + '-large', JSON.stringify(largeData));
      const retrievedLarge = JSON.parse(localStorage.getItem(testKey + '-large'));
      this.log('Large data handling', retrievedLarge.length === 100, `Expected: 100, Got: ${retrievedLarge.length}`);
      
      // Cleanup
      localStorage.removeItem(testKey);
      localStorage.removeItem(testKey + '-large');
      
    } catch (error) {
      this.log('localStorage error handling', false, error.message);
    }
  }

  // Test URL compression and decompression
  testUrlCompression() {
    console.log('\n🔍 Testing URL Compression...');
    
    const testData = this.testData;
    
    try {
      // Test 1: Basic compression
      const compressed = btoa(JSON.stringify(testData));
      this.log('Data compression', compressed.length > 0, `Compressed length: ${compressed.length}`);
      
      // Test 2: Decompression accuracy
      const decompressed = JSON.parse(atob(compressed));
      const accurateDecompression = JSON.stringify(decompressed) === JSON.stringify(testData);
      this.log('Decompression accuracy', accurateDecompression);
      
      // Test 3: URL encoding safety
      const urlEncoded = encodeURIComponent(compressed);
      const urlDecoded = decodeURIComponent(urlEncoded);
      this.log('URL encoding safety', urlDecoded === compressed);
      
      // Test 4: Malformed data handling
      try {
        const malformed = JSON.parse(atob('invalid-base64'));
        this.log('Malformed data handling', false, 'Should have thrown error');
      } catch (error) {
        this.log('Malformed data handling', true, 'Correctly threw error');
      }
      
    } catch (error) {
      this.log('URL compression error', false, error.message);
    }
  }

  // Test data validation
  testDataValidation() {
    console.log('\n🔍 Testing Data Validation...');
    
    // Test 1: Valid project structure
    const validProject = {
      id: 1,
      name: "Valid Project",
      feasibility: 3.5,
      impact: 4.2,
      category: "Clinical",
      description: "Valid description"
    };
    this.log('Valid project structure', this.isValidProject(validProject));
    
    // Test 2: Missing required fields
    const missingName = { ...validProject, name: "" };
    this.log('Missing name validation', !this.isValidProject(missingName));
    
    // Test 3: Invalid numeric ranges
    const invalidFeasibility = { ...validProject, feasibility: 6.0 };
    this.log('Invalid feasibility range', !this.isValidProject(invalidFeasibility));
    
    const invalidImpact = { ...validProject, impact: -1.0 };
    this.log('Invalid impact range', !this.isValidProject(invalidImpact));
    
    // Test 4: Invalid category
    const invalidCategory = { ...validProject, category: "InvalidCategory" };
    this.log('Invalid category', !this.isValidProject(invalidCategory));
  }

  // Test concurrent operations
  testConcurrentOperations() {
    console.log('\n🔍 Testing Concurrent Operations...');
    
    let testArray = [...this.testData];
    const operations = [];
    
    // Simulate concurrent adds
    for (let i = 0; i < 5; i++) {
      operations.push(() => {
        const newId = this.generateNewId(testArray);
        testArray.push({
          id: newId,
          name: `Concurrent Project ${i}`,
          feasibility: 3.0,
          impact: 3.0,
          category: "Clinical",
          description: `Concurrent description ${i}`
        });
      });
    }
    
    // Execute operations
    operations.forEach(op => op());
    
    // Check for duplicates
    const ids = testArray.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    this.log('Concurrent operation ID uniqueness', ids.length === uniqueIds.length, 
             `Total IDs: ${ids.length}, Unique IDs: ${uniqueIds.length}`);
  }

  // Helper methods
  generateNewId(data) {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.id || 0)) + 1;
  }

  isValidProject(project) {
    const validCategories = ['Clinical', 'Operational', 'Financial'];
    
    return (
      project &&
      typeof project.id === 'number' &&
      typeof project.name === 'string' &&
      project.name.trim().length > 0 &&
      typeof project.feasibility === 'number' &&
      project.feasibility >= 1 && project.feasibility <= 5 &&
      typeof project.impact === 'number' &&
      project.impact >= 1 && project.impact <= 5 &&
      validCategories.includes(project.category) &&
      typeof project.description === 'string'
    );
  }

  // Run all tests
  runAllTests() {
    console.log('🧪 Starting AI Quadrant Data Integrity Tests...\n');
    
    this.testIdGeneration();
    this.testLocalStoragePersistence();
    this.testUrlCompression();
    this.testDataValidation();
    this.testConcurrentOperations();
    
    console.log('\n📊 Test Summary:');
    const passed = this.testResults.filter(r => r.result).length;
    const total = this.testResults.length;
    console.log(`✅ Passed: ${passed}/${total}`);
    
    if (passed < total) {
      console.log('\n❌ Failed Tests:');
      this.testResults.filter(r => !r.result).forEach(r => {
        console.log(`  - ${r.testName}: ${r.details}`);
      });
    }
    
    return { passed, total, results: this.testResults };
  }
}

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  window.DataIntegrityTests = DataIntegrityTests;
  console.log('💡 Run tests with: new DataIntegrityTests().runAllTests()');
}

export default DataIntegrityTests;