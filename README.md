# AI Opportunity Quadrant

A React-based interactive visualization tool for assessing and prioritizing AI initiatives using a 2x2 matrix based on Impact vs Feasibility.

## Features

- **Interactive 2x2 Matrix**: Visualize AI initiatives by Impact vs Feasibility
- **Real-time Editing**: Add, edit, and delete projects on the fly
- **Smart Label Positioning**: Automatic label placement to avoid overlaps
- **Category Color Coding**: Visual distinction between Clinical, Operational, and Financial initiatives
- **Dynamic Metrics**: Live updates of Quick Wins count and average impact score
- **Responsive Design**: Works on desktop and tablet screens
- **URL Sharing**: Generate shareable links with embedded data
- **Auto-save**: Automatic persistence to browser localStorage
- **Import/Export**: JSON file support for data backup and transfer
- **Export-Ready**: Perfect for executive presentations

## Quadrants

- **Quick Wins** (High Impact, High Feasibility): High impact, easy to implement
- **Strategic Bets** (High Impact, Low Feasibility): High impact, needs development
- **Fill-ins** (Low Impact, High Feasibility): Easy but limited impact  
- **Low Priority** (Low Impact, Low Feasibility): Consider deprioritizing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd ai-quadrant
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

Create a production build:
```bash
npm run build
```

## Dependencies

- **React**: Frontend framework
- **Recharts**: Charting library for the scatter plot
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

## Usage

### Basic Operations
1. **View Existing Initiatives**: The quadrant displays sample AI initiatives with their impact and feasibility scores
2. **Add New Projects**: Click "Add Project" to create new initiatives
3. **Edit Projects**: Click the edit icon next to any project to modify its details
4. **Delete Projects**: Click the X icon to remove projects
5. **Interactive Chart**: Hover over data points to see detailed information

### Data Management & Sharing
6. **Share Your Quadrant**: Click "Share" to generate a shareable URL containing your current initiatives
7. **Auto-save**: All changes are automatically saved to your browser's localStorage
8. **Export Data**: Download your initiatives as a JSON file for backup or sharing
9. **Import Data**: Upload a JSON file to load previously saved initiatives
10. **Reset**: Return to default sample data

### URL Sharing
- Generate a shareable URL that contains all your initiative data
- Recipients can access the same quadrant configuration by opening the shared link
- Data is compressed and embedded in the URL parameters
- No server-side storage required - everything is client-side

### Example Sharing Workflow
1. Customize your AI initiatives in the quadrant
2. Click the "Share" button in the Data Management section
3. Copy the generated URL
4. Send the URL to colleagues or stakeholders
5. Recipients open the URL to see your exact configuration
6. They can then modify and create their own versions

## Customization

### Categories
Modify the `categoryColors` object in `AIOpportunityQuadrant.jsx` to change or add new categories:

```javascript
const categoryColors = {
  Clinical: "#3B82F6",
  Operational: "#10B981", 
  Financial: "#F59E0B",
  // Add new categories here
};
```

### Initial Data
Update the `initialData` array to change the sample projects displayed on startup.

### Styling
The application uses Tailwind CSS. Modify classes in the component or update `tailwind.config.js` for theme customization.

## File Structure

```
ai-quadrant/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── AIOpportunityQuadrant.jsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.