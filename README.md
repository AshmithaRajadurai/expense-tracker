# ExpenseTracker - Personal Finance SaaS Web Application

A modern, full-stack personal finance and expense tracking web application built with the **MERN stack** (MongoDB Atlas, Express.js, React.js, Node.js). Engineered with clean architecture, JWT authentication, data isolation, interactive financial charts, and budget progress tracking.

> **Currency Support**: The entire application strictly uses **Indian Rupees (₹ / INR)** formatted according to the Indian numbering system (e.g., `₹1,500`, `₹1,00,000`).

---

## 🌟 Features

- **User Authentication & Security**:
  - Secure registration & login with email validation
  - Password hashing with bcrypt
  - JWT (JSON Web Token) authentication with bearer authorization headers
  - Strict user data isolation: users can only view, create, edit, and delete their own data
  - Update profile name and change password securely

- **Dashboard (Overview)**:
  - 4 Key metric cards: Total Income, Total Expenses, Current Balance, Current Month Expenses
  - Monthly spending and income trend area chart
  - Monthly budget utilization progress bar with early warnings (at 80%) and threshold alerts (at 100%)
  - Recent transactions list with quick action shortcuts

- **Transaction Management (CRUD)**:
  - Add Income and Expense transactions with title, amount (₹), category, date, payment method, and description
  - Filter transactions by Type (Income/Expense/All), Category, and Date Range
  - Instant search across title and description
  - Sort by Amount (Ascending/Descending) and Date (Newest/Oldest)
  - Edit existing transactions
  - Delete transactions with a confirmation dialog modal
  - Numbered pagination (no infinite scroll)

- **Monthly Budget Management**:
  - Set and modify monthly budget limits in ₹ (INR) for any month/year
  - Real-time calculations: Total Budget, Spent, Remaining Balance, and Percentage Used
  - Visual color-coded progress indicators (Green / Amber / Red)

- **Financial Analytics & Visual Reports**:
  - **Category Breakdown**: Interactive donut chart with category distribution and tooltips in ₹
  - **Income vs. Expenses**: Monthly comparative bar charts
  - **Spending Trends**: Visual trend lines over time
  - **Financial Statistics**: Highest spending bucket, average monthly expenditure, savings rate, and total transaction count

- **Polished UI/UX**:
  - Fully responsive design: Desktop sidebar, tablet collapsible menu, mobile header with drawer overlay
  - Custom vanilla CSS design system with Outfit typography, glassmorphic touches, and smooth transitions
  - Meaningful Lucide React icons
  - Dedicated empty states and skeleton/loading indicators

---

## 🏗️ Architecture & Tech Stack

```text
React Frontend (Vite)
       ↓
Axios (with JWT Interceptor)
       ↓
Express REST API (Node.js)
       ↓
Mongoose ODM
       ↓
MongoDB Atlas (Cloud Database)
```

