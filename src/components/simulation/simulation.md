# Simulation Components

The Simulation module provides components for running, visualizing, and analyzing inventory and supply chain simulations to help optimize business operations.

## Components

### simulation-comparison.vue
Allows users to compare multiple simulation runs side by side, highlighting differences in parameters and outcomes to identify optimal strategies.

### simulation-controls-view.vue
The main view for simulation controls that integrates all simulation-related components into a cohesive interface. It provides access to parameters, scenarios, and results.

### simulation-history.vue
Displays a history of past simulation runs, allowing users to review previous simulations, their parameters, and results.

### simulation-parameters.vue
Provides interfaces for configuring simulation parameters such as time period, demand patterns, supply chain constraints, and other variables that affect the simulation.

### simulation-results.vue
Visualizes the results of simulation runs through charts, tables, and metrics. It helps users understand the outcomes and implications of different scenarios.

### simulation-scenarios.vue
Manages predefined simulation scenarios that users can select from or customize. These scenarios represent different business situations or strategies to evaluate.

## Usage

The Simulation components are used in the simulation section of the application, providing tools for what-if analysis, scenario planning, and decision support. These components help users understand how different variables and strategies might impact inventory levels, costs, and service levels.

Example workflow:
1. Configure simulation parameters using simulation-parameters.vue
2. Select or create a scenario with simulation-scenarios.vue
3. Run the simulation and view results in simulation-results.vue
4. Compare with other simulations using simulation-comparison.vue
5. Save the simulation to history for future reference