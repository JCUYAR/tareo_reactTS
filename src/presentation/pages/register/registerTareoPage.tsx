import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../../app/providers/AuthContext";
import { listTareoByUser } from "../../../infraestructure/api/tareoService";
import { formatDayLabel, formatDuration, formatHour, getWeekDays, hoursToMinutes, isSameDay, timeToHour } from "../../../app/helpers/timeHelpers";
import "../../../app/styles/registerT.css";
import RegisterModal from "./modals/registerModal";
import { useAlertModal } from "../../../app/providers/AlertModalContext";

const RegisterTareo: FC = () => {
    const { user } = useAuth();
    const { alertModal } = useAlertModal();

    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [tareos, setTareos] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [idTareo, setIdTareo] = useState<number | null>(null);
    const [idUserReg, setIdUserReg] = useState<number | null>(null);

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

    const resetModes = () => {
        setViewMode(false);
        setUpdateMode(false);
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
                {/* Es una mouseske herramienta misteriosa que nos ayudara mas tarde */}
                {/* <button
                    onClick={() => {
                        alertModal("success", "Tareo registrado correctamente")
                    }}
                >
                    Test Modal
                </button> */}
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
                                    isSameDay(
                                        new Date(t.work_date),
                                        new Date(day.setHours(0, 0, 0, 0))
                                    )
                                ).map(t => {
                                    const start = timeToHour(t.startTime);
                                    const end = timeToHour(t.endTime);
                                    const TOTAL_HOURS = 24;

                                    return (
                                        <div
                                            tabIndex={0}
                                            key={t.id}
                                            className="tareo-card"
                                            style={{
                                                left: `${(start / TOTAL_HOURS) * 100}%`,
                                                width: `${((end - start) / TOTAL_HOURS) * 100}%`,
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                setViewMode(true);
                                                setOpenModal(true);
                                                setIdTareo(t.id)
                                                setIdUserReg(t.user_id)
                                            }}
                                        >
                                            {t.description}
                                            <br />
                                            {formatDuration(t.totalHours)}
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
                        setOpenModal(false);
                        requestAnimationFrame(() => {
                            getTareoByUser();
                        });
                    }}
                    viewMode={viewMode}
                    updateMode={updateMode}
                    idTareo={idTareo}
                    idUserReg={idUserReg}
                    resetModes={resetModes}
                />
            }
        </>



    );

}

export default RegisterTareo;