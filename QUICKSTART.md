# FinTrack AI - Quick Start Guide ⚡

Get your FinTrack AI application running in 5 minutes!

## Prerequisites Check ✅

Make sure you have:
- **Node.js** v14+ installed ([download](https://nodejs.org))
- **MongoDB** (use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free tier available)
- **npm** (comes with Node.js)

## Step 1: Extract Project (30 seconds)

```bash
unzip FinTrack-AI.zip
cd FinTrack-AI
```

## Step 2: Setup Backend (2 minutes)

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintrack-ai
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Start backend:**
```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

## Step 3: Setup Frontend (2 minutes)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## Step 4: Create Your Account (1 minute)

1. Open browser: `http://localhost:3000`
2. Click "Register here"
3. Fill in your details
4. Click "Register"
5. **You're in! 🎉**

## Start Using FinTrack AI

### Add Your First Expense
1. Go to **Expenses** 
2. Click **Add Expense**
3. Enter details and submit

### Set Monthly Budget
1. Go to **Budget**
2. Set limits for each category
3. Click **Save Budget**

### Create a Savings Goal
1. Go to **Goals**
2. Click **New Goal**
3. Enter goal details and deadline
4. **Contribute** money towards it

### View Your Analytics
1. Go to **Dashboard** - see overview cards and charts
2. Go to **Analytics** - detailed reports and breakdowns

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
lsof -i :5000
# If used, change PORT in .env to 5001
```

### Frontend won't connect to backend?
```bash
# Make sure backend is running
# Check VITE_API_URL in frontend (should be http://localhost:5000)
```

### MongoDB connection error?
```bash
# Create free account at mongodb.com/cloud/atlas
# Copy connection string and paste in .env
# Check username/password are correct
```

### npm install fails?
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📁 Important Files to Edit

1. **backend/.env** - Database and API config
2. **frontend/.env.local** - Frontend API URL (auto-created or manually add)

## 🚀 Next Steps

1. **Explore the app** - Try all features
2. **Customize** - Modify colors, add features
3. **Deploy** - Use provided Docker setup or deploy to cloud
4. **Learn** - Read the full README.md for details

## 📞 Need Help?

- Check **SETUP.md** for detailed installation
- Read **README.md** for complete documentation
- See **PROJECT_OVERVIEW.md** for all features

## 🎯 What You Get

✅ Full-stack finance app
✅ Modern UI with animations
✅ Real-time budget tracking
✅ Beautiful charts & analytics
✅ Financial health scoring
✅ Goal tracking system
✅ Complete source code
✅ Production-ready architecture

## Key Features Ready to Use

| Feature | Status | Usage |
|---------|--------|-------|
| Expense Tracking | ✅ | Add/edit/delete expenses |
| Income Management | ✅ | Track income sources |
| Budget Planning | ✅ | Set category limits |
| Financial Goals | ✅ | Create savings goals |
| Dashboard | ✅ | Overview with KPIs |
| Analytics | ✅ | Charts & reports |
| User Profiles | ✅ | Manage account settings |

## 💡 Tips

1. **Use MongoDB Atlas** - Free cloud database (no local setup needed)
2. **Keep terminals running** - One for backend, one for frontend
3. **Check browser console** - If something breaks, errors show there
4. **Read code comments** - They explain how things work

## ⏱️ Estimated Time

- **First Run**: 5-10 minutes
- **Learning Code**: 1-2 hours
- **Customization**: 2-4 hours
- **Deployment**: 30 minutes

---

**You're all set! Start tracking your finances with FinTrack AI! 💰**

Questions? Check the documentation files included in the project.
