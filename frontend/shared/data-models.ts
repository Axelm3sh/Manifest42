// ================================
// Nominal & Common Types
// ================================

/**
 * Utility for creating nominal (branded) types to prevent mixing distinct IDs.
 */
export type Brand<K, T> = K & { __brand: T };

export type RoleId = Brand<string, 'RoleId'>;
export type UserId = Brand<string, 'UserId'>;
export type NotificationId = Brand<string, 'NotificationId'>;
export type WarehouseId = Brand<string, 'WarehouseId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type InventoryItemId = Brand<string, 'InventoryItemId'>;
export type StockAlertId = Brand<string, 'StockAlertId'>;
export type KPISettingId = Brand<string, 'KPISettingId'>;
export type RestockRequestId = Brand<string, 'RestockRequestId'>;
export type ApprovalId = Brand<string, 'ApprovalId'>;
export type ProductId = Brand<string, 'ProductId'>;
export type OrderId = Brand<string, 'OrderId'>;
export type OrderItemId = Brand<string, 'OrderItemId'>;
export type ShipmentId = Brand<string, 'ShipmentId'>;
export type ShipmentEventId = Brand<string, 'ShipmentEventId'>;
export type VehicleId = Brand<string, 'VehicleId'>;
export type DemandHeatmapId = Brand<string, 'DemandHeatmapId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type MessageId = Brand<string, 'MessageId'>;
export type TaskId = Brand<string, 'TaskId'>;

/**
 * ISO 8601 date-time string representation.
 */
export type ISODateString = string & { __brand: 'ISODateString' };

// ================================
// Database Entities (Core Domain Models)
// ================================

/** Roles define user permissions and access levels. */
export interface Role {
    /** Unique identifier for the role */
    roleId: RoleId;
    /** Human-friendly role name */
    roleName: string;
    /** Optional description of responsibilities */
    roleDescription?: string;
}

/** User account and authentication data. */
export interface User {
    userId: UserId;                    // Unique user identifier
    userName: string;                  // Login name
    profilePictureUrl?: string;        // Optional avatar URL
    passwordHash: string;              // Secure password hash
    roleId: RoleId;                    // FK to Role
    settings: UserSettings;            // User preferences
}

/** Per-user configuration settings. */
export interface UserSettings {
    /** Notification preferences */
    notificationPreferences: NotificationPreferences;
    /** Inventory view refresh interval in seconds */
    inventoryRefreshIntervalSec: number;
    /** UI theme preference */
    themePreference?: 'light' | 'dark' | 'system';
}

/** Controls how notifications are delivered. */
export interface NotificationPreferences {
    inApp: boolean;                                   // Show in-app
    email?: boolean;                                  // Send email
    frequency: 'Immediate' | 'Hourly' | 'Daily';       // Email cadence
}

/** User-targeted alerts (e.g., restock approvals). */
export interface Notification {
    id: NotificationId;         // Notification ID
    userId: UserId;             // Recipient
    message: string;            // Content text
    type: 'Info' | 'Warning' | 'Error';
    createdAt: ISODateString;   // ISO timestamp
    isRead: boolean;
}

/** Physical storage locations. */
export interface Warehouse {
    id: WarehouseId;
    name: string;
    location: string;
    capacity: number;
}

/** Item categorization within inventory. */
export interface Category {
    id: CategoryId;
    name: string;
}

/** Core inventory items. */
export interface InventoryItem {
    id: InventoryItemId;
    sku: string;
    name: string;
    description?: string;
    category: CategoryId;
    stockLevel: number;
    reorderPoint: number;
    unitPrice: number;
    totalValue: number;
    warehouseId: WarehouseId;
    lastActivity: ISODateString;
}

/** Alerts generated when stock thresholds are crossed. */
export interface InventoryStockAlert {
    id: StockAlertId;
    itemId: InventoryItemId;
    warehouseId: WarehouseId;
    alertType: 'LowStock' | 'Overstock';
    createdAt: ISODateString;
    status: 'Open' | 'Resolved';
}

/** Key performance metric configuration. */
export interface KPISetting {
    id: KPISettingId;
    metricName: string;
    displayOrder: number;
}

/** Settings for the inventory dashboard. */
export interface InventorySettings {
    id: string;                    // Settings ID
    refreshIntervalSec: number;
    kpiMetrics: KPISetting[];
}

/** Workflow for requesting restock. */
export interface RestockRequest {
    id: RestockRequestId;
    itemId: InventoryItemId;
    warehouseId: WarehouseId;
    quantityRequested: number;
    requestedBy: UserId;
    createdAt: ISODateString;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvals: Approval[];
}

/** Individual approval decision for a restock request. */
export interface Approval {
    id: ApprovalId;
    restockRequestId: RestockRequestId;
    approverId: UserId;
    role: Role['roleName'];
    status: 'Approved' | 'Rejected';
    decisionAt: ISODateString;
}

/** Product master data. */
export interface Product {
    productId: ProductId;
    productName: string;
    quantityAvailable: number;
    unitPrice: number;
}

/** Order status enumeration. */
export enum OrderStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled'
}

