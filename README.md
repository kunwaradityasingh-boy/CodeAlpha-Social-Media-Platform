# CodeAlpha Social Media Platform

A full-stack Social Media Platform developed as part of the **CodeAlpha Internship Program**.

The application allows users to register, log in securely, manage their profiles, create posts, comment on posts, and manage followers and following.

## 🚀 Features

- User Registration
- User Login
- Secure Password Hashing
- JWT Authentication
- Protected API Routes
- User Profile
- Create and View Posts
- Comments on Posts
- Followers and Following System
- Profile Statistics
- RESTful APIs
- MongoDB Database Integration
- Frontend and Backend Architecture

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt.js

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Live Server

## 📁 Project Structure

    CodeAlpha-Social-Media-Platform/
    │
    ├── frontend/
    │   ├── index.html
    │   ├── script.js
    │   ├── style.css
    │   └── ...
    │
    ├── server/
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Post.js
    │   │   ├── Comment.js
    │   │   └── Follower.js
    │   │
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── post.js
    │   │   └── user.js
    │   │
    │   ├── server.js
    │   ├── package.json
    │   └── ...
    │
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── README.md

## ⚙️ Installation & Setup

### 1. Clone the Repository

    git clone https://github.com/kunwaradityasingh-boy/CodeAlpha-Social-Media-Platform.git

### 2. Open the Project

    cd CodeAlpha-Social-Media-Platform

### 3. Install Dependencies

    npm install

Then:

    cd server
    npm install

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder.

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000

Replace the values with your own MongoDB connection string and JWT secret.

**Important:** Never upload the `.env` file or secret credentials to GitHub.

## ▶️ Run the Backend

From the `server` directory:

    node server.js

The backend server will run on:

    http://localhost:5000

You should see:

    MongoDB connected successfully
    Server running on port 5000

## 🌐 Run the Frontend

Open the `frontend` folder and run `index.html`.

You can use **Live Server** in Visual Studio Code to launch the frontend.

The frontend communicates with the backend through REST APIs.

## 🔑 Authentication

The application uses JWT-based authentication.

### Registration

    POST /api/auth/register

### Login

    POST /api/auth/login

### Get Current User

    GET /api/auth/me

Protected requests use:

    Authorization: Bearer <token>

Passwords are securely hashed using **bcrypt.js** before being stored in the database.

## 👤 User Profile

The application provides user profile functionality including:

- User name
- Email
- Post count
- Follower count
- Following count

Profile information can be retrieved using:

    GET /api/users/:id/profile

## 📝 Posts

Users can create and interact with posts.

Post functionality includes:

- Creating posts
- Viewing posts
- Post content
- Author information
- Comments

## 💬 Comments

Users can add comments to posts and retrieve comments associated with a post.

## 👥 Followers & Following

The platform includes a follower/following system.

Users can:

- Follow other users
- Unfollow users
- View follower information
- View following information

## 🗄️ Database

The project uses **MongoDB** as the database and **Mongoose** for database interaction.

Main data models include:

- User
- Post
- Comment
- Follower

## 🎯 Project Objective

The main objective of this project is to develop a functional full-stack social media platform and gain practical experience in:

- Frontend Development
- Backend Development
- REST API Development
- MongoDB Database Management
- Authentication & Authorization
- Password Security
- Git & GitHub
- Full-Stack Web Development

## 🔮 Future Improvements

- ❤️ Like and Unlike Posts
- 🖼️ Profile Picture Upload
- 📷 Image and Video Posts
- 🔎 User Search
- 🔔 Notifications
- 💬 Direct Messaging
- 📱 Improved Mobile Responsiveness
- 🎨 Advanced UI/UX
- ☁️ Cloud Deployment

## 📸 Project Preview

Screenshots and demonstration videos can be added here as the project continues to develop.

## 👨‍💻 Author

**Kunwar Aditya Singh**

Developed as part of the **CodeAlpha Internship Program**.

## 🔗 Repository

https://github.com/kunwaradityasingh-boy/CodeAlpha-Social-Media-Platform

## 📄 License

This project was developed for educational and internship purposes.
