# Testing Infrastructure

This document describes the comprehensive testing infrastructure for the AI Opportunity Quadrant application, with a focus on CSV import functionality.

## Overview

The testing infrastructure includes:
- Unit tests for CSV parsing utilities
- Integration tests for end-to-end CSV import workflows
- Test utilities and helpers
- Example test data
- Automated test scripts

## Test Structure

```
src/
├── utils/
│   ├── csvParser.js           # CSV parsing utilities
│   └── csvParser.test.js      # Unit tests for CSV parsing
├── test-utils/
│   └── testHelpers.js         # Test utilities and helpers
├── test-data/
│   └── example.csv           # Example CSV data from README
├── setupTests.js             # Jest configuration
└── DataTests.js              # Browser console tests (legacy)
scripts/
└── test-csv-import.js        # CLI test script for CSV functionality
```

## Running Tests

### Unit Tests
```bash
# Run all Jest unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### CSV Import Testing
```bash
# Run CSV import demonstration script
npm run test:csv
```

## Test Coverage

### CSV Parser Utils (`csvParser.test.js`)
- **parseCSVLine**: Tests CSV line parsing with various edge cases
  - Simple CSV parsing
  - Quoted values with commas
  - Whitespace handling
  - Empty values
  - Nested quotes (limited support)

- **parseCSVData**: Tests full CSV data parsing
  - Valid CSV parsing
  - Missing headers handling
  - Default value application
  - Numeric validation and clamping
  - Invalid category handling
  - Phase mapping variations
  - Empty row skipping
  - Error handling for invalid CSV

- **generateNewId**: Tests ID generation
  - Empty array handling
  - Sequential ID generation
  - Non-sequential ID handling
  - Missing ID properties

- **validateProject**: Tests project validation
  - Valid project structure
  - Missing required fields
  - Invalid numeric ranges
  - Invalid categories and phases
  - Null/undefined handling

### Integration Tests
- End-to-end CSV processing workflow
- Real-world CSV edge cases
- Data validation pipeline
- ID assignment workflow

## Test Data

### Example CSV Format
The test suite uses the CSV format documented in the README:

```csv
Project Name,Category,Phase,Description,Impact,Feasibility
AI-Powered Diagnosis Assistant,Clinical,Planned,Machine learning tool to assist radiologists,5,3
Automated Patient Scheduling,Operational,Implemented,Smart scheduling system to reduce wait times,4,5
Predictive Analytics Dashboard,Financial,Unplanned,Revenue forecasting using historical data,4,2
Virtual Health Assistant,Clinical,Planned,Chatbot for patient triage and basic health questions,3,4
Supply Chain Optimization,Operational,Implemented,AI-driven inventory management system,4,4
```

### Test Variations
The test suite includes variations for:
- Missing data
- Invalid data types
- Out-of-range values
- Malformed CSV structure
- Edge cases with quotes and commas

## Test Utilities

### `testHelpers.js`
Provides utilities for:
- Mock file creation
- Browser API mocking (localStorage, FileReader)
- Sample test data
- Performance measurement
- Test environment cleanup
- Assertion helpers

### Key Functions
- `createMockFile()`: Creates mock File objects for upload testing
- `mockBrowserAPIs()`: Mocks browser APIs for testing
- `expectValidProject()`: Assertion helper for project validation
- `measurePerformance()`: Performance testing utility
- `cleanupTestEnvironment()`: Test cleanup

## CSV Import Testing Script

The `scripts/test-csv-import.js` provides a command-line demonstration of CSV import functionality:

### Features
- Reads example CSV file
- Parses and validates data
- Generates unique IDs
- Provides detailed output with statistics
- Shows phase and category distributions

### Output Example
```
🧪 Testing CSV Import Functionality

📁 Reading example CSV file...
⚙️  Parsing CSV data...
✅ Successfully parsed 5 projects
📊 Total rows: 5
⚠️  Skipped rows: 0

🔢 Adding IDs and validating projects...
[Detailed project information...]

📈 Summary:
  Total projects processed: 5
  Valid projects: 5
  Success rate: 100.0%
```

## Error Handling

The test suite validates error handling for:
- Empty CSV files
- Malformed CSV structure
- Invalid data types
- Out-of-range numeric values
- Missing required fields
- Browser API failures

## Performance Testing

Basic performance testing is included via:
- `measurePerformance()` utility function
- Large dataset testing (100+ projects)
- Memory usage validation for localStorage

## Browser Console Testing (Legacy)

The `DataTests.js` file provides browser console tests for:
- Data integrity validation
- localStorage persistence
- URL compression/decompression
- Concurrent operations
- ID generation consistency

Run in browser console:
```javascript
new DataIntegrityTests().runAllTests()
```

## Continuous Integration

The test suite is designed to work with CI/CD pipelines:
- All tests are deterministic
- No external dependencies
- Fast execution (< 1 second)
- Clear error reporting
- Exit codes for automation

## Adding New Tests

When adding new CSV import features:

1. **Add unit tests** in `csvParser.test.js`
2. **Update test data** in `src/test-data/`
3. **Add integration tests** for end-to-end workflows
4. **Update documentation** with new test cases
5. **Verify browser compatibility** if needed

### Test Naming Convention
- `should [expected behavior]` for positive tests
- `should handle [edge case]` for edge case tests
- `should reject [invalid input]` for validation tests
- `should throw error for [error condition]` for error tests

## Best Practices

- **Comprehensive edge case coverage**: Test malformed data, missing fields, invalid types
- **Clear test descriptions**: Use descriptive test names and comments
- **Isolated tests**: Each test should be independent and repeatable
- **Mock external dependencies**: Use mocks for browser APIs and file operations
- **Performance considerations**: Include tests for large datasets
- **Error validation**: Verify proper error handling and user feedback