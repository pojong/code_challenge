# Code Challenge
### Author: pojong
## Description
This project is a code challenge using Spring Boot 4, Spring 7 with Reactive Programming as backend.
It uses R2DBC and PostgreSQL with Spotify Web Api 

While the frontend is using React.js typescript

#### Before you start 
 It needs maven, openjdk 21+ and docker installed and properly configured. Needs nodes for the front-end

### How to run the backend:
a. Type "./build.sh" in the command line for building the application.

b. Type "./start.sh" in the command line to start the docker and build the application.

c. Type "./stop.sh" in the command line to stop the docker.

Access the application at http://localhost:8080/swagger-ui/index.html for testing the API

### How to run the frontend:
a. Type "npm install" in the command line for installing the dependencies.

b. Type "npm run build" in the command line for building the application.

c. Type "npm run dev" in the command line to start the application.

Access the application at http://localhost:3000 for testing the API