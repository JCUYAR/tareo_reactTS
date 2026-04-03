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

const getWeekDay = (date: string) => {
    const d = new Date(date);

    const day = d.getDay(); // 0 domingo

    const map: Record<number, string> = {
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes"
    };

    return map[day];
};

export {
    timeToHour,
    hoursToMinutes,
    formatHour,
    getWeekDay
}