/** Customer orders. */
export interface Order {
    orderId: OrderId;
    createdAt: ISODateString;
    orderStatus: OrderStatus;
    userId: UserId;
    shipmentId?: ShipmentId;
    items: OrderItem[];
}

/** Line items within an order. */
export interface OrderItem {
    orderItemId: OrderItemId;
    orderId: OrderId;
    productId: ProductId;
    quantity: number;
}

/** Shipment header data. */
export interface Shipment {
    shipmentId: ShipmentId;
    shipmentDate: ISODateString;
    vehicleId?: VehicleId;
    events: ShipmentEvent[];
}

/** Individual shipping event. */
export interface ShipmentEvent {
    eventId: ShipmentEventId;
    shipmentId: ShipmentId;
    timestamp: ISODateString;
    location: string;
    description: string;
}

/** Transport assets. */
export interface Vehicle {
    vehicleId: VehicleId;
    vehicleType: string;
    capacity: number;
    status: string;
}

/** Demand visualization data. */
export interface DemandHeatmap {
    id: DemandHeatmapId;
    areaCode: string;
    itemId: InventoryItemId;
    intensity: number;
    generatedAt: ISODateString;
}

/** Global configuration key/value. */
export interface GlobalSettings {
    id: string;
    key: string;
    value: unknown;
    updatedAt: ISODateString;
}


// ================================
// Analytics & Simulation Models
// ================================

/** Parameters driving a simulation run. */
export interface SimulationParameters {
    demandVariability: number;
    orderQuantity: number;
    leadTime: number;
    reorderPoint: number;
    initialStock: number;
    simulationDuration: number;
    seasonalityEnabled: boolean;
    externalFactorsEnabled: boolean;
}

/** Aggregated results of a simulation. */
export interface SimulationSummary {
    averageStockLevel: number;
    totalDemand: number;
    totalOrders: number;
    stockoutDays: number;
    serviceLevel: number;
    inventoryTurnover: number;
    averageOrderCycle: number;
}

/** Single point in a time series. */
export interface DataPoint {
    day: number;
    value: number;
}

/** Recorded run of a simulation. */
export interface SimulationRun<P = unknown> {
    runId: string;
    scenarioId: string;
    timestamp: ISODateString;
    parameters: P;
    summary: SimulationSummary;
    stockLevelOverTime: DataPoint[];
    demandOverTime: DataPoint[];
}

/** Defined scenario template. */
export interface SimulationScenario {
    scenarioId: string;
    name: string;
    parameters: SimulationParameters;
}

/** Consolidated simulation domain object. */
export interface Simulation {
    currentScenario: SimulationScenario;
    savedScenarios: SimulationScenario[];
    history: SimulationRun<SimulationParameters>[];
}

/** Generic report payload. */
export interface Report<T = unknown> {
    id: string;
    name: string;
    generatedBy: UserId;
    parameters: Record<string, unknown>;
    createdAt: ISODateString;
    data: T;
}


// ================================
// Frontend Dashboard Models & Actions
// ================================

/** KPIs for the Analyst dashboard. */
export interface AnalystKPI {
    activeSimulations: number;
    activeSimulationsChange?: number;
    completedReports: number;
    completedReportsChange?: number;
    dataAccuracy: number;
    dataAccuracyChange?: number;
    predictionsGenerated: number;
    predictionsGeneratedChange?: number;
}

export enum AnalystQuickActionType {
    CreateSimulation = 'create_simulation',
    GenerateReport = 'generate_report',
    AnalyzeTrends = 'analyze_trends',
    ViewInventory = 'view_inventory'
}

/** Quick actions available to the Analyst. */
export interface AnalystQuickAction {
    type: AnalystQuickActionType;
    label: string;
}

/** Summary of a recent simulation. */
export interface RecentSimulationSummary {
    simulationId: string;
    name: string;
    description: string;
    status: 'in_progress' | 'completed';
    progress?: number;
    timestamp: ISODateString;
}

/** Summary of a recent report. */
export interface RecentReportSummary {
    reportId: string;
    title: string;
    summary: string;
    timestamp: ISODateString;
}

/** Aggregated data for the Analyst dashboard view. */
export interface AnalystDashboard {
    kpis: AnalystKPI;
    recentSimulations: RecentSimulationSummary[];
    recentReports: RecentReportSummary[];
    quickActions: AnalystQuickAction[];
}

// ================================
// Logistics Dashboard Models
// ================================

/** KPIs for the Logistics dashboard. */
export interface LogisticsKPI {
    pendingShipments: number;
    pendingShipmentsChange?: number;
    inTransit: number;
    inTransitChange?: number;
    deliveredToday: number;
    deliveredTodayChange?: number;
    stockoutRisk: number;
    stockoutRiskChange?: number;
}

export enum LogisticsQuickActionType {
    CreateShipment = 'create_shipment',
    ScheduleDelivery = 'schedule_delivery',
    InventoryCount = 'inventory_count',
    GenerateReport = 'generate_report'
}

/** Quick actions available to Logistics. */
export interface LogisticsQuickAction {
    type: LogisticsQuickActionType;
    label: string;
}

