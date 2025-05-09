# Manifest42 Frontend Requirements

This document outlines the high-level specifications, architectural decisions, and coding standards for the Manifest42 frontend application.

## 1. Project Overview

The Manifest42 frontend is an AI-Powered Inventory Management Dashboard with the following key features:
- Role-Based Access Control (RBAC)
- Real-Time Inventory Tracking
- AI-Driven Predictive Insights
- Automated Alerts & Notifications
- Seamless API Integration

## 2. Component Architecture

### Three-Tier Component Architecture

Our component architecture is organized into three tiers:

1. **Base/UI Components**: Low-level, reusable UI elements
2. **Composite Components**: Mid-level components that combine base components
3. **Page/View Components**: High-level components that represent entire pages or views

#### Base/UI Components

Base components are the building blocks of our UI. They are highly reusable, focused on a single responsibility, and have no dependencies on application-specific logic.

**Location**: `src/components/base/`

**Naming Convention**: All base components are prefixed with `Base` (e.g., `BaseButton.vue`, `BaseCard.vue`).

**Characteristics**:
- No dependencies on application state or business logic
- Highly reusable across the application
- Focused on UI presentation and interaction
- Configurable through props
- Emit events for parent components to handle

#### Composite Components

Composite components combine multiple base components to create more complex UI elements. They may contain some application-specific logic but should still be reusable within their domain.

**Location**: `src/components/{domain}/`

**Naming Convention**: Named according to their functionality within their domain (e.g., `SimulationParameters.vue`).

**Characteristics**:
- Combine multiple base components
- May contain domain-specific logic
- Reusable within their domain
- Communicate with parent components through props and events

#### Page/View Components

Page/View components represent entire pages or views in the application. They orchestrate the interaction between composite components and manage the overall state of the page.

**Location**: `src/views/` or `src/components/{domain}/`

**Naming Convention**: Suffixed with `View` or `Dashboard` (e.g., `SimulationControlsView.vue`, `InventoryDashboard.vue`).

**Characteristics**:
- Compose multiple composite components
- Manage the overall state of the page
- Interact with Vuex stores or other state management
- Handle routing and navigation
- Implement page-level business logic

### Composables

Composables are reusable JavaScript functions that encapsulate and share stateful logic between components. They follow the Vue 3 Composition API pattern.

**Location**: `src/composables/`

**Naming Convention**: Prefixed with `use` (e.g., `useFormatters.js`).

**Characteristics**:
- Extract and reuse stateful logic
- Follow the Composition API pattern
- Return reactive state and functions
- Can be combined with other composables

### Component Communication

Components communicate with each other through the following mechanisms:

1. **Props**: Parent components pass data to child components through props
2. **Events**: Child components emit events that parent components listen for
3. **Provide/Inject**: For deep component hierarchies where prop drilling would be cumbersome
4. **Vuex/Pinia**: For global state management

### Styling Guidelines

We follow these guidelines for component styling:

1. **Scoped Styles**: Use scoped styles for component-specific styling
2. **CSS Variables**: Use CSS variables for theming and consistent values
3. **BEM Methodology**: Follow BEM (Block, Element, Modifier) naming convention for CSS classes
4. **Utility Classes**: Use utility classes for common styling patterns

## 3. Core Architecture

### Routing and Navigation

- Implement Vue Router with a well-structured route configuration
- Create route guards for authentication and role-based access control
- Organize routes by feature/role for better maintainability

### State Management

- Implement Pinia for global state management
- Create separate stores for different domains (auth, inventory, notifications)
- Define clear actions, getters, and state structures

### API Integration Layer

- Create a services directory with a well-structured API client
- Implement service modules for different API endpoints
- Add request/response interceptors for error handling and authentication

### Real-Time Features

- Implement WebSocket connections for live data updates
- Create a reactive data layer for real-time inventory tracking
- Set up a notification system for alerts and updates

### AI-Driven Insights Module

- Create components for visualizing AI predictions and recommendations
- Implement interfaces for adjusting AI model parameters
- Add manual override capabilities for AI decisions

### Authentication and Security

