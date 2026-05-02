export interface Leave {
  id: number;
  user_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface LeaveRow {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: number; // derived
}