# KERIS Full-Stack

![KERIS](https://github.com/piqim/kerisfullstack/raw/main/assets/logo.png)  
A full-stack web application for KERIS, an initiative aimed at educating students in Kelantan about higher education and scholarships.

## Preview Access :
https://kerisfullstack-app.vercel.app/
* Note: Backend server may be on stand-stil due to free instance plan. I can't afford a paid instance yet.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Route Map](#route-map)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Contributors](#contributors)
- [License](#license)

## Overview
KERIS Full-Stack is a web-based platform designed to provide students with resources, mentorship, and guidance regarding higher education opportunities. The project modernizes an older static Bootstrap-based website into a fully dynamic, scalable, and maintainable full-stack application using React.js and Node.js. It connects high school graduates in Malaysia with scholarship resources and mentors who have received scholarships to study locally and overseas.

## Features
- **Admin Panel**: Manage content, student resources, and user interactions.
- **Student Dashboard**: Access scholarship resources, mentorship programs, and educational events.
- **Modern UI/UX**: Redesigned front-end using TailwindCSS with React.js.
- **Database Integration**: A robust backend with user authentication and data persistence.

## Route Map
### Client Path
- **Home Page**
- **Scholar**
  - Scholar - Detail
- **Scholarship**
  - Scholarship - Detail

### Admin Path
- **Dashboard Page**
- **Scholar (List)**
  - Add Scholar
  - Edit Scholar
  - Delete Scholar
- **Scholarship (List)**
  - Add Scholarship
  - Edit Scholarship
  - Delete Scholarship

## Tech Stack
- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Hosting**: Vercel (Frontend), Render (Backend)

## Setup and Installation
### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/piqim/kerisfullstack.git
   cd kerisfullstack
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Start the Development Server**
   ```sh
   npm start
   ```
4. **Run the Backend**
   ```sh
   cd backend
   npm install
   node server.js
   ```

## Contributors
- **Mustaqim (Piqim) - https://github.com/piqim - Main Contributor**: Developed the backend and front-end environments for both the client and admin sides.
- **Dayana - https://github.com/dayansyahz - Contributor**: Migrated the home page from a static Bootstrap-based design to a modern Tailwind React.js framework.
- **Zai - https://github.com/zainatulzahirah - Contributor**: Migrated the home page from a static Bootstrap-based design to a modern Tailwind React.js framework.

## License
This project is licensed under the [MIT License](LICENSE).
