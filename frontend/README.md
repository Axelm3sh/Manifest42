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
```
npm install
npm run dev
```

## Build for Production
```
npm run build
npm run preview
```