- Implement login/logout functionality with JWT token storage
- Set up token refresh mechanism for persistent sessions
- Create role-based access control for different user types
- Add security best practices (Content Security Policy, CSRF protection, security headers)

## 4. Vue.js Style Guide

### Naming Conventions

- **Variables and Functions**: Use camelCase for variable and function names
  ```javascript
  const userData = {};
  function getUserData() {}
  ```
- **Components**: Use PascalCase for component names
  ```javascript
  import HelloWorld from './components/HelloWorld.vue';
  ```
- **Files**: Use kebab-case for file names
  ```
  hello-world.vue
  user-profile.vue
  ```
- **Constants**: Use UPPER_SNAKE_CASE for constants
  ```javascript
  const API_BASE_URL = 'https://api.example.com';
  ```

### Code Style

- Prefer `const` over `let` when variable values won't change
- Avoid `var` completely
- Use arrow functions for callbacks and anonymous functions
- Use template literals instead of string concatenation
- Use destructuring for objects and arrays
- Use spread/rest operators for cleaner code
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

### Functional vs Object-Oriented

- Prefer functional programming patterns where appropriate:
  - Use pure functions when possible
  - Avoid side effects in functions
  - Use array methods like `map`, `filter`, and `reduce` instead of loops
- Use classes only when they provide clear benefits for the use case

### Mutability

- Prefer immutable data structures
- Create new objects/arrays instead of mutating existing ones
- Use the spread operator for creating copies with modifications

### Component Structure

- Use Single File Components (SFC)
- Order of sections in components:
  1. `<script>`
  2. `<template>`
  3. `<style>`
- Keep components focused on a single responsibility

### Composition API

- Prefer Composition API with `<script setup>` for new components
- Use reactive references (`ref`, `reactive`) appropriately:
  ```javascript
  const count = ref(0);
  const user = reactive({
    name: 'John',
    email: 'john@example.com'
  });
  ```
- Extract reusable logic into composables

### Props

- Define prop types explicitly
- Use camelCase for prop names in JavaScript
- Use kebab-case for prop names in templates
- Provide default values for non-required props
- Use prop validation when necessary
  ```javascript
  defineProps({
    status: {
      type: String,
      required: true,
      validator: (value) => ['success', 'error', 'pending'].includes(value)
    }
  });
  ```

### Events

- Use kebab-case for event names
- Emit events with specific names that describe what happened
  ```javascript
  const emit = defineEmits(['update:modelValue', 'form-submitted']);
  ```

### Directives

- Use shorthand syntax for directives when possible:
  - `:` for `v-bind`
  - `@` for `v-on`
  - `#` for `v-slot`

### Conditional Rendering

- Use `v-if`/`v-else-if`/`v-else` for conditional rendering
- Use `v-show` when toggling visibility frequently

### List Rendering

- Always provide a unique `:key` with `v-for`
- Avoid using the index as a key unless the list is static
- Don't use `v-if` and `v-for` on the same element

### Component Communication

- Props for parent → child communication
- Events for child → parent communication
- Provide/inject for deep component hierarchies
- Pinia/Vuex for global state management

## 5. Best Practices

### Component Design

- Create small, reusable components
- Follow a component hierarchy:
  - Base/UI components (buttons, inputs)
  - Composite components (forms, cards)
  - Page/View components
- Use slots for flexible component composition

### State Management

- Use component state for local UI state
- Use composables for shared logic
- Consider Pinia/Vuex for complex global state

### Routing

- Organize routes by feature or page
- Use lazy loading for route components
- Implement route guards for authentication/authorization

### Common Pitfalls to Avoid

- Mutating props directly
- Using arrow functions in template expressions (affects `this` binding)
- Complex logic in templates (move to computed properties)
- Not using keys with `v-for`
- Deep nesting of components (consider composition)
- Large, monolithic components (break them down)
- Side effects in computed properties
- Forgetting to unsubscribe from event listeners

### Performance Considerations

- Use `computed` properties for derived state
- Implement `v-once` for static content
- Use `v-memo` for optimizing re-renders
- Lazy load components and routes
- Use `shallowRef` when deep reactivity isn't needed
- Consider using `defineAsyncComponent` for code splitting
