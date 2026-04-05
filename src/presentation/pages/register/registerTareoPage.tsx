import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../../app/providers/AuthContext";
import { listTareoByUser } from "../../../infraestructure/api/tareoService";
import { formatDayLabel, formatHour, getWeekDays, hoursToMinutes, isSameDay, timeToHour } from "../../../app/helpers/timeHelpers";
import "../../../app/styles/registerT.css";
import RegisterModal from "./modals/registerModal";

const RegisterTareo: FC = () => {
    const { user } = useAuth();

    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [tareos, setTareos] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [viewMode, setViewMode] = useState<boolean>(false);
    const [updateMode, setUpdateMode] = useState<boolean>(false);


    const weekDays = getWeekDays(currentWeekDate);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const goPreviousWeek = () => {
        setCurrentWeekDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };

    const goNextWeek = () => {
        setCurrentWeekDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    const goToday = () => {
        setCurrentWeekDate(new Date());
    };

    const openRegModal = () => {
        setOpenModal(true);
    }

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
        <>
            <div className="calendar-toolbar">

                <button onClick={goPreviousWeek}>
                    ◀ Semana anterior
                </button>

                <button onClick={goToday}>
                    Hoy
                </button>

                <button onClick={goNextWeek}>
                    Semana siguiente ▶
                </button>
                <button
                    onClick={() => {
                        openRegModal()
                    }}
                >
                    Agregar
                </button>

            </div>

            <div className="calendar">

                {/* HEADER HORAS */}
                <div className="hours">

                    <div className="hour-spacer"></div>

                    {hours.map(h => (
                        <div key={h} className="hour">
                            {formatHour(h)}
                        </div>
                    ))}

                </div>

                {/* FILAS DIAS */}
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="day-row">

                        <div className="day-label">
                            {formatDayLabel(day)}
                        </div>

                        <div className="day-track">

                            {tareos
                                .filter(t =>
                                    isSameDay(new Date(t.workDate), day)
                                ).map(t => {

                                    const start = timeToHour(t.startTime);
                                    const end = timeToHour(t.endTime);

                                    return (
                                        <div
                                            key={t.id}
                                            className="tareo-card"
                                            style={{
                                                gridColumn: `${Math.floor(start) + 1} / ${Math.ceil(end) + 1}`
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
            {openModal && 
                <RegisterModal
                    onOpen={openModal}
                    onCloseM={() => {
                        console.log("El pepe")
                        setOpenModal(false);
                    }}
                    viewMode={viewMode}
                    updateMode={updateMode}
                />
            }
        </>



    );

}

export default RegisterTareo;