# Daily Question Counter 📚✨

> A modern web application to track your daily learning progress and question-solving journey with AI assistance.

<div align="center">

### 🌟 [Try the Live Demo](https://flourishing-unicorn-e85504.netlify.app/) 🌟
Experience the application in action and start tracking your progress today!

</div>

![GitHub](https://img.shields.io/github/license/nikshitsaini/Daily-Question-Counter)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Netlify](https://img.shields.io/netlify/flourishing-unicorn-e85504)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🌟 Features

- **📅 Interactive Calendar View**
  - Visual representation of daily progress
  - Color-coded days based on questions solved
  - Easy navigation between months

- **📊 Advanced Statistics**
  - Weekly & monthly averages
  - Streak tracking
  - High productivity days
  - Total questions solved

- **📝 Notes Management**
  - Add daily study notes
  - Navigate between dates
  - Export/Import functionality

- **🤖 AI Study Assistant**
  - Powered by Google's Gemini AI
  - Context-aware responses
  - Code formatting support
  - Expandable chat interface

- **🎨 Theme Support**
  - Light/Dark mode toggle
  - Modern UI design
  - Responsive layout

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm/yarn
- Netlify CLI (for local development)
- Google Cloud Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nikshitsaini/Daily-Question-Counter.git
cd Daily-Question-Counter
```

2. Install dependencies:
```bash
cd netlify/functions
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
netlify dev
```

## 🛠️ Technologies Used

- HTML5/CSS3
- JavaScript (ES6+)
- Google Gemini AI API
- Netlify Functions
- Local Storage API

## 📱 Usage

1. **Calendar Interaction**
   - Click on a day to increment question count
   - Right-click to decrement count
   - Navigate months using arrows

2. **Notes Management**
   - Select a date to add/edit notes
   - Use navigation buttons for date switching
   - Save notes for future reference

3. **AI Assistant**
   - Ask questions about your progress
   - Get study recommendations
   - Request code examples
   - Resize chat window as needed

4. **Data Management**
   - Export data for backup
   - Import previous backups
   - All data stored locally

## 🔧 Configuration

### Netlify Configuration
```toml
[build]
  functions = "netlify/functions"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key

## 📦 Project Structure
Daily-Question-Counter/ ├── index.html # Main application file ├── style.css # Styles and themes ├── script.js # Calendar and stats logic ├── chatbot.js # AI assistant implementation ├── netlify.toml # Netlify configuration ├── netlify/ │ └── functions/ # Serverless functions │ ├── chat.js # AI chat handler │ ├── listModels.js # AI models handler │ └── package.json # Function dependencies └── readme.md # Documentation


## 💡 Implementation Details

### Calendar Features
- Dynamic calendar generation with month navigation
- Color-coded question count indicators
- Interactive day selection
- Real-time statistics updates

### Statistics Tracking
- Daily question counts
- Weekly and monthly averages
- Streak tracking (current and best)
- High productivity day tracking
- Total questions solved

### Notes System
- Date-specific notes storage
- Easy navigation between dates
- Persistent storage using localStorage
- Export/Import functionality

### AI Assistant Integration
- Google Gemini AI integration
- Context-aware responses
- Code block formatting
- Resizable chat interface
- Markdown support

## 🔒 Security

- All data stored locally in browser
- No personal data transmitted
- Secure API key handling
- CORS protection enabled

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📱 Mobile Support

The application is fully responsive and supports:
- iOS Safari
- Android Chrome
- Mobile Firefox
- Other modern mobile browsers

## 🐛 Known Issues

1. Local storage limitations may affect data storage capacity
2. Calendar navigation on mobile devices might require optimization
3. AI response times may vary based on network conditions

## 🚀 Future Enhancements

1. **Data Management**
   - Cloud synchronization
   - Multiple device support
   - Data analytics dashboard

2. **AI Features**
   - Study pattern analysis
   - Performance predictions
   - Personalized recommendations

3. **UI/UX**
   - More theme options
   - Customizable statistics
   - Advanced visualization options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
3. Commit Changes
   ```bash
   git commit -m 'Add AmazingFeature'
4. Push to branch
   ```bash
   git push origin feature/AmazingFeature
5. Open a Pull Request   

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
Google Gemini AI
Netlify
Node.js
All our contributors

<p align="center">Made with ❤️ by Nikshit Saini</p> <p align="center"> <a href="https://github.com/nikshitsaini">GitHub</a> • <a href="https://linkedin.com/in/nikshit12saini">LinkedIn</a> </p>