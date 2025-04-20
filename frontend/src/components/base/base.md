# Base Components

The Base components provide fundamental UI building blocks that are used throughout the application. These components ensure consistency in design and behavior across the application.

## Components

### base-button.vue
A reusable button component with consistent styling and behavior. Supports different variants (primary, secondary, etc.), sizes, and states (disabled, loading).

### base-card.vue
A container component that provides a consistent card layout with optional header, footer, and various styling options.

### base-tabs.vue
A tabbed interface component that allows users to switch between different content sections within the same view.

## Usage

Base components should be used whenever possible instead of creating custom UI elements. This ensures a consistent look and feel across the application and makes it easier to implement design changes globally.

Example:
```vue
<base-card title="User Information">
  <template #content>
    <p>User details go here</p>
  </template>
  <template #footer>
    <base-button variant="primary">Save</base-button>
    <base-button variant="secondary">Cancel</base-button>
  </template>
</base-card>
```