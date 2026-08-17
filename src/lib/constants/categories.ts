export type DefaultCategory = {
  name: string
  icon: string
  group: string
  type: "INCOME" | "EXPENSE"
}

// Icon values are lucide-react icon names, resolved by <CategoryIcon>.
export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategory[] = [
  // Food
  { name: "Groceries", icon: "shopping-basket", group: "Food", type: "EXPENSE" },
  { name: "Restaurant", icon: "utensils", group: "Food", type: "EXPENSE" },
  { name: "Fast Food", icon: "sandwich", group: "Food", type: "EXPENSE" },
  { name: "Snacks", icon: "cookie", group: "Food", type: "EXPENSE" },
  { name: "Drinks", icon: "cup-soda", group: "Food", type: "EXPENSE" },
  { name: "Food Delivery", icon: "bike", group: "Food", type: "EXPENSE" },

  // Transport
  { name: "Fuel", icon: "fuel", group: "Transport", type: "EXPENSE" },
  { name: "Bus", icon: "bus", group: "Transport", type: "EXPENSE" },
  { name: "Taxi", icon: "car-taxi-front", group: "Transport", type: "EXPENSE" },
  { name: "Ride-hailing", icon: "car", group: "Transport", type: "EXPENSE" },
  { name: "Motorcycle", icon: "bike", group: "Transport", type: "EXPENSE" },
  { name: "Transport Other", icon: "map-pin", group: "Transport", type: "EXPENSE" },

  // Bills
  { name: "Electricity", icon: "zap", group: "Bills", type: "EXPENSE" },
  { name: "Water", icon: "droplet", group: "Bills", type: "EXPENSE" },
  { name: "Internet", icon: "wifi", group: "Bills", type: "EXPENSE" },
  { name: "Airtime", icon: "phone", group: "Bills", type: "EXPENSE" },
  { name: "Data", icon: "signal", group: "Bills", type: "EXPENSE" },
  { name: "Cable TV", icon: "tv", group: "Bills", type: "EXPENSE" },
  { name: "Rent", icon: "home", group: "Bills", type: "EXPENSE" },
  { name: "Waste", icon: "trash-2", group: "Bills", type: "EXPENSE" },
  { name: "Other Bills", icon: "receipt", group: "Bills", type: "EXPENSE" },

  // Family
  { name: "Parents", icon: "users", group: "Family", type: "EXPENSE" },
  { name: "Siblings", icon: "users", group: "Family", type: "EXPENSE" },
  { name: "Children", icon: "baby", group: "Family", type: "EXPENSE" },
  { name: "Family Support", icon: "heart-handshake", group: "Family", type: "EXPENSE" },
  { name: "Gifts", icon: "gift", group: "Family", type: "EXPENSE" },

  // Personal
  { name: "Clothing", icon: "shirt", group: "Personal", type: "EXPENSE" },
  { name: "Beauty", icon: "sparkles", group: "Personal", type: "EXPENSE" },
  { name: "Personal Care", icon: "smile", group: "Personal", type: "EXPENSE" },
  { name: "Electronics", icon: "smartphone", group: "Personal", type: "EXPENSE" },
  { name: "Shopping", icon: "shopping-bag", group: "Personal", type: "EXPENSE" },

  // Entertainment
  { name: "Movies", icon: "clapperboard", group: "Entertainment", type: "EXPENSE" },
  { name: "Games", icon: "gamepad-2", group: "Entertainment", type: "EXPENSE" },
  { name: "Events", icon: "party-popper", group: "Entertainment", type: "EXPENSE" },
  { name: "Streaming", icon: "monitor-play", group: "Entertainment", type: "EXPENSE" },
  { name: "Socialising", icon: "users-round", group: "Entertainment", type: "EXPENSE" },

  // Education
  { name: "School Fees", icon: "graduation-cap", group: "Education", type: "EXPENSE" },
  { name: "Books", icon: "book-open", group: "Education", type: "EXPENSE" },
  { name: "Courses", icon: "laptop", group: "Education", type: "EXPENSE" },
  { name: "Training", icon: "presentation", group: "Education", type: "EXPENSE" },

  // Health
  { name: "Medication", icon: "pill", group: "Health", type: "EXPENSE" },
  { name: "Hospital", icon: "stethoscope", group: "Health", type: "EXPENSE" },
  { name: "Dental", icon: "smile", group: "Health", type: "EXPENSE" },
  { name: "Medical", icon: "cross", group: "Health", type: "EXPENSE" },

  // Religion & Giving
  { name: "Church", icon: "church", group: "Religion & Giving", type: "EXPENSE" },
  { name: "Mosque", icon: "moon-star", group: "Religion & Giving", type: "EXPENSE" },
  { name: "Charity", icon: "hand-heart", group: "Religion & Giving", type: "EXPENSE" },
  { name: "Donations", icon: "gift", group: "Religion & Giving", type: "EXPENSE" },

  // Finance
  { name: "Debt Repayment", icon: "credit-card", group: "Finance", type: "EXPENSE" },
  { name: "Savings", icon: "piggy-bank", group: "Finance", type: "EXPENSE" },
  { name: "Investment", icon: "trending-up", group: "Finance", type: "EXPENSE" },

  // Other
  { name: "Miscellaneous", icon: "ellipsis", group: "Other", type: "EXPENSE" },
]

export const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: "Salary", icon: "briefcase", group: "Income", type: "INCOME" },
  { name: "Business", icon: "store", group: "Income", type: "INCOME" },
  { name: "Freelance", icon: "laptop", group: "Income", type: "INCOME" },
  { name: "Allowance", icon: "wallet", group: "Income", type: "INCOME" },
  { name: "Gift", icon: "gift", group: "Income", type: "INCOME" },
  { name: "Refund", icon: "rotate-ccw", group: "Income", type: "INCOME" },
  { name: "Other", icon: "ellipsis", group: "Income", type: "INCOME" },
]

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
]

// Options offered during onboarding step 2 ("How do you usually receive money?")
export const INCOME_SOURCE_OPTIONS = [
  "Salary",
  "Business",
  "Freelance",
  "Allowance",
  "Pension",
  "Multiple sources",
  "Other",
] as const
