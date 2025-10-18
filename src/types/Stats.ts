export interface RuleStatusItem {
  label: string;
  value: number;
}

export interface RulesPerMonthItem {
  month: string;
  count: number;
}

export interface Stats {
  users: number;
  files: number;
  filesAllTime: number;
  changes: number;
  notifications: string;
  rulesPerMonth: RulesPerMonthItem[];
  onlineUsersPerDay: number[];
  ruleStatus: RuleStatusItem[];
  successDay: number;
  successMonth: number;
}
