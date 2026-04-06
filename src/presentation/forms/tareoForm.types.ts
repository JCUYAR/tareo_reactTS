export interface TareoResponse {
    id: number;
    tareoCode: string;
    work_date: string;
    description: string;
    startTime: string;
    endTime: string;
    totalHour: string;
    user_id: string;
    category: string;
    area: string;
    status: string;    
}

export interface UpdtAddTareo {
    id: number | null;
    tareoCode: string | null;
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

export interface AddTareo {
    description: string;
    user_id: number | null;
    category: number | null;
    area: number | null;
    status: number | null;
    work_date: string;
    start_time: string;
    end_time: string;
}