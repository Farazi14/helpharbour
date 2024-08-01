# Help Hardour - Service Desk System
Welcome to the Help Hardour's official repository! The project is a small scale example of a service desk system designed with the concept of optimising IT operations for any organisation. Essentially, the system is used to lodge IT issues so that the IT deperatment can handle those issues using industrial best practices.
## 🌟 Features
- **Dashboard Analytics:** Provides a comprehensive dashboard with real-time analytics on service requests, status updates, and resolution metrics, enabling better decision-making and resource allocation.
- **User Role Management:** Implements flexible role-based access control, allowing for detailed customisation of user permissions tailored to organizational needs. 
- **FAQ Solutions:** A dedicated module allows administrative users to post and update solutions to frequently asked questions, significantly reducing repeat IT inquiries and encouraging user self-service.
- **Real-Time Communication:** Features an integrated communication module that enables direct interaction between requestors and IT technicians, improving resolution times and enhancing user satisfaction.
- **Responsive Design:** Ensures the page looks great on all devices.
## 🛠️ Arhitecture & Technology Stack
The following architecture was used in the development of the system.
- **MVC:** Model-View-Controller is a software architectural pattern that separates an application into three interconnected components: the model (data), the view (user interface), and the controller (processes commands, makes calls to model objects), to facilitate efficient code organization and reuse.
The following technologies were used in the creation of the application.
- **C#, ASP.Net:** C# and ASP.Net form the backend framework, enabling robust server-side programming and application logic for web services and dynamic web content.
- **React:** React is the frontend JavaScript library used for building interactive user interfaces, known for its efficient rendering and state management in web applications.
- **MongoDB Atlas:** MongoDB Atlas serves as the cloud database platform, providing a fully-managed MongoDB service that offers scalability, high availability, and geographical distribution.
## 🚀 Getting Started
### Prerequisites
To run the "Help Hardour" application on your local machine, follow these straightforward steps:
1. **Fork the Repository:**
   - Navigate to the GitHub page of the repository.
   - Click the "Fork" button at the top right to create your own copy of the repository in your GitHub account.
2. **Clone Your Fork:**
   - Open Visual Studio 2022.
   - In Visual Studio, go to "Clone a repository" and enter the URL of your forked repository to ensure all project files are correctly set up.
3. **Launch the Application:**
   - Once the repository is successfully cloned, you can launch the application by simply clicking the play button (IIS Express) in Visual Studio.
4. **Login to the Application:**
   - Once the application is launched, you will see the login page. Use the following credentials to log in:

| Username        | Password | Role        |
|-----------------|----------|-------------|
| Tim             | 123      | User        |
| Barbara Jones   | 101      | Technician  |
| David Williams  | 321      | Administrator |

**Note:** There is no need to set up the database as it has already been configured on the cloud, and the connection string is predefined in the project settings.
