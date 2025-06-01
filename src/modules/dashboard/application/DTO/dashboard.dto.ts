export interface SalesAnalyticsQueryDto {
  startDate: string;
  endDate: string;
}

export interface DashboardResponseDto {
  success: boolean;
  data: any;
  message?: string;
} 