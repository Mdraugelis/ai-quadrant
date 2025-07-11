import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Plus, X, Edit2, Save, XCircle, Share2, Download, Upload, Copy } from 'lucide-react';

const AIOpportunityQuadrant = () => {
  const initialData = [
    { id: 1, name: "Clinical Decision Support", feasibility: 4.2, impact: 4.8, category: "Clinical", description: "AI-powered diagnostic assistance" },
    { id: 2, name: "Patient Flow Optimization", feasibility: 3.8, impact: 4.3, category: "Operational", description: "Reduce wait times and improve capacity" },
    { id: 3, name: "Predictive Maintenance", feasibility: 4.5, impact: 3.2, category: "Operational", description: "Equipment failure prediction" },
    { id: 4, name: "Virtual Health Assistant", feasibility: 2.4, impact: 4.5, category: "Clinical", description: "24/7 patient support chatbot" },
    { id: 5, name: "Revenue Cycle AI", feasibility: 4.6, impact: 4.1, category: "Financial", description: "Automated billing optimization" },
    { id: 6, name: "Staff Scheduling AI", feasibility: 3.5, impact: 3.7, category: "Operational", description: "Intelligent workforce management" },
    { id: 7, name: "Drug Interaction Checker", feasibility: 4.7, impact: 4.6, category: "Clinical", description: "Real-time medication safety" },
    { id: 8, name: "Radiology AI Assistant", feasibility: 2.2, impact: 4.7, category: "Clinical", description: "Advanced imaging analysis" },
    { id: 9, name: "Supply Chain Optimizer", feasibility: 3.9, impact: 2.8, category: "Operational", description: "Inventory management AI" },
    { id: 10, name: "Patient Risk Stratification", feasibility: 3.4, impact: 4.4, category: "Clinical", description: "Proactive care management" },
    { id: 11, name: "Documentation Assistant", feasibility: 4.3, impact: 3.4, category: "Clinical", description: "Automated clinical notes" },
    { id: 12, name: "Fraud Detection System", feasibility: 4.1, impact: 2.3, category: "Financial", description: "AI-powered fraud prevention" },
  ];

  // Utility functions for data handling
  const compressData = (data) => {
    return btoa(JSON.stringify(data));
  };

  const decompressData = (compressed) => {
    try {
      return JSON.parse(atob(compressed));
    } catch (error) {
      console.error('Failed to decompress data:', error);
      return null;
    }
  };

  const loadDataFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
      const decompressed = decompressData(sharedData);
      if (decompressed && Array.isArray(decompressed)) {
        return decompressed;
      }
    }
    return null;
  };

  const loadDataFromStorage = () => {
    try {
      const saved = localStorage.getItem('ai-quadrant-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
    return null;
  };

  const getInitialData = () => {
    // Priority: URL data > localStorage > default data
    return loadDataFromURL() || loadDataFromStorage() || initialData;
  };

  const [data, setData] = useState(getInitialData());
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    feasibility: 3,
    impact: 3,
    category: 'Clinical',
    description: ''
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('ai-quadrant-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [data]);

  const categoryColors = {
    Clinical: "#3B82F6",
    Operational: "#10B981",
    Financial: "#F59E0B"
  };

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      const newId = Math.max(...data.map(d => d.id)) + 1;
      setData([...data, { ...newProject, id: newId }]);
      setNewProject({
        name: '',
        feasibility: 3,
        impact: 3,
        category: 'Clinical',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteProject = (id) => {
    setData(data.filter(d => d.id !== id));
  };

  const handleEditProject = (project) => {
    setEditingId(project.id);
    setEditingProject({ ...project });
  };

  const handleSaveEdit = () => {
    setData(data.map(d => d.id === editingId ? editingProject : d));
    setEditingId(null);
    setEditingProject(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingProject(null);
  };

  const handleShareData = () => {
    const compressed = compressData(data);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?data=${encodeURIComponent(compressed)}`;
    setShareUrl(shareableUrl);
    setShowShareModal(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Could add a toast notification here
      alert('Share URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy URL to clipboard');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-quadrant-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            setData(importedData);
            alert('Data imported successfully!');
          } else {
            alert('Invalid file format. Please select a valid JSON file.');
          }
        } catch (error) {
          console.error('Failed to import data:', error);
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default data? This will overwrite your current initiatives.')) {
      setData(initialData);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-800 mb-2">{data.name}</p>
          <p className="text-sm text-gray-600 mb-2">{data.description}</p>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-500">Impact:</span>
              <span className="font-semibold ml-1">{data.impact.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-gray-500">Feasibility:</span>
              <span className="font-semibold ml-1">{data.feasibility.toFixed(1)}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: categoryColors[data.category] }}>
              {data.category}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const isHovered = hoveredPoint === payload.name;
    const isEditing = editingId === payload.id;
    
    let textX = cx;
    let textY = cy;
    let textAnchor = 'middle';
    
    if (payload.feasibility > 3 && payload.impact > 3) {
      textX = cx + 12;
      textY = cy - 3;
      textAnchor = 'start';
    } else if (payload.feasibility <= 3 && payload.impact > 3) {
      textX = cx - 12;
      textY = cy - 3;
      textAnchor = 'end';
    } else if (payload.feasibility > 3 && payload.impact <= 3) {
      textX = cx;
      textY = cy + 15;
      textAnchor = 'middle';
    } else {
      textX = cx;
      textY = cy - 10;
      textAnchor = 'middle';
    }
    
    return (
      <g>
        <rect
          x={textAnchor === 'end' ? textX - payload.name.length * 6 - 4 : 
             textAnchor === 'start' ? textX - 2 : 
             textX - payload.name.length * 3 - 2}
          y={textY - 10}
          width={payload.name.length * 6 + 4}
          height={14}
          fill="white"
          fillOpacity="0.9"
          rx="2"
          style={{ pointerEvents: 'none' }}
        />
        
        <text 
          x={textX} 
          y={textY} 
          textAnchor={textAnchor} 
          fill={isEditing ? "#059669" : "#374151"} 
          fontSize={isHovered || isEditing ? "12" : "11"} 
          fontWeight={isHovered || isEditing ? "600" : "500"}
          style={{
            pointerEvents: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {payload.name}
        </text>
        
        <circle
          cx={cx}
          cy={cy}
          r={isHovered || isEditing ? 9 : 7}
          fill={categoryColors[payload.category]}
          fillOpacity={1}
          stroke={isEditing ? "#059669" : "#fff"}
          strokeWidth={isEditing ? 3 : 2}
          style={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))'
          }}
          onMouseEnter={() => setHoveredPoint(payload.name)}
          onMouseLeave={() => setHoveredPoint(null)}
        />
      </g>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Opportunity Assessment</h1>
          <p className="text-lg text-gray-600">Strategic Prioritization Matrix for AI Initiatives</p>
        </div>

        {/* Data Management Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Data Management</h2>
            <div className="flex gap-2">
              <button
                onClick={handleShareData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 size={20} />
                Share
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <label className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                <Upload size={18} />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Share:</strong> Generate a URL to share your current initiatives with others</p>
            <p><strong>Export/Import:</strong> Save or load initiative data as JSON files</p>
            <p><strong>Auto-save:</strong> Your changes are automatically saved to browser storage</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Add New AI Initiative</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              {showAddForm ? 'Cancel' : 'Add Project'}
            </button>
          </div>
          
          {showAddForm && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Clinical">Clinical</option>
                    <option value="Operational">Operational</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact: <span className="font-bold text-blue-600">{newProject.impact.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newProject.impact}
                    onChange={(e) => setNewProject({...newProject, impact: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feasibility: <span className="font-bold text-green-600">{newProject.feasibility.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newProject.feasibility}
                    onChange={(e) => setNewProject({...newProject, feasibility: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Difficult</span>
                    <span>Easy</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleAddProject}
                disabled={!newProject.name.trim()}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to Quadrant
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8" style={{ minHeight: '700px' }}>
          <div className="flex justify-center mb-2">
            <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
              <div className="text-center">
                <h3 className="text-lg font-bold text-amber-600">Strategic Bets</h3>
                <p className="text-xs text-gray-500">High Impact, Low Feasibility</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-600">Quick Wins</h3>
                <p className="text-xs text-gray-500">High Impact, High Feasibility</p>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={600}>
            <ScatterChart margin={{ top: 10, right: 100, bottom: 70, left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              
              <ReferenceArea x1={0} y1={3} x2={3} y2={5} fill="#FEF3C7" fillOpacity={0.15} />
              <ReferenceArea x1={3} y1={3} x2={5} y2={5} fill="#D1FAE5" fillOpacity={0.15} />
              <ReferenceArea x1={0} y1={0} x2={3} y2={3} fill="#FEE2E2" fillOpacity={0.15} />
              <ReferenceArea x1={3} y1={0} x2={5} y2={3} fill="#E0E7FF" fillOpacity={0.15} />
              
              <ReferenceLine x={3} stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" />
              <ReferenceLine y={3} stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" />
              
              <XAxis
                dataKey="feasibility"
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                label={{ value: 'Feasibility →', position: 'insideBottom', offset: -10, style: { fontSize: 16, fill: '#4B5563' } }}
              />
              <YAxis
                dataKey="impact"
                type="number"
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                label={{ value: 'Impact →', angle: -90, position: 'insideLeft', style: { fontSize: 16, fill: '#4B5563' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Scatter
                data={data}
                shape={<CustomDot />}
              />
            </ScatterChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center mt-2">
            <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
              <div className="text-center">
                <h3 className="text-base font-bold text-red-600 opacity-70">Low Priority</h3>
                <p className="text-xs text-gray-500">Low Impact, Low Feasibility</p>
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-indigo-600 opacity-70">Fill-ins</h3>
                <p className="text-xs text-gray-500">Low Impact, High Feasibility</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Current Initiatives</h3>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {data.map((project) => (
                <div key={project.id}>
                  {editingId === project.id ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editingProject.name}
                          onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Project name"
                        />
                        <select
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Clinical">Clinical</option>
                          <option value="Operational">Operational</option>
                          <option value="Financial">Financial</option>
                        </select>
                      </div>
                      
                      <input
                        type="text"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Description"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact: <span className="font-bold text-blue-600">{editingProject.impact.toFixed(1)}</span>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.1"
                            value={editingProject.impact}
                            onChange={(e) => setEditingProject({...editingProject, impact: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feasibility: <span className="font-bold text-green-600">{editingProject.feasibility.toFixed(1)}</span>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.1"
                            value={editingProject.feasibility}
                            onChange={(e) => setEditingProject({...editingProject, feasibility: parseFloat(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[project.category] }}></div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-700">{project.name}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            (Impact: {project.impact.toFixed(1)}, Feasibility: {project.feasibility.toFixed(1)})
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-3">
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></div>
                  <span className="text-gray-700">{category}</span>
                  <span className="ml-auto text-gray-500 text-sm">
                    {data.filter(d => d.category === category).length} initiatives
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quadrant Guide</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-4 h-4 rounded mr-3 mt-1" style={{ backgroundColor: '#FEF3C7' }}></div>
                <div>
                  <p className="font-semibold text-gray-700">Strategic Bets</p>
                  <p className="text-sm text-gray-500">High impact, needs development</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-4 h-4 rounded mr-3 mt-1" style={{ backgroundColor: '#D1FAE5' }}></div>
                <div>
                  <p className="font-semibold text-gray-700">Quick Wins</p>
                  <p className="text-sm text-gray-500">High impact, easy to implement</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-4 h-4 rounded mr-3 mt-1" style={{ backgroundColor: '#FEE2E2' }}></div>
                <div>
                  <p className="font-semibold text-gray-700">Low Priority</p>
                  <p className="text-sm text-gray-500">Consider deprioritizing</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-4 h-4 rounded mr-3 mt-1" style={{ backgroundColor: '#E0E7FF' }}></div>
                <div>
                  <p className="font-semibold text-gray-700">Fill-ins</p>
                  <p className="text-sm text-gray-500">Easy but limited impact</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Total Initiatives</p>
                <p className="text-2xl font-bold text-gray-800">{data.length}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Quick Wins</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.filter(d => d.feasibility > 3 && d.impact > 3).length}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg. Impact Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.length > 0 ? (data.reduce((sum, d) => sum + d.impact, 0) / data.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Share Your AI Quadrant</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable URL (Copy and send to others):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-2"><strong>How it works:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This URL contains all your current AI initiatives in a compressed format</li>
                  <li>Anyone with access to your server can open this link to view your quadrant</li>
                  <li>The URL will automatically load your exact configuration</li>
                  <li>Recipients can then modify and create their own versions</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOpportunityQuadrant;