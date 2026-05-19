// ---- User / Account Status ----
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// ---- Subscription ----
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  PAST_DUE = 'PAST_DUE',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PlanTargetType {
  ESTATE_FULL = 'ESTATE_FULL',
  ESTATE_UNIT = 'ESTATE_UNIT',
  BUSINESS_STARTER = 'BUSINESS_STARTER',
  BUSINESS_GROWTH = 'BUSINESS_GROWTH',
  BUSINESS_ENTERPRISE = 'BUSINESS_ENTERPRISE',
}

// ---- Payment ----
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  EXTRA_PICKUP = 'EXTRA_PICKUP',
  ONE_TIME = 'ONE_TIME',
  MANUAL = 'MANUAL',
  REFUND = 'REFUND',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  VOID = 'VOID',
}

// ---- Schedule / Pickup ----
export enum PickupStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
}

export enum PickupType {
  REGULAR = 'REGULAR',
  EXTRA = 'EXTRA',
  MAKEUP = 'MAKEUP',
}

export enum TimeWindow {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export enum WasteType {
  GENERAL = 'GENERAL',
  RECYCLABLE = 'RECYCLABLE',
  ORGANIC = 'ORGANIC',
  HAZARDOUS = 'HAZARDOUS',
}

// ---- Complaint ----
export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ComplaintCategory {
  MISSED_PICKUP = 'MISSED_PICKUP',
  INCOMPLETE_COLLECTION = 'INCOMPLETE_COLLECTION',
  RUDE_COLLECTOR = 'RUDE_COLLECTOR',
  BILLING_ISSUE = 'BILLING_ISSUE',
  APP_ISSUE = 'APP_ISSUE',
  LATE_COLLECTION = 'LATE_COLLECTION',
  DAMAGE = 'DAMAGE',
  OTHER = 'OTHER',
}

// ---- Collector ----
export enum CollectorStatus {
  ACTIVE = 'ACTIVE',
  OFF_DUTY = 'OFF_DUTY',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  TRICYCLE = 'TRICYCLE',
  SMALL_TRUCK = 'SMALL_TRUCK',
  LARGE_TRUCK = 'LARGE_TRUCK',
}

// ---- Zone ----
export enum ZoneStatus {
  ACTIVE = 'ACTIVE',
  COMING_SOON = 'COMING_SOON',
  INACTIVE = 'INACTIVE',
}

export enum CollectionDay {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

// ---- Notification ----
export enum NotificationType {
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PICKUP_REMINDER = 'PICKUP_REMINDER',
  PICKUP_COMPLETED = 'PICKUP_COMPLETED',
  PICKUP_MISSED = 'PICKUP_MISSED',
  SUBSCRIPTION_ACTIVATED = 'SUBSCRIPTION_ACTIVATED',
  SUBSCRIPTION_EXPIRING = 'SUBSCRIPTION_EXPIRING',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  COMPLAINT_UPDATE = 'COMPLAINT_UPDATE',
  COMPLAINT_RESOLVED = 'COMPLAINT_RESOLVED',
  REFERRAL_REWARD = 'REFERRAL_REWARD',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  EXTRA_PICKUP_CONFIRMED = 'EXTRA_PICKUP_CONFIRMED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

// ---- Referral ----
export enum ReferralStatus {
  PENDING = 'PENDING',
  QUALIFIED = 'QUALIFIED',
  REWARDED = 'REWARDED',
  EXPIRED = 'EXPIRED',
}

// ---- Business ----
export enum BusinessType {
  MART = 'MART',
  SUPERMARKET = 'SUPERMARKET',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  SHOP = 'SHOP',
  SALON = 'SALON',
  RESTAURANT = 'RESTAURANT',
  CHURCH = 'CHURCH',
  MOSQUE = 'MOSQUE',
  HOTEL = 'HOTEL',
  FACTORY = 'FACTORY',
  CONSTRUCTION = 'CONSTRUCTION',
  PHARMACY = 'PHARMACY',
  GYM = 'GYM',
  OTHER = 'OTHER',
}

export enum WasteVolumeTier {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRA_LARGE = 'EXTRA_LARGE',
}

// ---- Account Type ----
export enum AccountType {
  ESTATE = 'ESTATE',
  BUSINESS = 'BUSINESS',
}

// ---- Collection Type ----
export enum CollectionType {
  FULL = 'FULL',
  UNIT = 'UNIT',
}
