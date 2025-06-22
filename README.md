# Medicare Companion

## Overview
Medicare Companion is a web-based application designed to help patients and caretakers manage medication schedules effectively. It includes features such as medication tracking, adherence monitoring, streak calculation, and a calendar view to visualize medication history. The app is built with React for the frontend and a Node.js/Express server for the backend, providing a user-friendly interface for both patients and caretakers.

## Features
- **Medication Management**: Add, view, and delete medications with details like name, dosage, frequency, and time.
- **Adherence Tracking**: Monitor weekly adherence rates and daily completion status.
- **Streak Calculation**: Track consecutive days of complete medication adherence.
- **Calendar View**: Visualize medication taken dates with a monthly calendar.
- **Photo Proof**: Option to upload photos as proof of medication intake.
- **Role Switching**: Switch between patient and caretaker dashboards.
- **Notifications**: Display alerts for missed or taken medications (future enhancement).

## Installation and Usage

### Prerequisites
- Node.js (v14.x or later)
- npm (comes with Node.js)
- Git (for version control)

### Dependencies
- **Client (React)**:
  - `react`
  - `react-dom`
  - `react-router-dom`
  - `react-icons` (for Font Awesome icons)
- **Server (Node.js/Express)**:
  - `express`
  - `cors` (for cross-origin resource sharing)
  - `body-parser` (for parsing request bodies)
  - Other dependencies as per your server setup (e.g., database libraries like `mongoose` if used)

*Note*: A `package.json` file is included in both the `client` and `server` directories with these dependencies. Install them as part of the setup.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/medicare-app.git
   cd medicare-app


## Starting the Application
To run the full application (client and server), follow these steps:

1. **Start the Server**:
Navigate to the server directory:
```bash

cd server

Start the server:

```bash

npm start

The server should run on http://localhost:5000 by default (adjust port in .env if needed).

2. **Start the Client**:
In a new terminal, navigate to the client directory:
``` bash

cd client

Start the development server:

``` bash

npm start

The client will run on http://localhost:3000. Open this URL in your browser to view the app.
