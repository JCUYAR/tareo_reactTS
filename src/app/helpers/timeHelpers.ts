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


const formatDayLabel = (date: Date) =>
    date.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "short"
});

const isSameDay = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

export {
    timeToHour,
    hoursToMinutes,
    formatHour,
    getWeekDays,
    getStartOfWeek,
    formatDayLabel,
    isSameDay
}