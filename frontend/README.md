# AI-Powered Inventory Management Dashboard

## Project Overview
This project is an advanced inventory management dashboard with AI-driven insights. Built with Vue 3 and Vite, it provides a comprehensive solution for warehouse operations, inventory tracking, and logistics management.

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

### Admin Role
**Overview:** Administrators have the highest level of access and are responsible for system management, user administration, and overseeing the entire inventory management system.

**Key Dashboard Features:**
- **System Status Monitoring:** View users online, pending approvals, system health, and backup status
- **User Management:** Add, edit, and deactivate user accounts
- **System Settings:** Configure application settings and permissions
- **Inventory Management:** Access to all inventory data and management functions

**Common Tasks:**
- Approving new user registrations
- Managing user roles and permissions
- Monitoring system health and performance
- Reviewing system logs and activity history
- Configuring system-wide settings

**Navigation Tips:**
- Use the quick actions panel for fast access to common administrative tasks
- Monitor the recent activities section to stay informed about important system events
- Check the system status card regularly to ensure optimal system performance

### Manager Role
**Overview:** Managers oversee operations, team performance, and make approval decisions for inventory adjustments and other operational changes.

**Key Dashboard Features:**
- **Approval Management:** Review and process pending approval requests
- **Team Performance Monitoring:** Track team member performance metrics
- **Inventory Oversight:** View inventory alerts and status
- **Cost Savings Tracking:** Monitor financial metrics related to inventory optimization

**Common Tasks:**
- Reviewing and approving inventory adjustments
- Monitoring team performance and productivity
- Analyzing cost savings opportunities
- Generating and reviewing reports
- Making operational decisions based on AI recommendations

**Navigation Tips:**
- Prioritize approval requests by their urgency level (high, medium, low)
- Use the team performance card to identify top performers and areas for improvement
- Access quick actions for immediate response to critical inventory situations

### Analyst Role
**Overview:** Analysts focus on data analysis, running simulations, generating reports, and leveraging AI insights to optimize inventory management.

**Key Dashboard Features:**
- **Simulation Management:** Create and monitor inventory simulations
- **Report Generation:** Create and access analytical reports
- **AI Insights:** View and act on AI-generated recommendations
- **Data Accuracy Monitoring:** Track and improve data quality metrics

**Common Tasks:**
- Creating and running inventory simulations
- Analyzing simulation results and generating insights
- Producing reports for management review
- Monitoring data accuracy and quality
- Implementing AI recommendations for inventory optimization

**Navigation Tips:**
- Toggle section visibility to customize your dashboard view
- Use the simulation progress bars to track ongoing simulations
- Review AI recommendations sorted by confidence level and potential impact
- Access the analytics section for in-depth data exploration

### Logistics Role
**Overview:** Logistics personnel manage shipments, deliveries, and day-to-day inventory movements, focusing on operational execution.

**Key Dashboard Features:**
- **Shipment Tracking:** Monitor pending, in-transit, and delivered shipments
- **Inventory Alerts:** View and respond to stock level warnings
- **Delivery Management:** Track upcoming deliveries and their status
- **Stockout Risk Monitoring:** Identify and address potential stockout situations

**Common Tasks:**
- Creating and tracking shipments
- Responding to inventory alerts (low stock, stockout risk, excess inventory)
- Monitoring delivery schedules and addressing delays
- Managing day-to-day inventory movements
- Coordinating with suppliers and distribution centers

**Navigation Tips:**
- Use status indicators to quickly identify delayed shipments or critical inventory alerts
- Check the upcoming deliveries section daily to prepare for new arrivals
- Respond promptly to critical-level inventory alerts to prevent stockouts
- Use the shipment creation function to initiate new outbound shipments

## Troubleshooting Tips

### Common Issues and Solutions

1. **Login Problems**
   - Ensure you're using the correct credentials
   - Check if your account is active
   - Clear browser cache and cookies
   - Contact an administrator if problems persist

2. **Dashboard Not Loading**
   - Check your internet connection
   - Refresh the page
   - Clear browser cache
   - Try using a different browser

3. **Data Not Updating**
   - Check if real-time data streaming is enabled
   - Refresh the dashboard
   - Verify API connectivity
   - Contact technical support if the issue persists

4. **Permission Denied Errors**
   - Verify that you have the appropriate role for the action
   - Log out and log back in
   - Contact an administrator to review your permissions

5. **Slow Dashboard Performance**
   - Close unnecessary browser tabs
   - Clear browser cache
   - Check your internet connection speed
   - Reduce the number of active dashboard widgets

### Getting Help
If you encounter issues not covered above, please:
- Check the documentation in the Help section
- Contact your system administrator
- Submit a support ticket through the Help desk
- Refer to the training materials for your specific role

## Expected Outcomes

- **Optimized Warehouse Operations**: Achieve efficiency through real-time inventory visibility
- **Reduced Operational Costs**: Automate restocking and demand forecasting processes
- **Improved Decision-Making**: Leverage AI-powered analytics for better business decisions
- **Enhanced Security & Compliance**: Implement structured role-based access and regulatory compliance
- **Scalability & Flexibility**: Seamlessly integrate with third-party logistics and supplier systems

## Technical Stack
- Frontend: Vue 3 with Composition API
- Build Tool: Vite
- UI Components: Custom-built with Vue 3

## Development

### Setup and Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing
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

### Storybook
```bash
# Start Storybook development server
npm run storybook

# Build Storybook for static deployment
npm run build-storybook
```

### Build
```bash
# Build for development
npm run build

# Preview build
npm run preview
```

### Style Guidelines
This project follows a comprehensive set of Vue.js style guidelines. Please refer to the [Vue.js Style Guide](./.junie/guidelines.md) for detailed information on:

- JavaScript naming conventions and code style
- Vue.js component structure and best practices
- Composition API usage
- Component design patterns
- Common pitfalls to avoid
- Performance considerations
