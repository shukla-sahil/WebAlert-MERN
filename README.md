

# Web Alert - URL Monitoring Application
---
## Project Overview

This project involves creating a web application where users can monitor URLs, create and manage organizations, and collaborate with other users within those organizations. Users can easily monitor multiple URLs and receive prompt email notifications if a website is down. The application is built using Node.js with MongoDB as the database and React for the frontend.

## Website Link
[Web Alert - URL Monitoring Application](https://web-alert-mern.vercel.app/)

## Features

### User Authentication and Authorization
- **Registration**: Users can register with their email, password, and other details.
- **Login**: Users can log in using their credentials, receiving a JWT token for authenticated requests.
- **Middleware**: `authMiddleware` ensures that only authenticated users can access protected routes.

### User Dashboard
- **Fetching Organizations**: Users can view a list of their organizations upon login.
- **Creating Organizations**: Users can create new organizations with a unique name and URL. The creator becomes the owner of the organization.
- **Adding Users**: Users can optionally add other registered users to their organization.

### Organizations Management
- **Creating Organizations**: Each organization is associated with a unique URL and the owner's ID. The URL must be unique across all organizations for a given user.
- **Adding Users to Organizations**: Users can add other users to their organizations, ensuring that the user being added exists and isn't already part of the organization.

### Backend Setup
- **Models**:
  - `User` model includes fields for user details.
  - `Organization` model includes fields for organization name, URL, owner, and users, with URL uniqueness enforced.
- **Controllers**:
  - **`organizationController.js`**: Handles the creation of organizations, the addition of users, and the retrieval of user-specific organizations.
- **Routes**:
  - **`organizationRoutes.js`**: Manages routes for organization creation, user addition, and fetching organizations.
- **Server Configuration**: Sets up routes, middleware, and MongoDB connection.

### Frontend Implementation
- **Dashboard Component**:
  - Displays a form for creating new organizations.
  - Lists existing organizations with options to add users.
  - Refreshes the list of organizations after each creation or update.

### Email Notifications
- **Notification System**: Users receive email notifications if any URL within their organization goes down.

## Application Flow

1. **User Interaction**
   - **Login**: User logs in through the login page and receives a JWT token.
   - **Access Dashboard**: The token is stored in local storage, and the user is redirected to the dashboard page upon successful login.

2. **Dashboard Operations**
   - **Fetching Organizations**: On page load, `fetchOrganizations` is called to retrieve the list of organizations from the server.
   - **Creating an Organization**: User fills out a form with the organization name and URL, then clicks the "Create" button. The frontend sends a POST request to the backend to create the organization. The response is used to update the organizations list.
   - **Adding Users**: Users can add other registered users to their organization by entering the user ID and clicking the "Add User" button. The backend verifies the user and updates the organization.

3. **Backend Processing**
   - **Organization Creation**: When creating an organization, the server checks if the URL is unique for the logged-in user and creates the organization if valid.
   - **User Addition**: The server verifies the existence of the user and organization, checks if the user is already part of the organization, and then adds the user to the organization.

4. **Error Handling**
   - **Frontend**: Errors are caught during API requests and displayed to the user via alerts.
   - **Backend**: Errors are handled and returned with appropriate status codes and messages.

## Future Considerations

1. **Enhanced Validation**: Implement more robust validation for user inputs, such as checking URL formats and ensuring organization names are unique across all users.
2. **User Role Management**: Add roles and permissions to manage different types of access within organizations.
3. **UI/UX Improvements**: Enhance the user interface and user experience with better design and interactive elements.

## Additional Information

- **MongoDB Atlas**: Used for cloud storage.
- **Email Notifications**: Implemented to notify users when a URL is down.



---

You can update your README file with this content to reflect the latest changes and features of your project.