export type ShipmentPriority = 'high' | 'medium' | 'low';

/** Summary card for recent shipments. */
export interface RecentShipmentSummary {
    shipmentId: ShipmentId;
    locationName: string;
    itemsCount: number;
    priority: ShipmentPriority;
    estimatedDelivery: ISODateString;
    status: OrderStatus;
}

export enum AlertLevel {
    Critical = 'critical',
    Warning = 'warning'
}

/** Inventory alerts for Logistics. */
export interface LogisticsInventoryAlert {
    id: StockAlertId;
    productName: string;
    sku: string;
    currentStock: number;
    safetyThreshold: number;
    alertLevel: AlertLevel;
    projectedStockoutDays?: number;
}

/** Aggregated data for the Logistics dashboard view. */
export interface LogisticsDashboard {
    kpis: LogisticsKPI;
    quickActions: LogisticsQuickAction[];
    recentShipments: RecentShipmentSummary[];
    inventoryAlerts: LogisticsInventoryAlert[];
}

// ================================
// Manager Dashboard Models
// ================================

/** KPIs for the Manager dashboard. */
export interface ManagerKPI {
    pendingApprovals: number;
    pendingApprovalsChange?: number;
    inventoryAlerts: number;
    inventoryAlertsChange?: number;
    teamPerformance: number;
    teamPerformanceChange?: number;
    costSavings: number;
    costSavingsChange?: number;
}

export enum ManagerQuickActionType {
    ViewInventory = 'view_inventory',
    ManageApprovals = 'manage_approvals',
    ViewReports = 'view_reports',
    ViewNotifications = 'view_notifications'
}

/** Quick actions available to Managers. */
export interface ManagerQuickAction {
    type: ManagerQuickActionType;
    label: string;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

/** Summary of pending approvals by priority. */
export interface PendingApprovalsSummary {
    priority: PriorityLevel;
    count: number;
}

/** Team performance overview. */
export interface TeamPerformanceSummary {
    averagePerformance: number;
    teamMembers: number;
    onlineNow: number;
}

/** Aggregated data for the Manager dashboard view. */
export interface ManagerDashboard {
    kpis: ManagerKPI;
    quickActions: ManagerQuickAction[];
    pendingApprovals: PendingApprovalsSummary[];
    teamPerformance: TeamPerformanceSummary;
}

// ================================
// Admin Dashboard Models & Actions
// ================================

/** KPIs for the Admin dashboard. */
export interface AdminKPI {
    totalUsers: number;
    totalUsersChange?: number;
    pendingApprovals: number;
    pendingApprovalsChange?: number;
    systemAlerts: number;
    systemAlertsChange?: number;
    inventoryItems: number;
    inventoryItemsChange?: number;
}

export enum AdminQuickActionType {
    ManageUsers = 'manage_users',
    ManageSettings = 'manage_settings',
    ManageInventory = 'manage_inventory'
}

/** Quick actions available to Admins. */
export interface AdminQuickAction {
    type: AdminQuickActionType;
    label: string;
}

/** Overall system health and status. */
export enum SystemHealth {
    Optimal = 'Optimal',
    Degraded = 'Degraded',
    Down = 'Down'
}

/** System status panel data. */
export interface SystemStatus {
    usersOnline: number;
    pendingApprovals: number;
    systemHealth: SystemHealth;
    lastBackup: ISODateString;
}

/** Audit log entries for admin activity feed. */
export interface RecentActivityEntry {
    userName: string;
    action: string;
    details?: string;
    timestamp: ISODateString;
}

/** Aggregated data for the Admin dashboard view. */
export interface AdminDashboard {
    kpis: AdminKPI;
    quickActions: AdminQuickAction[];
    systemStatus: SystemStatus;
    recentActivities: RecentActivityEntry[];
}

// ================================
// Chat & Agent Task Queue Models
// ================================

/** Chat session context between a user and the AI agent. */
export interface ChatSession {
    sessionId: SessionId;
    userId: UserId;
    createdAt: ISODateString;
    lastUpdated: ISODateString;
    isActive: boolean;
    messages: ChatMessage[];
    queuedTasks: QueuedTask<unknown, unknown>[];
}

/** Single chat message entry. */
export interface ChatMessage<M = string> {
    messageId: MessageId;
    sessionId: SessionId;
    senderId: UserId | 'agent';
    senderRole: 'user' | 'agent' | 'system';
    timestamp: ISODateString;
    content: M;
    chainOfThought?: string[];
    messageType?: 'text' | 'action_request';
    metadata?: Record<string, unknown>;
}

/** Agent-queued task definition with parameters/result generics. */
export interface QueuedTask<P = unknown, R = unknown> {
    taskId: TaskId;
    sessionId: SessionId;
    description: string;
    actionType: string;
    parameters: P;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    createdAt: ISODateString;
    updatedAt: ISODateString;
    result?: R;
}

/** Global settings for chat/task management. */
export interface ChatSettings {
    maxQueuedTasksPerSession: number;
    taskTimeoutSec: number;
    enableChainOfThought: boolean;
}
