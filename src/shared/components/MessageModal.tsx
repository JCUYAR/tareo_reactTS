import { Modal } from "react-bootstrap";
import Icon from "../ui/Icon";

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
            contentClassName="custom-modal"
        >
            <Modal.Header closeButton>Alerta</Modal.Header>

            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center" style={{ marginLeft: 40 }}>
                    <div className="d-flex align-items-center">
                        {/* Icono */}
                        {type === "error" && (
                            <Icon name="FaExclamationTriangle" size={50} CStyle={{ color: "orange" }} />
                        )}
                        {type === "success" && (
                            <Icon name="FaCheckCircle" size={50} CStyle={{ color: "green" }} />
                        )}

                        {/* Texto */}
                        <span className="ms-2">{message || "Texto de prueba"}</span>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default MessageModal;