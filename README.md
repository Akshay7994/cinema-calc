# Cinema Calc Coding Challenge

## Quaetions
1. How to run the project locally?
```
Create a .env file with *DB_USER* and *DB_PASSWORD*
DB_USER={Username}
DB_PASSWORD={Password}

Run `docker-compose up --build` 
```

2. What is the overall structure of your code?
```
A react application with Javascript is used to develop the frontend with material ui as component 
styling. Axios is used for calling restApi's and handle persistent storage of data. The application 
consists of an editable table to manage cinema expenses effeciently. Component based code sturucture 
is used to seperate each component and allow modularity in the code. Each component consists of a 
.jsx and .css file to manage functionality and styling.

A C# Minimal Api is used for developing a backend to create GET, POST, DELETE RestAPI's required for 
the appication. To manage the datastorage a PostgresSQL db is used to store the expense data. Model and
 Controller based approach is used here to manage database migration with a proper database context. 
 Controllers are managed in Porgram.cs file itself as the API's did not include any complex authentication 
 or backend operations hence making it lightweight and fast. The current implementation can be modified as 
 separate controller based approach as well.

Overall Project Structure:
├── 100_ASSETS
│   └── CINEMA-CALC-23.jpg
├── CalcApi
│   ├── appsettings.Development.json
│   ├── appsettings.json
│   ├── bin
│   ├── CalcApi.csproj
│   ├── CalcApi.sln
│   ├── Dockerfile
│   ├── Migrations
│   ├── Models
│   │   ├── CalcContext.cs
│   │   └── CalcItem.cs
│   ├── obj
│   ├── Program.cs
│   ├── Properties
│   │   └── launchSettings.json
│   └── Readme.md
├── cinema-calc
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── components
│       │   ├── pdf.png
│       │   ├── Table.css
│       │   ├── Table.jsx
│       │   ├── Window.css
│       │   ├── Window.jsx
│       │   └── xls.png
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── docker-compose.yml
├── README.md
└── Requirements.md

```
3. How do you manage state in your application? Why did you choose this solution?
```
Local state management approach *useState* is used to manage state in the application.
As the application was a single component and has basic functionality of add, edit and delete features 
on a list. Hence i found using useState is simple and better in the current scenario.
```

4. How does your approach for precise number calculations work?
```
The total of each expense is caculated as a record is entered and pushed to backend as per the given formula.
Grand total is calculated when the rows are populated on the page so any changes on the state will reflect 
immediately on the Gross total and Total fields. 
```
5. What „tasks“ did you have on your mind? How did you break down the different deliverables?
```
I broke down the whole task into various smaller tasks like
* Setting up environment.
* Building a responsive page with a simple table that changes into cards on mobile view.
* Populating a json array as a table dynamically.
* Add new item adds a record to the table.
* Initially i made a dialogue to enter name, price and percentage data which gets added to the table and pushed on submit.
* Delete a record on confirm from list.
* API development with C# Minimal Webapi.
* Database integration for get, post and delete methods.
* API integration for frontend with CORS.
* Tested all functionality.
* Modifies CSS to make it look better.
* Changed the approach from dialog based to TextField based approach once all the functinalities were working.
* Created Dockerfile for both frontend, backend and Database with its docker-compose.
* Created .env based Connection String passing to docker-compose to avoid hardcoding any secrets on the application.
```
6. Use the readme as a notepad to make us understand your thinking.

* Setting up environment.
Update node and npm. 
Start a react project. 
https://legacy.reactjs.org/docs/hello-world.html
https://react.dev/learn/installation

* Building a responsive page with a simple table that changes into cards on mobile view.
https://react-bootstrap.netlify.app/docs/components/table/

* Populating a json array as a table dynamically.
* Add new item adds a record to the table.
* Initially i made a dialogue to enter name, price and percentage data which gets added to the table and pushed on submit.
https://react-bootstrap.netlify.app/docs/components/modal/

* Delete a record on confirm from list.
* API development with C# Minimal Webapi.
https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio

1. Created webapi with dotnet.
2. Setup Models and Registered DbContext.
3. Set DB Context with the registred context with proper connection string for postgress.
4. Register DbContext in Program.cs
5. Use dotnet ef to migrate the model into a DB and its schema 
    - dotnet ef migrations add <nameForYourMigration>
    - dotnet ef database update
6. Generate a controller and link it with its respective model.

* Database integration for get, post and delete methods.
To undestand migration and db creation from the C#: 
https://medium.com/@saisiva249/how-to-configure-postgres-database-for-a-net-a2ee38f29372

* API integration for frontend with CORS.
https://axios-http.com/docs/example

* Tested all functionality.
* Modifies CSS to make it look better.
* Changed the approach from dialog based to TextField based approach once all the functinalities were working.
https://mui.com/material-ui/react-text-field/
* Created Dockerfile for both frontend, backend and Database with its docker-compose.
* Created .env based Connection String passing to docker-compose to avoid hardcoding any secrets on the application.
https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/