### Frontend
- **Framework**: React 18+ (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 (Custom design system, variables, responsive grid)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (jsonwebtoken) & bcryptjs
- **CORS & Environment**: cors, dotenv

---

## 📂 Project Structure

```text
expence tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection & Google DNS fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile & password change
│   │   ├── expenseController.js  # Expense CRUD, filters, search, pagination & metrics
│   │   └── budgetController.js   # Budget CRUD, calculations & monthly utilization
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   └── errorMiddleware.js    # Centralized JSON error handling
│   ├── models/
│   │   ├── User.js               # User schema with pre-save bcrypt hash
│   │   ├── Expense.js            # Expense schema with category & payment method enums
│   │   └── Budget.js             # Budget schema indexed by user + month + year
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── expenseRoutes.js      # /api/expenses & /api/dashboard routes
│   │   └── budgetRoutes.js       # /api/budget routes
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example environment configuration
│   ├── server.js                 # Express server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts.jsx        # Recharts Donut, Bar & Area charts
│   │   │   ├── ExpenseForm.jsx   # Create/edit transaction form with validation
│   │   │   ├── ExpenseItem.jsx   # Single transaction table row with actions
│   │   │   ├── ExpenseList.jsx   # Transaction table with empty & loading states
│   │   │   ├── Modal.jsx         # Accessible confirmation modal
│   │   │   ├── Navbar.jsx        # Mobile navigation header with hamburger menu
│   │   │   ├── Sidebar.jsx       # Desktop & mobile responsive sidebar
│   │   │   └── SummaryCard.jsx   # KPI metric card with ₹ currency formatting
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth provider, login, register, logout & user state
│   │   ├── pages/
│   │   │   ├── AddTransaction.jsx# Dedicated page for creating or editing transactions
│   │   │   ├── Analytics.jsx     # Financial graphs & calculated KPI statistics
│   │   │   ├── Budget.jsx        # Monthly budget manager with warning banners
│   │   │   ├── Dashboard.jsx     # Overview with KPIs, trends, budget & recent records
│   │   │   ├── Login.jsx         # Login form with validation
│   │   │   ├── Profile.jsx       # Personal information & change password
│   │   │   ├── Register.jsx      # Sign up form with password confirmation
│   │   │   └── Transactions.jsx  # Filterable, searchable, sortable paginated list
│   │   ├── services/
│   │   │   └── api.js            # Axios client with auth interceptors & API wrappers
│   │   ├── utils/
│   │   │   └── helpers.js        # Indian numbering system (en-IN) currency & date formatters
│   │   ├── App.jsx               # Protected routes & layout wrapper
│   │   ├── index.css             # Complete design system & responsive styling
│   │   └── main.jsx              # React DOM root entry
│   └── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/expence_tracker?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key_here
NODE_ENV=development
```

A template is provided at `backend/.env.example`.

> **Important (MongoDB Atlas Network Access)**:
> In your MongoDB Atlas dashboard, navigate to **Security** → **Network Access** and ensure your current IP address (or `0.0.0.0/0` to allow access from anywhere) is added to the IP Access List.

---

## 🚀 Installation & Running

### 1. Prerequisites
- Node.js (v18 or higher)
- npm
- Active MongoDB Atlas Cluster

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server (development mode with nodemon)
npm run dev

# Or start with standard node
npm start
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will start at `http://localhost:5173` (or the port shown in your terminal).

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update user name or change password | Yes |

### Transactions (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/expenses` | Create a new transaction | Yes |
| `GET` | `/api/expenses` | Get user transactions (with search, filters, sorting, pagination) | Yes |
| `GET` | `/api/expenses/:id` | Get details of a single transaction | Yes |
| `PUT` | `/api/expenses/:id` | Update an existing transaction | Yes |
| `DELETE` | `/api/expenses/:id` | Delete a transaction | Yes |

### Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Get balance, total income/expenses, monthly spend & recent 5 items | Yes |
| `GET` | `/api/dashboard/category-summary` | Category aggregation for donut charts | Yes |
| `GET` | `/api/dashboard/monthly-summary` | Monthly aggregation of income vs expenses for bar/line charts | Yes |

### Budget (`/api/budget`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/budget?month=8&year=2026` | Get budget settings & spent progress for month/year | Yes |
| `POST` | `/api/budget` | Create or update budget for month/year | Yes |
| `PUT` | `/api/budget/:id` | Update budget amount by ID | Yes |

---

## 🗄️ Database Schemas

### User
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
}
```

### Expense
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { 
    type: String, 
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Healthcare', 'Travel', 'Salary', 'Freelance', 'Other'],
    required: true 
  },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  date: { type: Date, required: true },
  description: { type: String },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'], required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Budget
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
}
// Compound unique index: { userId: 1, month: 1, year: 1 }
```

---

## 🔒 Security Measures
- Passwords are never stored in plaintext (hashed with bcrypt 10 salt rounds).
- Passwords and password hashes are never returned in JSON API responses (`select('-password')`).
- Route authorization verified on every sensitive endpoint via Bearer JWT token.
- Strict data isolation enforces that all queries filter by `userId: req.user._id`.
- Mongoose validation ensures transaction types, categories, and positive amounts are strictly adhered to.

---

## 🔮 Future Improvements
- Recurring transactions (automatic monthly subscriptions)
- Export transactions to CSV / PDF reports
- Receipt image uploads with OCR amount scanning
- Multi-user family accounts / shared budget pools
