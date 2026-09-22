# 🚗 DriverPass CY

DriverPass CY is a comprehensive, modern web application designed to help users prepare for the Cyprus driving license exam. It provides interactive quizzes, a study room for traffic signs, and a fully featured user authentication system.

## ✨ Key Features

* **🚦 Study Room:** Browse and learn Cyprus traffic signs categorized by type.
* **🏆 Interactive Quizzes:** Test your knowledge in "Master Mode" or specific categories.
* **📊 Leaderboards & Stats:** Track your progress, view your total score, and see your rank on the live leaderboard.
* **🛑 Mistake Tracking:** Review your incorrect answers at the end of each quiz to improve your score.
* **🌍 Multi-Language Support:** Fully localized in 7 languages (Greek, English, Turkish, Russian, Romanian, Bulgarian, Arabic) using `react-i18next`.
* **🌙 Dark / Light Mode:** Built-in theme toggling for better user experience.
* **🔐 Full Authentication System:** Secure User Registration, Login, and Password Reset (via email with secure tokens) using `BCrypt` hashing.

## 🛠️ Technology Stack

**Frontend:**
* React.js (Vite)
* React Router DOM
* i18next (Internationalization)
* Vanilla CSS (Fully responsive)

**Backend:**
* C# / .NET Core Web API
* Entity Framework Core (EF Core)
* SQL Server
* BCrypt.Net (Password Hashing)
* System.Net.Mail (SMTP Email Integration)

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites
* [Node.js](https://nodejs.org/) (for the frontend)
* [.NET SDK](https://dotnet.microsoft.com/) (for the backend)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)

### 1. Backend Setup (C# .NET)

1. Navigate to the backend folder of the project.
2. Open `appsettings.json` and configure your SQL Server connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DriverPassDb;Trusted_Connection=True;"
   }
   ```
3. Open `UsersController.cs` and configure your SMTP Gmail settings for the Password Reset feature:
   ```csharp
   Credentials = new System.Net.NetworkCredential("YOUR_EMAIL@gmail.com", "YOUR_16_DIGIT_APP_PASSWORD"),
   ```
4. Run Entity Framework migrations to create the database:
   ```bash
   dotnet ef database update
   ```
5. Start the backend server (runs on `http://localhost:5220` by default):
   ```bash
   dotnet run
   ```

### 2. Frontend Setup (React)

1. Navigate to the frontend folder (`src`).
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:5173` by default):
   ```bash
   npm run dev
   ```

---

## 🔒 Security Measures
* Passwords are never stored in plain text; they are hashed using **BCrypt**.
* Password Reset uses securely generated, URL-safe base64 tokens.
* Reset tokens have a strict 1-hour expiration limit.

## 📄 License
This project was created for educational purposes and as a portfolio piece for DriverPass CY.