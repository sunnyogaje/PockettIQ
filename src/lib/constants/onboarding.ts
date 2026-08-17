export const INCOME_FREQUENCY_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "BIWEEKLY", label: "Biweekly" },
  { value: "IRREGULAR", label: "Irregular" },
] as const

export const PAYDAY_TYPE_OPTIONS = [
  { value: "DAY_OF_MONTH", label: "Day of month" },
  { value: "SPECIFIC_DATE", label: "Specific date" },
  { value: "NOT_FIXED", label: "Not fixed" },
] as const

export const FINANCIAL_GOAL_OPTIONS = [
  { value: "SAVE_MORE", label: "Save more" },
  { value: "CONTROL_SPENDING", label: "Control spending" },
  { value: "BUILD_EMERGENCY_FUND", label: "Build emergency fund" },
  { value: "PAY_OFF_DEBT", label: "Pay off debt" },
  { value: "TRACK_MY_MONEY", label: "Track my money" },
  { value: "SAVE_FOR_SOMETHING_SPECIFIC", label: "Save for something specific" },
] as const
