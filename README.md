# FinTrack AI - Personal Finance Management Dashboard

A modern, full-stack personal finance management application built with React, Node.js, Express, MongoDB, and Recharts.

## 🌟 Features

### Core Features
- **Authentication** - JWT-based login/register with secure password hashing
- **Expense Tracking** - Add, edit, delete expenses with categories and tags
- **Income Management** - Track multiple income sources
- **Budget Planning** - Set monthly budgets per category with real-time tracking
- **Financial Goals** - Create and monitor progress towards financial goals
- **Dashboard Analytics** - Beautiful charts and visualizations
- **Financial Health Score** - Comprehensive financial wellness metrics

### Advanced Features
- **Monthly Trends** - Visualize income vs expenses over time
- **Category Analytics** - Pie charts and bar charts of spending patterns
- **Budget Alerts** - Warnings when budget is exceeded
- **Goal Tracking** - Monitor progress with deadline reminders
- **Dark Mode UI** - Modern glassmorphism design
- **Responsive Design** - Works on all devices
- **Recurring Transactions** - Auto-add recurring expenses/income
- **Multi-currency Support** - Support for multiple currencies

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```
MONGODB_URI=mongodb://localhost:27017/fintrack-ai
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

5. **Start MongoDB**
```bash
# If using MongoDB locally
mongod
```

6. **Run the backend server**
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
echo 'VITE_API_URL=http://localhost:5000/api' > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
FinTrack-AI/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Budget.js
│   │   └── Goal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── income.js
│   │   ├── budget.js
│   │   ├── goals.js
│   │   ├── analytics.js
│   │   ├── reports.js
│   │   ├── recurring.js
│   │   ├── notifications.js
│   │   └── user.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Income.jsx
    │   │   ├── Budget.jsx
    │   │   ├── Goals.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── authStore.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🎯 Key Pages

### Dashboard
- Overview cards showing income, expenses, savings, and savings rate
- 12-month trend chart (income vs expenses)
- Expense breakdown pie chart
- Financial health score with circular progress

### Expenses
- Add, edit, and delete expenses
- Filter by category and date
- Category-wise breakdown
- Payment method tracking

### Income
- Track multiple income sources
- Salary, freelancing, business, investments, other
- Monthly income trends
- Income source breakdown

### Budget
- Set monthly budget per category
- Real-time spending tracking
- Budget exceeded warnings
- Category-wise progress bars

### Goals
- Create financial goals with targets
- Track savings progress
- Deadline reminders
- Contribution management

### Analytics
- Comprehensive financial reports
- Multiple chart types (line, bar, pie)
- Spending patterns analysis
- Financial health metrics

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Protected routes
- Secure token storage
- Input validation
- Error handling

## 💾 Database Schema

### User
- name, email, password
- avatar, currency, theme
- createdAt, updatedAt

### Expense
- userId, title, amount
- category, description, date
- paymentMethod, tags, receipt
- isRecurring, recurringFrequency

### Income
- userId, title, amount
- source, description, date
- tags, currency
- isRecurring, recurringFrequency

### Budget
- userId, month
- categoryLimits (array of {category, limit, spent, percentage})
- totalBudget, totalSpent, notes

### Goal
- userId, name, description
- targetAmount, currentSavings
- deadline, category, priority
- status (Active/Completed/Abandoned)

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/monthly/:month` - Get monthly expenses

### Income
- `GET /api/income` - Get all income
- `POST /api/income` - Create income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income
- `GET /api/income/monthly/:month` - Get monthly income

### Budget
- `GET /api/budget` - Get all budgets
- `POST /api/budget` - Create/update budget
- `GET /api/budget/:month` - Get monthly budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/contribute` - Add savings to goal

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/trends` - Monthly trends
- `GET /api/analytics/categories` - Category breakdown
- `GET /api/analytics/health-score` - Financial health score

## 🎨 Design Features

- **Glassmorphism Cards** - Modern frosted glass effect
- **Smooth Animations** - Framer Motion transitions
- **Gradient Text** - Eye-catching typography
- **Dark Mode** - Default dark theme
- **Responsive Layout** - Mobile-friendly design
- **Sidebar Navigation** - Easy access to all features

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment (Heroku/Railway)
```bash
npm start
```

## 📈 Future Enhancements

- AI spending insights with Gemini API
- Voice expense entry
- Receipt OCR scanning
- Bill upload and tracking
- Expense receipt storage
- Multi-currency conversion
- Budget recommendations
- Spending insights with trends
- Export to PDF/Excel reports
- Mobile app (React Native)
- Email notifications
- Dark/Light theme toggle
- Data backup and export

## 🐛 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check `.env` configuration
- Verify port 5000 is available

### Frontend Issues
- Clear node_modules and reinstall
- Check API URL in `.env.local`
- Clear browser cache

### Connection Issues
- Verify CORS settings in backend
- Check firewall settings
- Ensure backend server is running

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@fintrackapp.com or open an issue in the repository.

## 🙏 Acknowledgments

- Recharts for amazing charts
- React Query for data management
- Framer Motion for animations
- Tailwind CSS for styling
- Stripe and Notion for UI inspiration

---

**Made with ❤️ by FinTrack Team**
