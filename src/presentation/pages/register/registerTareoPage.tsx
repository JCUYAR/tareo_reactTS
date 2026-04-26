import { useEffect, useState, type FC } from "react";
import { useAuth } from "../../../app/providers/AuthContext";
import { listTareoByUser } from "../../../infraestructure/api/tareoService";
import { formatDayLabel, formatDuration, formatHour, getWeekDays, hoursToMinutes, isSameDay, timeToHour } from "../../../app/helpers/timeHelpers";
import "../../../app/styles/registerT.css";
import RegisterModal from "./modals/registerModal";
import { useAlertModal } from "../../../app/providers/AlertModalContext";
import Icon from "../../../shared/ui/Icon";

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

    // ✅ Estados para prefill del modal
    const [clickedDate, setClickedDate] = useState<Date | null>(null);
    const [clickedTime, setClickedTime] = useState<string>("");
    const [clickedEndTime, setClickedEndTime] = useState<string>("");

    const [dragState, setDragState] = useState<{
        day: Date;
        startX: number;
        currentX: number;
        trackWidth: number;
        trackLeft: number;
        active: boolean;
    } | null>(null);

    const xToTime = (x: number, trackWidth: number): number => {
        const percentage = Math.max(0, Math.min(1, x / trackWidth));
        const totalMinutes = percentage * 24 * 60;
        const rounded = Math.round(totalMinutes / 5) * 5;
        return rounded / 60; // en horas decimales
    };

    const timeToStr = (hourDecimal: number): string => {
        const h = Math.floor(hourDecimal);
        const m = Math.round((hourDecimal - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
        if ((e.target as HTMLElement).closest('.tareo-card')) return;
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        setDragState({
            day: new Date(day),
            startX: e.clientX - rect.left,
            currentX: e.clientX - rect.left,
            trackWidth: rect.width,
            trackLeft: rect.left,
            active: true,
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragState?.active) return;
        setDragState(prev => prev ? {
            ...prev,
            currentX: e.clientX - prev.trackLeft
        } : null);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragState?.active) return;

        const { startX, currentX, trackWidth, day } = dragState;
        const delta = Math.abs(currentX - startX);

        if (delta < 5) {
            // ✅ click simple — solo inyecta fecha, sin hora
            setClickedDate(day);
            setClickedTime("");      // ✅ sin hora de inicio
            setClickedEndTime("");   // ✅ sin hora de fin
            setDragState(null);
            openRegModal();
            return;
        }

        // ✅ drag real — inyecta fecha + rango horario
        const from = xToTime(Math.min(startX, currentX), trackWidth);
        const to = xToTime(Math.max(startX, currentX), trackWidth);
        setClickedDate(day);
        setClickedTime(timeToStr(from));
        setClickedEndTime(timeToStr(to));
        setDragState(null);
        openRegModal();
    };

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

    const goToday = () => setCurrentWeekDate(new Date());

    const openRegModal = () => setOpenModal(true);

    const getTareoByUser = async () => {
        if (user) {
            const response = await listTareoByUser(user.id);
            setTareos(response.data);
        }
    };

    const resetModes = () => {
        setViewMode(false);
        setUpdateMode(false);
        setClickedDate(null);
        setClickedTime("");
        setClickedEndTime(""); // ✅
    };

    // ✅ Calcula la hora según posición X del click
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>, day: Date) => {
        if ((e.target as HTMLElement).closest('.tareo-card')) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const hour = percentage * 24;

        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        setClickedDate(new Date(day));
        setClickedTime(timeStr);
        openRegModal();
    };

    useEffect(() => {
        if (user != null && !isLoad) {
            getTareoByUser();
            if (tareos != null) setIsLoad(true);
        }
    }, [user]);

    return (
        <>
            <div className="calendar-toolbar">
                <button className="buttonWeekBar" onClick={goPreviousWeek}>
                    <Icon name="FaAngleLeft" size={20} CStyle={{ color: "white" }} />
                </button>
                <button className="buttonWeekBar" onClick={goToday}>Semana actual</button>
                <button className="buttonWeekBar" onClick={goNextWeek}>
                    <Icon name="FaAngleRight" size={20} CStyle={{ color: "white" }} />
                </button>
                <button className="buttonWeekBar" onClick={openRegModal}>
                    Agregar
                    <Icon name="FaPlus" size={15} CStyle={{ color: "white", marginLeft: "5px", marginBottom: "2px" }} />
                </button>
                {/* <button onClick={() => alertModal("success", "Tareo registrado correctamente")}>
                    Test Modal
                </button> */}
            </div>

            <div className="calendar">

                {/* HEADER HORAS */}
                <div className="hours">
                    <div className="hour-spacer"></div>
                    {hours.map(h => (
                        <div key={h} className="hour">{formatHour(h)}</div>
                    ))}
                </div>

                {/* FILAS DIAS */}
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="day-row">

                        <div className="day-label">
                            {formatDayLabel(day)}
                        </div>

                        {/* ✅ Click en espacio vacío abre modal con fecha y hora */}
                        <div
                            className="day-track"
                            onMouseDown={(e) => handleMouseDown(e, day)}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            {dragState?.active && 
                                isSameDay(dragState.day, new Date(day.setHours(0,0,0,0))) &&
                                Math.abs(dragState.currentX - dragState.startX) > 5 &&
                                (() => {
                                    const TOTAL_HOURS = 24;
                                    const from = xToTime(Math.min(dragState.startX, dragState.currentX), dragState.trackWidth);
                                    const to = xToTime(Math.max(dragState.startX, dragState.currentX), dragState.trackWidth);
                                    return (
                                        <div
                                            className="drag-selection"
                                            style={{
                                                left: `${(from / TOTAL_HOURS) * 100}%`,
                                                width: `${((to - from) / TOTAL_HOURS) * 100}%`,
                                            }}
                                        />
                                    );
                            })()}
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
                                                setIdTareo(t.id);
                                                setIdUserReg(t.user_id);
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
                        requestAnimationFrame(() => getTareoByUser());
                    }}
                    viewMode={viewMode}
                    updateMode={updateMode}
                    idTareo={idTareo}
                    idUserReg={idUserReg}
                    resetModes={resetModes}
                    prefilledDate={clickedDate}
                    prefilledTime={clickedTime}
                    prefilledEndTime={clickedEndTime}
                />
            }
        </>
    );
};

export default RegisterTareo;