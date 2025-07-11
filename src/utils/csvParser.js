// CSV Parser utility functions extracted for testing
export const parseCSVLine = (line) => {
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

export const parseCSVData = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file appears to be empty or has no data rows.');
  }
  
  // Parse header to find column indices
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
    
    // Skip empty rows
    if (values.every(v => !v.trim())) continue;
    
    // Extract and validate values with defaults
    const name = values[nameIndex]?.trim() || `Initiative ${i}`;
    
    // Skip if no name can be determined (only when nameIndex is missing)
    if (nameIndex === -1 && !values[0]?.trim()) {
      skippedRows++;
      continue;
    }
    
    // Category validation with default
    let category = values[categoryIndex]?.trim() || 'Operational';
    const validCategories = ['Clinical', 'Operational', 'Financial', 'College', 'GHP'];
    if (!validCategories.includes(category)) {
      // Try to match partial category names
      const matched = validCategories.find(c => 
        c.toLowerCase().includes(category.toLowerCase()) || 
        category.toLowerCase().includes(c.toLowerCase())
      );
      category = matched || 'Operational';
    }
    
    // Phase validation with default
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
    
    // Find matching phase or default to unplanned
    if (phase === '') {
      phase = 'unplanned';
    } else {
      const matchedKey = Object.keys(phaseMap).find(key => 
        phase.includes(key) || key.includes(phase)
      );
      phase = matchedKey ? phaseMap[matchedKey] : 'unplanned';
    }
    
    // Numeric validation with defaults and clamping
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
    totalRows: lines.length - 1 // Exclude header
  };
};

export const generateNewId = (existingData) => {
  if (!existingData || existingData.length === 0) return 1;
  return Math.max(...existingData.map(d => d.id || 0)) + 1;
};

export const validateProject = (project) => {
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