# AI Opportunity Quadrant

A React-based interactive visualization tool for assessing and prioritizing AI initiatives using a 2x2 matrix based on Impact vs Feasibility.

## Features

- **Interactive 2x2 Matrix**: Visualize AI initiatives by Impact vs Feasibility
- **Real-time Editing**: Add, edit, and delete projects on the fly
- **Smart Label Positioning**: Automatic label placement to avoid overlaps
- **Phase-Based Color Coding**: Visual distinction by implementation phase (Implemented, Planned, Unplanned)
- **Multiple Business Categories**: Support for Clinical, Operational, Financial, College, and GHP initiatives
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

## 🚀 Easy Deployment

Deploy to permanent cloud hosting in minutes:

### Option 1: GitHub Pages (Automatic) ⭐ **RECOMMENDED**
1. Enable Pages in your repo settings
2. Select "GitHub Actions" as source
3. Push to main branch → Automatically deployed!

### Option 2: Vercel (One-Click)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Click Deploy → Done!

### Option 3: Netlify (Drag & Drop)
1. Run `npm run build`
2. Drag the `build` folder to [netlify.com/drop](https://netlify.com/drop)
3. Instant deployment!

📖 **See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions**

## Dependencies

- **React**: Frontend framework
- **Recharts**: Charting library for the scatter plot
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

## Usage

### Basic Operations
1. **View Existing Initiatives**: The quadrant displays AI initiatives with their impact, feasibility scores, and implementation phase
2. **Add New Projects**: Click "Add Project" to create new initiatives with category and phase selection
3. **Edit Projects**: Click the edit icon next to any project to modify its details including phase status
4. **Delete Projects**: Click the X icon to remove projects
5. **Interactive Chart**: Hover over data points to see detailed information
6. **Phase Tracking**: Color-coded dots indicate implementation status (Black=Implemented, Blue=Planned, Grey=Unplanned)

### Data Management & Sharing
6. **Share Your Quadrant**: Click "Share" to generate a shareable URL containing your current initiatives
7. **Auto-save**: All changes are automatically saved to your browser's localStorage
8. **Export Data**: Download your initiatives as a JSON file for backup or sharing
9. **Import Data**: Upload a JSON file to load previously saved initiatives
10. **Import CSV**: Upload a CSV file with the proper format (see CSV Format section below)
11. **Reset**: Return to default sample data

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

## CSV Format

When importing data via CSV, use the following column structure:

### Required Headers
The CSV parser looks for these column names (case-insensitive):
- **Project Name/Initiative Name**: The name of the AI initiative
- **Category**: Business category (Clinical, Operational, Financial, College, GHP)
- **Phase/Status**: Implementation phase (Implemented, Planned, Unplanned)
- **Description**: Brief description of the initiative
- **Impact**: Impact score from 1-5
- **Feasibility**: Feasibility score from 1-5

### Example CSV Format
```csv
Project Name,Category,Phase,Description,Impact,Feasibility
AI-Powered Diagnosis Assistant,Clinical,Planned,Machine learning tool to assist radiologists,5,3
Automated Patient Scheduling,Operational,Implemented,Smart scheduling system to reduce wait times,4,5
Predictive Analytics Dashboard,Financial,Unplanned,Revenue forecasting using historical data,4,2
Virtual Health Assistant,Clinical,Planned,Chatbot for patient triage and basic health questions,3,4
Supply Chain Optimization,Operational,Implemented,AI-driven inventory management system,4,4
```

### Notes
- Headers are flexible - the parser looks for keywords (e.g., "Project", "Name", "Initiative" for the name column)
- Category defaults to "Operational" if not found or invalid
- Phase defaults to "Unplanned" if not found or invalid
- Impact and Feasibility scores are clamped to 1-5 range
- Empty rows are automatically skipped
- The parser handles quoted values and commas within quotes

## Customization

### Phase Colors
The application uses phase-based colors to indicate implementation status:
- **Implemented** (Black): Projects that are already in production
- **Planned** (Blue): Projects that are scheduled for implementation
- **Unplanned** (Grey): Projects that are ideas or under consideration

### Business Categories
The application supports the following business categories:
- **Clinical**: Healthcare and patient care initiatives
- **Operational**: Process and efficiency improvements
- **Financial**: Revenue and cost management projects
- **College**: Academic and educational initiatives
- **GHP**: Geisinger Health Plan specific projects

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