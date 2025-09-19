# Backend

### **LOGIN**

If the login is successful, the server will return the following response:

```
{
    "errCode": 0,
    "message": "Login successful",
    "user": {
        "id": 1,
        "firstName": "Thang",
        "lastName": "Vu",
        "email": "test@gmail.com",
        "password": "$2b$10$2q5dzPbXWOWAztrr/z2Tj.UF0oUf8rlFP.38QF14btYfLpTA62rpi",
        "createdAt": "2025-09-19T13:43:57.000Z",
        "updatedAt": "2025-09-19T13:43:57.000Z"
    }
}
```

If the user enters an incomplete input, the following response will be returned:

```
{
    "errCode": 1,
    "errMessage": "Missing input"
}
```

If the user enters the wrong password, the server will return the following response:

```
{
    "errCode": 2,
    "errMessage": "Wrong password"
}
```

### **REGISTER**

while if the registration is successful, the server will return the following response:

```
{
  "errCode": 0,
  "message": "Login successful",
  "user": {
    "id": 1,
    "firstName": "Thang",
    "lastName": "Vu",
    "email": "test@gmail.com",
    "password": "$2b$10$2q5dzPbXWOWAztrr/z2Tj.UF0oUf8rlFP.38QF14btYfLpTA62rpi",
    "createdAt": "2025-09-19T13:43:57.000Z",
    "updatedAt": "2025-09-19T13:43:57.000Z"
  }
}
```

If the user enters an EMAIL THAT ALREADY EXISTS, the server will return the following response:

```
{
    "errCode": 1,
    "errMessage": "Email already registered"
}
```

If the user enters missing registration information, the server will return the following response:

```
{
    "errCode": 1,
    "errMessage": "Missing input"
}
```

- **If you want to run the server, create a new .env file and copy the entire .env.example file and paste it.**
- **Then declare NODE_ENV=development, the other 2 variables are random**
- **In the src/config/config.json file, edit the port and database, username, and password of mysql according to the local setup.**
- **Once you have set up mysql, run the command "npx sequelize-cli db:migrate" to have sequelize automatically create tables for the database.**
