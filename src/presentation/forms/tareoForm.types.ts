export interface TareoResponse {
    id: number;
    tareoCode: string;
    workDate: string;
    description: string;
    startTime: string;
    endTime: string;
    totalHour: string;
    username: string;
    category: string;
    area: string;
    status: string;    
}

export interface UpdtAddTareo {
    id: number | null;
    tareoCode: string | null;
    workDate: string | null;
    description: string;
    user_id: number | null;
    category: number | null;
    area: number | null;
    status: number | null;
    work_date: string;
    start_time: string;
    end_time: string;
    total_hours: string | null;
}