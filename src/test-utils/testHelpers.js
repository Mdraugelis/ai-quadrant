// Test utilities and helpers for AI Quadrant testing

/**
 * Creates a mock File object for testing file uploads
 * @param {string} content - The file content
 * @param {string} filename - The filename
 * @param {string} type - The MIME type
 * @returns {File} Mock File object
 */
export const createMockFile = (content, filename = 'test.csv', type = 'text/csv') => {
  const blob = new Blob([content], { type });
  const file = new File([blob], filename, { type });
  return file;
};

/**
 * Creates a mock FileReader event for testing
 * @param {string} result - The file content result
 * @returns {Object} Mock event object
 */
export const createMockFileReaderEvent = (result) => ({
  target: { result }
});

/**
 * Mock implementations for browser APIs
 */
export const mockBrowserAPIs = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock FileReader
  class MockFileReader {
    constructor() {
      this.readAsText = jest.fn();
      this.onload = null;
      this.onerror = null;
    }
    
    // Simulate successful file read
    simulateLoad(content) {
      setTimeout(() => {
        if (this.onload) {
          this.onload(createMockFileReaderEvent(content));
        }
      }, 0);
    }
    
    // Simulate file read error
    simulateError(error) {
      setTimeout(() => {
        if (this.onerror) {
          this.onerror(error);
        }
      }, 0);
    }
  }
  
  global.FileReader = MockFileReader;
  
  // Mock btoa/atob for URL encoding tests
  if (!global.btoa) {
    global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
  }
  if (!global.atob) {
    global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
  }
  
  return { localStorageMock };
};

/**
 * Sample test data for consistent testing
 */
export const sampleProjects = [
  {
    id: 1,
    name: 'AI Diagnosis Assistant',
    category: 'Clinical',
    phase: 'planned',
    description: 'ML tool for radiology',
    impact: 5,
    feasibility: 3
  },
  {
    id: 2,
    name: 'Patient Scheduling',
    category: 'Operational',
    phase: 'implemented',
    description: 'Smart scheduling system',
    impact: 4,
    feasibility: 5
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    category: 'Financial',
    phase: 'unplanned',
    description: 'Revenue forecasting',
    impact: 4,
    feasibility: 2
  }
];

/**
 * Sample CSV data for testing
 */
export const sampleCSVData = {
  valid: `Project Name,Category,Phase,Description,Impact,Feasibility
AI-Powered Diagnosis Assistant,Clinical,Planned,Machine learning tool to assist radiologists,5,3
Automated Patient Scheduling,Operational,Implemented,Smart scheduling system to reduce wait times,4,5
Predictive Analytics Dashboard,Financial,Unplanned,Revenue forecasting using historical data,4,2`,

  withMissingData: `Project Name,Category,Phase,Description,Impact,Feasibility
Incomplete Project,,,,,
Another Project,Clinical,Planned,Full data,4,3`,

  withInvalidData: `Project Name,Category,Phase,Description,Impact,Feasibility
Bad Numbers Project,Clinical,Planned,Test description,10,-5
Invalid Category Project,BadCategory,Planned,Test description,4,3`,

  empty: '',

  headerOnly: 'Project Name,Category,Phase,Description,Impact,Feasibility',

  malformed: `Project Name,Category,Phase,Description,Impact,Feasibility
"Unclosed quote project,Clinical,Planned,Bad format,4,3
Normal project,Operational,Implemented,Good format,3,4`,

  withCommasAndQuotes: `Project Name,Category,Phase,Description,Impact,Feasibility
"Project with, comma",Clinical,Planned,"Description with ""quotes""",5,3
Normal Project,Operational,Implemented,Simple description,4,4`
};

/**
 * Assertion helpers for testing AI Quadrant data
 */
export const expectValidProject = (project) => {
  expect(project).toHaveProperty('name');
  expect(project).toHaveProperty('category');
  expect(project).toHaveProperty('phase');
  expect(project).toHaveProperty('description');
  expect(project).toHaveProperty('impact');
  expect(project).toHaveProperty('feasibility');
  
  expect(typeof project.name).toBe('string');
  expect(project.name.length).toBeGreaterThan(0);
  
  expect(['Clinical', 'Operational', 'Financial', 'College', 'GHP']).toContain(project.category);
  expect(['implemented', 'planned', 'unplanned']).toContain(project.phase);
  
  expect(typeof project.impact).toBe('number');
  expect(project.impact).toBeGreaterThanOrEqual(1);
  expect(project.impact).toBeLessThanOrEqual(5);
  
  expect(typeof project.feasibility).toBe('number');
  expect(project.feasibility).toBeGreaterThanOrEqual(1);
  expect(project.feasibility).toBeLessThanOrEqual(5);
  
  expect(typeof project.description).toBe('string');
};

/**
 * Performance testing helper
 */
export const measurePerformance = async (fn, iterations = 1) => {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  
  const end = performance.now();
  return {
    totalTime: end - start,
    averageTime: (end - start) / iterations,
    iterations
  };
};

/**
 * Cleanup helper for tests
 */
export const cleanupTestEnvironment = () => {
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // Reset mocks
  jest.clearAllMocks();
};