const timeToHour = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
};

const hoursToMinutes = (hours: string) => {
    return Math.round(parseFloat(hours) * 60);
};

const formatHour = (h:number) => {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const period = h < 12 ? "AM" : "PM";
    return `${hour12}:00 ${period}`;
};

const getWeekDays = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();

    const monday = new Date(d);
    monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));

    return Array.from({ length: 7 }, (_, i) => {
        const newDay = new Date(monday);
        newDay.setDate(monday.getDate() + i);
        return newDay;
    });
};

const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 domingo

    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const formatDayLabel = (date: Date) => {
    const formatted = date.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "short"
    });

    // Capitaliza solo la primera letra de toda la cadena
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const isSameDay = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

const formatDuration = (hours: string): string => {
    const totalMinutes = Math.round(parseFloat(hours) * 60);
    
    if (totalMinutes < 60) {
        return `${totalMinutes} min`;
    }

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (m === 0) {
        return `${h} hora${h > 1 ? 's' : ''}`;
    }

    return `${h} hora${h > 1 ? 's' : ''} ${m} min`;
};


export {
    timeToHour,
    hoursToMinutes,
    formatHour,
    getWeekDays,
    getStartOfWeek,
    formatDayLabel,
    isSameDay,
    formatDuration
}