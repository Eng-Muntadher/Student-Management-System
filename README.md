# Student Management System

A **Student Management System** built to efficiently manage students' grades, classes, subjects, and more. This app features **CRUD operations**, a modern interface with **two themes (pink and blue)**, and a fully functional **frontend and backend** using HTML, CSS, JavaScript, Python, SQL, MySQL, and XAMPP as a local server.

---

## Features

- Add, update, delete, and view students and their grades.
- Manage subjects, classes, and student-specific data.
- Two beautiful themes: **Pink Mode** and **Blue Mode**.
- Toggle for background animations.
- Responsive and clean user interface.
- Local database integration using **MySQL** and **Python HTTP server**.

---

## Screenshots

![Screenshot 1](/github/home.png)  
![Screenshot 2](/github/options.png)
![Screenshot 3](/github/table.png)
![Screenshot 4](/github/search.png)

---

## Folder Structure

Student-Management-System/
├── frontend/
│ ├── index.html
│ ├── usage.html
│ ├── css/
│ │ └── style.css
│ └── js/
│ ├── api.js
│ ├── dom-utils.js
│ ├── exams.js
│ ├── gpa.js
│ ├── grades.js
│ ├── main.js
│ ├── menu.js
│ ├── students.js
│ ├── subjects.js
│ └── theme.js
|
├── backend/
│ ├── server.py
│ └── database/
│ └── schema.sql
├── LICENSE
└── README.md
└── github

> Frontend folder contains all the HTML, CSS, and JS files.  
> Backend folder contains the Python server script handling CRUD operations and API requests.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (`http.server` module)
- **Database:** MySQL, SQL
- **Local Server:** XAMPP

---

## How to Run Locally

1. **Clone the repository** (or download it as a ZIP):

```bash
git clone https://github.com/Eng-Muntadher/Student-Management-System
cd Student-Management-System
```

2. **Install MySQL** (via XAMPP or standalone) and create the database using the provided `schema.sql` file:

```sql
-- Run this in your MySQL client
SOURCE path/to/schema.sql;
```

3. **Database Connection Credentials** in server.py:

connection = mysql.connector.connect(
host="localhost",
user="root",
password="",
database="dbforproject"
)

4. **Start the Python server**:

python backend/server.py

5. **Make sure your server is on**:

open XAMMP or any other server you want to use and make sure it can receive requests.

6. **Open the frontend**:

Open frontend/index.html in your browser to access the app.

---

## Python Dependencies

This project requires **Python 3.x** and the following package:

- `mysql-connector-python` (for connecting to MySQL)

You can install it using pip:

```bash
pip install mysql-connector-python
```

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

Built by Muntadher Ahmed

```

```
