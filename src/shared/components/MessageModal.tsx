import { Modal } from "react-bootstrap";
import Icon from "../ui/Icon";
import "../../app/styles/global.css"
import DraggableModalDialog from "./DraggableModalDialog";

interface MessageModalProps {
    type: string;
    message: string;
    show: boolean;
    onClose: () => void;
    onCloseCallback?: () => void;
}

const MessageModal = ({
    type = "success",
    message = "",
    onClose,
    show,
    onCloseCallback,
}: MessageModalProps) => {

    const handleClose = () => {
        onClose();
        if (onCloseCallback) onCloseCallback();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="sm"
            centered
            backdrop="static"
            style={{ zIndex: 1060 }}
            contentClassName="custom-modal"
            backdropClassName="modal-backdrop-top"
        >
            <Modal.Header closeButton>Alerta</Modal.Header>

            <Modal.Body>
                <div className="d-flex align-items-center justify-content-center gap-3 px-2">

                    <div style={{ flexShrink: 0 }}>
                        {type === "error" && (
                            <Icon name="FaExclamationTriangle" size={50} CStyle={{ color: "orange" }} />
                        )}
                        {type === "success" && (
                            <Icon name="FaCheckCircle" size={50} CStyle={{ color: "green" }} />
                        )}
                    </div>

                    <span style={{
                        fontSize: "15px",
                        wordBreak: "break-word",
                        width: "140px",
                        flex: "0 1 auto"
                    }}>
                        {message || "Texto de prueba"}
                    </span>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default MessageModal;