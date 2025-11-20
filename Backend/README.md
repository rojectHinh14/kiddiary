# KidDiary Backend — Node.js, Express, Sequelize, MySQL

This is the backend API for the KidDiary project, built with **Node.js**, **Express**, **Sequelize ORM**, and **MySQL**.

---

## 1. System Requirements

Make sure your environment has the following installed:

- **Node.js** ≥ 16
- **npm** or **yarn**
- **MySQL Server**
- **Git**

---

## 2. Clone the Repository

```bash
git clone <your-repo-link>
cd <project-folder>
```

---

## 3. Install Dependencies

```bash
npm install
# or
yarn install
```

---

## 4. Environment Configuration

### 4.1 Create the `.env` file

The project includes a sample environment file:

```
.env.example
```

Copy it to `.env`:

```bash
cp .env.example .env
```

Then fill in your values:

```
PORT=
URL_REACT=
NODE_ENV=
JWT_SECRET=
JWT_EXPIRES=
GEMINI_API_KEY=
GROK_API_KEY=

AI_TAGGING_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FB_CLIENT_ID=
FB_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## 🗄️ 5. Configure Database (MySQL + Sequelize)

### `src/config/config.json`

Update MySQL credentials according to your local environment:

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "kiddiary",
    "port": 3306,
    "dialect": "mysql",
    "logging": false,
    "timezone": "+07:00"
  }
}
```

⚠️ **Do not commit real database passwords in production.**

---

## 6. Create MySQL Database

Run this SQL command:

```sql
CREATE DATABASE kiddiary;
```

---

## 7. Database Connection Check

The project uses `connectDB.js`:

```js
const sequelize = new Sequelize("kiddiary", "root", null, {
  host: "localhost",
  dialect: "mysql",
});
```

If your MySQL username or password is different, the user needs to update this file.

---

## ▶️ 8. Run the Project

### Development mode:

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

Your server will run on:

```
http://localhost:<PORT>
```

---

## 9. Project Structure (Simplified)

```
src/
 ├── config/
 │     ├── config.json
 │     └── connectDB.js
 ├── controllers/
 ├── models/
 ├── routes/
 └── server.js
```

---

## 10. Testing the API

You can use **Postman** or **Thunder Client**.
If you have a Postman Collection, import it here.

---

## Contributions

Contributions are welcome!
Feel free to open an **Issue** or **Pull Request**.

---

## License

MIT License.
