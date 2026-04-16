export interface Deal {
  deal_id: string;
  company_name: string;
  industry: string;
  rep_name: string;
  lead_source: string;
  product_line: string;
  deal_stage: string;
  deal_value: number;
  created_date: string;
  close_date: string;
  days_in_stage: number;
  last_activity_days_ago: number;
  probability_pct: number;
  competitor_mentioned: string;
  num_stakeholders: number;
  next_action: string;
}
