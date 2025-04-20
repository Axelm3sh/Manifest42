# Components Overview

This document provides an overview of the component structure in the Manifest42 frontend application. Components are organized into logical modules based on their functionality.

## Component Categories

### [AI Insights](./ai-insights/ai-insights.md)
Components for displaying machine learning-driven insights, predictions, and recommendations for inventory management. These components help users make data-driven decisions based on AI analysis.

### [Base](./base/base.md)
Fundamental UI building blocks used throughout the application. These components ensure consistency in design and behavior across the application.

### [Inventory](./inventory/inventory.md)
Components for managing and visualizing inventory data, including stock levels, warehouse information, and inventory metrics.

### [Notification](./notification/notification.md)
Components for managing and displaying system notifications, alerts, and user messages throughout the application.

### [Simulation](./simulation/simulation.md)
Components for running, visualizing, and analyzing inventory and supply chain simulations to help optimize business operations.

## Standalone Components

### dashboard-layout.vue
The main layout component for dashboard views. It provides the structure for all dashboard pages, including navigation, header, and content areas.

### data-list.vue
A generic list component for displaying data in a consistent format. It supports filtering, sorting, and pagination.

### language-switcher.vue
A component that allows users to switch between different language options in the application.

### theme-toggle.vue
A component that allows users to switch between light and dark themes.

## Component Design Principles

1. **Modularity**: Components should be focused on a single responsibility
2. **Reusability**: Components should be designed for reuse across the application
3. **Consistency**: Components should follow consistent patterns and styling
4. **Accessibility**: Components should be accessible to all users
5. **Performance**: Components should be optimized for performance

## Usage Guidelines

- Use the appropriate component category for new features
- Prefer using existing components over creating new ones
- Follow the Vue.js Style Guide for component implementation
- Document new components in the appropriate markdown files
