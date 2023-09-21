# lich17

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)


## About <a name = "about"></a>

The project describes an application developed using the Nest.js framework. The application serves as a platform for creating blogs with features such as post publishing, commenting, and content liking.

The project's architecture is based on modules and provides various functionalities including authentication, authorization, user management, blog management, post management, comment management, database interaction, and email sending.

The main modules and dependencies used in the project are as follows:

ConfigModule and ConfigService from @nestjs/config for handling application configuration.
TypeOrmModule from @nestjs/typeorm for working with the database using Object-Relational Mapping (ORM). PostgreSQL is used as the database in the project.
CqrsModule from @nestjs/cqrs for implementing the Command-Query Responsibility Segregation (CQRS) pattern.
PassportModule from @nestjs/passport for user authentication and authorization.
MailModule for sending emails.
ThrottlerModule from @nestjs/throttler for rate limiting API requests.
The application also includes controllers that handle HTTP requests and interact with corresponding services and repositories. Some of the controllers include AuthController, BlogBloggersController, BlogController, CommentBloggersController, CommentController, PostBloggersController, PostController, SessionsController, TestController, UserBloggersController, UserSAController, and QuestionSAController.

This API is a powerful tool for managing various aspects of a web application. It encompasses a wide range of functionalities, providing developers with a flexible and scalable set of tools for creating and managing applications.

The API includes the following key components and capabilities:

Authentication and Authorization: The API provides functionality for user authentication using JWT tokens. Users can register, log in, and manage their sessions.

User Management: Developers can create, delete, and manage users. Mechanisms for user blocking and retrieving a list of blocked users are also implemented.

Blog and Post Management: The API allows users to create blogs, publish posts, and manage them. There is also the ability to add and remove comments to posts.

Quiz Games: Quiz games are implemented, where users can answer questions and compete with each other. The API provides methods for creating and managing questions and games.

Integration with Telegram: The API supports integration with the Telegram messenger, allowing for sending notifications and interacting with users through a bot.

Image Storage: User images and blog content images can be uploaded and stored in the S3 cloud storage.

Extensibility and Configurability: The API is designed to be extensible and configurable to meet the specific needs of a project. Developers can easily add new functionality and customize API settings.

Error Handling and Security: The API implements error handling mechanisms and ensures the security of user data. This includes authentication error handling, protection against unauthorized access, and more.

Session Management: Users can manage their active sessions and log out when needed.

Subscription Management: Users can subscribe to blogs and unsubscribe from them, receiving notifications about new posts.

The API provides developers with the tools to create full-fledged web applications with diverse functionality and extensive data management and user interaction capabilities.

The project also includes validators for validating input data, authentication strategies, repositories for data access, services for performing business logic, and data transfer objects (DTOs) for transferring data between the client and server. Decorators and dependency injections are used to establish connections between different components of the application. Decorators are used to add additional functionality to classes and methods, such as handling HTTP requests, data validation, authentication, and authorization. Dependency injections automatically inject class instances into other classes, making dependency management easier and promoting modularity.

Overall, the Nest.js-based project is a powerful blogging platform with advanced functionality, ensuring security, authentication, authorization, and content management. It utilizes modules, services, repositories, controllers, and use cases to implement various application features. This architecture provides flexibility, scalability, and ease of development, making your project ready for further growth and real-world usage.

## Getting Started <a name = "getting_started"></a>

TBased on your project using Nest.js, here are the instructions to get a copy of the project up and running on your local machine for development and testing purposes using Yarn:

**Prerequisites:**
- Node.js should be installed on your machine.
- PostgreSQL should be installed and running.

**Step 1: Clone the repository**
1. Open a terminal or command prompt.
2. Change the current working directory to the location where you want to clone the project.
3. Run the following command to clone the repository:
   ```
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the actual URL of the repository.

**Step 2: Install dependencies**
1. Navigate to the project's directory:
   ```
   cd <project-directory>
   ```
   Replace `<project-directory>` with the name of the project's directory.
2. Run the following command to install the project dependencies using Yarn:
   ```
   yarn install
   ```

**Step 3: Configure the database**
1. Open the project's configuration file (`config.env`) and provide the necessary database connection details (e.g., host, port, username, password, database name).
2. Ensure that the PostgreSQL server is running and accessible with the provided credentials.

**Step 4: Run the application**
1. Run the following command to start the application:
   ```
   yarn start:dev
   ```
   This will compile the TypeScript code, start the Nest.js server, and listen for incoming requests.

**Step 5: Test the application**
1. Open a web browser or an API testing tool (e.g., Postman).
2. Access the application by navigating to `http://localhost:<port>` in the browser or using the appropriate API endpoints in the testing tool.
3. Perform the desired actions (e.g., create a blog, publish a post, comment on a post) and verify the application's functionality.

**Deployment:**
Prerequisites
Before installing the software, make sure you have the following dependencies installed on your computer:

Node.js: The JavaScript runtime environment. You can download and install Node.js from the official website: https://nodejs.org

Nest.js: The framework for building scalable Node.js web applications. You can install Nest.js globally by running the following command in the command line:

bash
Copy code
npm install -g @nestjs/cli
Once Nest.js is installed, you can use it to create and run projects.

PostgreSQL: A powerful open-source relational database management system. You can download and install PostgreSQL from the official website: https://www.postgresql.org

Ensure that you have the appropriate versions of Node.js, Nest.js, and PostgreSQL installed, compatible with the requirements of your project.

After installing these prerequisites, you are ready to proceed with the software installation.

## Usage <a name = "usage"></a>

After successfully installing and running the project, you will have access to the blog system. Here are some important notes on how to use the system:

Authentication and Authorization:

To start using the system, you need to register using the corresponding endpoint or the web interface form. During registration, you must provide a unique username and a valid email address.
After successful registration, you can log in to the system using your credentials (username and password) via the login endpoint or the corresponding web interface form.
Upon successful authentication, the system will provide you with access tokens, which are required for authorization in subsequent API requests to the system.
Creating Blogs and Publishing Posts:

After authentication, you can create your own blogs using the corresponding endpoint or the web interface form. When creating a blog, you need to provide its name and other necessary information.
Once a blog is created, you can publish posts within that blog. Use the appropriate endpoint or web interface form to create and submit a post. Make sure you are authenticated and have the necessary permissions to create blogs and publish posts.
Commenting and Liking Content:

In the system, you can leave comments on posts by other users and like posts and comments. Use the corresponding endpoints or web interface forms to perform these actions. Ensure that you are authenticated and have the necessary permissions for commenting and liking content.
User Management:

The system provides functionality for managing users. You can view the list of users, block users, or assign them different roles and privileges. Use the corresponding endpoints or web interface forms to perform these actions. Note that some operations may require a specific role or privilege.
Password Recovery:

If you forget your password, the system provides password recovery functionality. Follow the instructions on the password recovery page and provide your registered email address. You will receive instructions for password recovery to the specified email address.