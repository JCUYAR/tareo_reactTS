import {
    createContext,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";
import MessageModal from "../../shared/components/MessageModal";



type AlertType = "success" | "error";

interface AlertContextProps {
    alertModal: (type: AlertType, message: string, onCloseCallback?: () => void) => void;
}

const AlertModalContext = createContext<AlertContextProps | null>(null);

export const AlertModalProvider = ({ children }: { children: ReactNode }) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState<AlertType>("success");
    const [message, setMessage] = useState("");
    const onCloseCallbackRef = useRef<(() => void) | undefined>(undefined);

    const alertModal = (type: AlertType, message: string, onCloseCallback?: () => void) => {
        setType(type);
        setMessage(message);
        onCloseCallbackRef.current = onCloseCallback;
        setShow(true);

        // ⏱ autocerrar en 5 segundos
        setTimeout(() => {
            setShow(false);
            onCloseCallbackRef.current?.();
        }, 5000);
    };

    const handleClose = () => {
        setShow(false);
        onCloseCallbackRef.current?.();
    }

    return (
        <AlertModalContext.Provider value={{ alertModal }}>
            {children}

            {/* Modal GLOBAL */}
            <MessageModal
                type={type}
                message={message}
                show={show}
                onClose={handleClose}
                onCloseCallback={onCloseCallbackRef.current}
            />
        </AlertModalContext.Provider>
    );
};

export const useAlertModal = () => {
    const context = useContext(AlertModalContext);

    if (!context)
        throw new Error("useAlertModal must be used inside AlertModalProvider");

    return context;
};