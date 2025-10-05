# 🧠 Interactive Quiz Application

A modern, full-stack quiz application built with Next.js, TypeScript, and SQLite. Features a beautiful user interface, real-time scoring, and a comprehensive admin panel for managing questions.

![Quiz Application](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-green?style=for-the-badge&logo=sqlite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Quiz Features
- **Interactive Quiz Interface** - Clean, modern UI with progress tracking
- **Real-time Timer** - Configurable time limits for each question
- **Instant Feedback** - Immediate scoring and results
- **Progress Bar** - Visual progress indicator
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔧 Admin Features
- **Web-based Admin Panel** - Easy-to-use interface for managing questions
- **CRUD Operations** - Create, Read, Update, Delete questions
- **Bulk Question Management** - Add multiple questions at once
- **Question Validation** - Ensures data integrity
- **Real-time Updates** - Changes reflect immediately

### 🛠️ Developer Features
- **RESTful API** - Complete API for database operations
- **Command Line Tools** - CLI scripts for database management
- **TypeScript Support** - Full type safety
- **Database Management** - SQLite with WAL mode for performance
- **Testing Suite** - Jest tests included

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quiz.git
   cd quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Quiz: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📱 Application Structure

```
quiz/
├── src/
│   ├── app/
│   │   ├── api/admin/          # Admin API endpoints
│   │   ├── admin/              # Admin panel page
│   │   ├── quiz/               # Quiz interface
│   │   └── results/            # Results page
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── lib/                    # Database and utilities
│   └── types/                  # TypeScript definitions
├── scripts/                    # CLI management scripts
└── quiz.db                     # SQLite database
```

## 🎮 Using the Quiz

### Taking a Quiz
1. Navigate to the quiz page
2. Answer questions by selecting options
3. Use the timer to manage your time
4. Submit your answers to see results
5. View detailed scoring and feedback

### Quiz Features
- **Timer**: Each question has a time limit
- **Progress**: Visual progress bar shows completion
- **Navigation**: Move between questions
- **Scoring**: Real-time score calculation

## 🔧 Admin Panel

### Accessing the Admin Panel
The admin panel is accessible at `/admin` when running the application:

**Local Development:**
```
http://localhost:3000/admin
```

**Production:**
```
https://yourdomain.com/admin
```

### Admin Features

#### 📝 Question Management
- **Add Questions**: Create new quiz questions with multiple choice answers
- **Edit Questions**: Modify existing questions and answers
- **Delete Questions**: Remove questions from the database
- **View All Questions**: See all questions with correct answers highlighted

#### 🎯 Question Structure
Each question contains:
- **Question Text**: The main question
- **Four Options**: A, B, C, D choices
- **Correct Answer**: Index (0-3) of the correct option
- **Unique ID**: Auto-generated identifier

#### 🔍 Admin Interface Features
- **Real-time Updates**: Changes reflect immediately
- **Form Validation**: Ensures data integrity
- **Confirmation Dialogs**: Prevents accidental deletions
- **Responsive Design**: Works on all devices
- **Question Count**: Shows total number of questions

### Admin Panel Screenshots

#### Main Admin Interface
- Clean, modern interface
- Add/Edit/Delete buttons for each question
- Question count display
- Form for adding new questions

#### Question Form
- Text area for question input
- Four input fields for options
- Dropdown for correct answer selection
- Save/Cancel buttons

## 🛠️ Database Management

### Command Line Tools

The application includes powerful CLI tools for database management:

```bash
# Add a new question interactively
npm run db:add

# List all questions
npm run db:list

# Update a question by ID
npm run db:update 1

# Delete a question by ID
npm run db:delete 5

# Show total question count
npm run db:count

# Clear all questions (with confirmation)
npm run db:clear

# Show help
npm run db:help
```

### API Endpoints

The application provides RESTful API endpoints:

```bash
# Get all questions
GET /api/admin/questions

# Add a new question
POST /api/admin/questions
Content-Type: application/json
{
  "text": "Your question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0
}

# Get a specific question
GET /api/admin/questions/[id]

# Update a question
PUT /api/admin/questions/[id]
Content-Type: application/json
{
  "text": "Updated question?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 1
}

# Delete a question
DELETE /api/admin/questions/[id]

# Get database statistics
GET /api/admin/stats
```

### Programmatic Database Access

```typescript
import { dbManager } from './lib/db-manager';

// Add a question
const id = dbManager.addQuestion({
  text: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  correctAnswer: 2
});

// Get all questions
const questions = dbManager.getAllQuestions();

// Update a question
dbManager.updateQuestion(1, {
  text: "Updated question?",
  options: ["A", "B", "C", "D"],
  correctAnswer: 0
});

// Delete a question
dbManager.deleteQuestion(1);
```

## 🗄️ Database Schema

### Questions Table
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer IN (0, 1, 2, 3))
);
```

### Database Features
- **SQLite**: Lightweight, serverless database
- **WAL Mode**: Better performance for concurrent access
- **Auto-increment IDs**: Unique identifiers for questions
- **Data Validation**: Constraints ensure data integrity

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Database configuration
DATABASE_URL=./quiz.db

# Application settings
NEXT_PUBLIC_APP_NAME=Quiz Application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [SQLite](https://www.sqlite.org/) - Database
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite driver

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/quiz/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ by Kshitij Pawar **

⭐ **Star this repository if you found it helpful!**
