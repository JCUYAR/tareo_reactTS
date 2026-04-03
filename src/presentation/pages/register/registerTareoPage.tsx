import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../../app/providers/AuthContext";
import { listTareoByUser } from "../../../infraestructure/api/tareoService";
import { formatHour, getWeekDay, hoursToMinutes, timeToHour } from "../../../app/helpers/timeHelpers";
import "../../../app/styles/registerT.css";

const RegisterTareo: FC = () => {
    const { user, logout } = useAuth();

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [tareos, setTareos] = useState<any[]>([]);

    const weekDays = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes"
    ];

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getTareoByUser = async () => {
        if (user) {
            const response = await listTareoByUser(user.id)
            setTareos(response.data);
        }
    }

    useEffect(() => {
        if (user != null && !isLoad) {
            getTareoByUser();
            if (tareos != null) {
                setIsLoad(true);
            }
        }

    }, [user])


    return (
        <div className="calendar">

            {/* HEADER HORAS */}
            <div className="hours">
                {hours.map(h => (
        <div key={h} className="hour">
            {formatHour(h)}
        </div>
    ))}

            </div>

            {/* FILAS DIAS */}
            {weekDays.map(day => (
                <div key={day} className="day-row">

                    <div className="day-label">
                        {day}
                    </div>

                    <div className="day-track">

                        {tareos
                            .filter(t => getWeekDay(t.workDate) === day)
                            .map(t => {

                                const start = timeToHour(t.startTime);
                                const end = timeToHour(t.endTime);

                                return (
                                    <div
                                        key={t.id}
                                        className="tareo-card"
                                        style={{
                                            left: `${(start / 24) * 100}%`,
                                            width: `${((end - start) / 24) * 100}%`
                                        }}
                                    >
                                        {t.description}
                                        <br />
                                        {hoursToMinutes(t.totalHours)} min
                                    </div>
                                );
                            })}

                    </div>

                </div>
            ))}
        </div>
    );

}

export default RegisterTareo;