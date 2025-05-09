# AI-Powered Inventory Management Dashboard

## Project Overview
This project is an advanced inventory management dashboard with AI-driven insights mock.
Built with Vue 3 and Vite, it provides a comprehensive solution for warehouse operations, 
inventory tracking, and logistics management.

## Design and Architecture 
Our system delivers a sophisticated dashboard with AI-driven insights, providing customized access and features based on user roles:

- **Role-Based Access Control (RBAC)**: Different access levels for admins, supervisors, and workers
- **Real-Time Inventory Tracking**: Live updates on stock levels, shipments, and warehouse status
- **AI-Driven Predictive Insights**: Demand forecasting and reduction of overstock/understock issues
- **Automated Alerts & Notifications**: AI-based suggestions for restocking and risk mitigation
- **Seamless API Integration**: Connectivity with external logistics and supplier systems

A prototype web UI for a warehouse management system that:

- **Authenticates** users and enforces **role‑based access**
- Presents **real‑time KPIs**, notifications, and metrics
- Allows **manual overrides** and **AI agent** adjustments via API
- Generates **scheduled reports** and alerts

---

## Activity Flow Overview

1. **Login & Authentication**  
   Users enter credentials on the login screen. On success, the system fetches their role; on failure, an error is shown.

2. **Role‑Based Routing**
    - **Admin** → Admin Dashboard
    - **Manager** → Manager Dashboard
    - **Analyst** → Analytics Dashboard
    - **Logistics** → Logistics Dashboard

3. **Dashboard Core**  
   Each dashboard view displays:
    - Live KPIs & metrics
    - System notifications & error alerts
    - Action buttons for order initiation, resource reallocation, etc.

4. **Real‑Time Data Integration**  
   A continuous loop:
    1. Fetch real‑time streams
    2. Trigger API calls to the simulation backend
    3. Handle success or error
    4. Render updated data

5. **User‑Triggered Actions**  
   Users can:
    - Manually override AI decisions
    - Adjust simulation parameters
    - Initiate orders or resource allocations

6. **Reporting & Automation**
    - Generate on‑demand analytics
    - Schedule CRON jobs for periodic reports
    - Dispatch email/notification alerts

7. **Logout**  
   Securely terminate the session.

## User Roles and Dashboard Functionality

For detailed information about user roles, dashboard features, common tasks, and navigation tips, please refer to the in-app FAQ page. The FAQ provides comprehensive guidance for:

- Admin role
- Manager role
- Analyst role
- Logistics role

## Troubleshooting

For common issues, solutions, and getting help, please refer to the Troubleshooting section in the in-app FAQ page.

## Expected Outcomes

- **Optimized Warehouse Operations**: Achieve efficiency through real-time inventory visibility
- **Reduced Operational Costs**: Automate restocking and demand forecasting processes
- **Improved Decision-Making**: Leverage AI-powered analytics for better business decisions
- **Enhanced Security & Compliance**: Implement structured role-based access and regulatory compliance
- **Scalability & Flexibility**: Seamlessly integrate with third-party logistics and supplier systems

## Technical Stack
- Frontend: Vue 3 with Composition API
- Build Tool: Vite
- UI Components: A mix of Custom-built with Vue 3 and [PrimeVue components](https://primevue.org/)
- Deployment: Vercel

## Installation & Setup

This project offers two setup paths depending on your needs:

### Quick Setup (For Reviewers)

If you want to quickly try out the application without diving into development details,
Visit our site at [Manifest42 Dashboard](https://manifest42.vercel.app/)

Or if you want to try it on your local machine, follow these steps:

#### Prerequisites
- Node.js (v14 or higher)
- npm (v7 or higher)
- Git (+ GitHub Desktop, optional for visual users)

#### Steps

1. Clone the repository
   ```bash
   git clone https://github.com/Axelm3sh/Manifest42.git
   cd Manifest42
   ```

2. Install dependencies and start both frontend and mock API
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

#### Test Accounts
You can use the in-app demo buttons to test different user roles.

#### Basic Usage
- After logging in, you'll be directed to a dashboard based on your role
- Explore the KPIs and metrics displayed on your dashboard
- Try out the AI-driven features like demand forecasting and inventory optimization
- Use the navigation menu to access different sections of the application

### Development Setup (For Contributors)

If you're planning to contribute to the project,
this section provides more detailed information about the development environment and workflow.

#### Project Structure
```
Manifest42/
├── src/ # Source code
│ ├── assets/ # Static assets
│ ├── components/ # Vue components
│ ├── composables/ # Vue composables (reusable composition functions)
│ ├── i18n/ # Internationalization
│ ├── router/ # Vue Router configuration
│ ├── stores/ # Pinia stores (state management)
│ ├── utils/ # Utility functions
│ └── views/ # Page components
├── api/ # Mock API server
├── shared/ # Shared data models and types
├── public/ # Public static files
├── tests/ # Unit and integration tests
├── cypress/ # End-to-end tests
├── docs/ # Documentation
├── .storybook/ # Storybook configuration
└── .github/ # GitHub workflows and templates
```

#### Development Commands

##### Setup and Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start API server (mock backend)
npm run api

# Start both development and API servers concurrently
npm run dev:all
```

##### Testing
```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Open Cypress for end-to-end testing
npm run test:e2e:open
```

##### Storybook
```bash
# Start Storybook development server
npm run storybook

# Build Storybook for static deployment
npm run build-storybook
```

##### Build
```bash
# Build for development
npm run build

# Build for staging environment
npm run build:staging

# Build for production environment
npm run build:prod

# Build with bundle analyzer
npm run build:analyze

# Preview build
npm run preview

# Preview staging build
npm run preview:staging

# Preview production build
npm run preview:prod
```

#### Contribution Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Style Guidelines
This project follows a comprehensive set of Vue.js style guidelines. Please refer to the [Vue.js Style Guide](./.junie/guidelines.md) for detailed information on:

- JavaScript naming conventions and code style
- Vue.js component structure and best practices
- Composition API usage
- Component design patterns
- Common pitfalls to avoid
- Performance considerations
