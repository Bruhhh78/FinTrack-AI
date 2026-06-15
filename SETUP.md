# FinTrack AI - Setup Guide

## System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.4 or higher (local or MongoDB Atlas)
- **Git**: For version control

## Installation Steps

### 1. Clone or Extract Project

```bash
# If from git
git clone <repository-url>
cd FinTrack-AI

# Or if from zip
unzip FinTrack-AI.zip
cd FinTrack-AI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure MongoDB:**

Option A - Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/fintrack-ai
```

Option B - MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintrack-ai
```

**Complete .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/fintrack-ai
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=optional-for-ai-features
```

**Start Backend Server:**
```bash
# Development with auto-reload
npm run dev

# Or production
npm start
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo 'VITE_API_URL=http://localhost:5000/api' > .env.local
```

**Start Frontend Server:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Database Setup

If using local MongoDB:

```bash
# Start MongoDB (Mac/Linux)
mongod

# Or on Windows
# Open Services and start MongoDB service
```

If using MongoDB Atlas, the connection string will handle everything automatically.

## Verification

1. Open browser and go to: `http://localhost:3000`
2. You should see the FinTrack AI login page
3. Click "Register here" to create an account
4. Fill in your details and sign up
5. You're ready to use the app!

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB is installed correctly

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in .env file
- Or kill the process using that port:
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running
- Check VITE_API_URL in frontend .env.local
- Verify API endpoints match

### npm Install Fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Using Docker

If you have Docker installed:

```bash
# Build and start all services
docker-compose up -d

# MongoDB will be on localhost:27017
# Backend on localhost:5000
# Frontend on localhost:3000

# Stop services
docker-compose down
```

## Using the Application

### Create Your First Expense
1. Click on "Expenses" in sidebar
2. Click "Add Expense" button
3. Fill in details:
   - Title: "Groceries"
   - Amount: "500"
   - Category: "Food"
   - Date: Today
4. Click "Add Expense"

### Set Your Budget
1. Go to "Budget" section
2. Set limits for each category
3. Click "Save Budget"
4. Monitor spending in real-time

### Track Financial Goals
1. Go to "Goals" section
2. Click "New Goal"
3. Enter:
   - Goal name
   - Target amount
   - Deadline
4. Add contributions to reach your goal

### View Analytics
1. Go to "Analytics" section
2. See charts of:
   - Income vs expenses
   - Category breakdown
   - Monthly trends
   - Financial health score

## File Structure Overview

```
FinTrack-AI/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth and validation
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── store/       # State management
│   │   └── App.jsx      # Main app component
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml   # Docker configuration
└── README.md           # Full documentation
```

## Available Scripts

### Backend
```bash
npm install    # Install dependencies
npm run dev    # Run with hot reload
npm start      # Run production
npm test       # Run tests (if configured)
```

### Frontend
```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Output in 'dist' folder - upload to Vercel, Netlify, or any static host
```

### Deploy Backend
Can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS
- Google Cloud

Set production environment variables and ensure MongoDB Atlas is used (not local).

## Features Included

✅ User Authentication (Register/Login)
✅ Expense Tracking
✅ Income Management
✅ Budget Planning
✅ Financial Goals
✅ Dashboard Analytics
✅ Charts & Visualizations
✅ Dark Mode UI
✅ Responsive Design
✅ Financial Health Score

## Future Enhancements

- AI Spending Insights
- Voice Expense Entry
- Receipt OCR
- PDF/Excel Export
- Mobile App
- Email Notifications
- Multi-currency Support

## Support

For issues or questions:
1. Check the README.md
2. Review the code comments
3. Check browser console for errors
4. Verify .env files are configured correctly

## License

MIT License - Feel free to use this project for personal or commercial use.

---

**Happy tracking! 💰**
