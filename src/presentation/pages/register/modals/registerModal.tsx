import { Modal } from "react-bootstrap";
import "../../../../app/styles/registerModal.css"
import { Field, Formik } from "formik";
import * as Yup from "yup";
import type { UpdtAddTareo } from "../../../forms/tareoForm.types";
import { useEffect, useRef, useState } from "react";
import type { SelectDto } from "../../../general/SelectDto";
import { listUsers } from "../../../../infraestructure/api/userService";
import Select from "react-select/base";
import type { ActionMeta, InputActionMeta, SelectInstance } from "react-select";
import SelectPerso from "../../../../shared/components/SelectPerso";

interface RegisterModalProps {
    onOpen: boolean;
    onCloseM: () => void;
    viewMode: boolean;
    updateMode: boolean;
}

const RegisterModal = ({
    onOpen = false,
    onCloseM,
    viewMode = false,
    updateMode = false

}: RegisterModalProps) => {

    const formRefs = {
        description: useRef<HTMLInputElement>(null),
        user_id: useRef<HTMLInputElement>(null),
        userData: useRef<HTMLInputElement>(null),
        category: useRef<SelectInstance | null>(null),
        area: useRef<HTMLInputElement>(null),
        status: useRef<HTMLInputElement>(null),
        work_date: useRef<HTMLInputElement>(null),
        start_time: useRef<HTMLInputElement>(null),
        end_time: useRef<HTMLInputElement>(null),
        tareoCode: useRef<HTMLInputElement>(null),
        workDate: useRef<HTMLInputElement>(null),
        total_hours: useRef<HTMLInputElement>(null),
        submit: useRef<HTMLButtonElement>(null),
        clean: useRef<HTMLButtonElement>(null),
        exit: useRef<HTMLButtonElement>(null)
    }

    const formSchema = Yup.object({
        userName: Yup.string()
            .required("El usuario es obligatorio"),

        password: Yup.string()
            .required("La contraseña es obligatoria")
    })

    const tareoFormType: UpdtAddTareo = {
        id: null,
        description: "",
        user_id: null,
        category: null,
        area: null,
        status: null,
        work_date: "",
        start_time: "",
        end_time: "",
        tareoCode: "",
        workDate: "",
        total_hours: ""
    }

    const [initialState, setInitalState] = useState(tareoFormType)

    const [userList, setUserList] = useState<SelectDto[]>([]);
    const [categoryList, setCategoryList] = useState<SelectDto[]>([]);

    const [viewModeM, setViewModeM] = useState<boolean>(false);
    const [updateModeM, setUpdateModeM] = useState<boolean>(false);


    const getListAllUser = async () => {
        const response = await listUsers();
        setUserList(response.data);
    }

    return (
        <>

            <Formik
                initialValues={initialState}
                validationSchema={formSchema}
                onSubmit={(values) => {
                }}
            >
                {({
                    values,
                    errors,
                    setErrors,
                    touched,
                    setFieldValue
                }) => {

                    useEffect(() => {
                        setViewModeM(viewMode);
                        setUpdateModeM(updateMode);
                        setFieldValue("", "")
                    }, [viewMode, updateMode]);

                    useEffect(() => {
                        getListAllUser();
                        if (viewModeM || updateModeM) {
                            const user = userList.find(
                                u => u.value === values.user_id?.toString()
                            );

                            if (user) {
                                setFieldValue("user", user.descript);
                            }
                        }

                    }, [])

                    return (
                        <>
                            <div>
                                <Modal
                                    show={onOpen}
                                    onHide={onCloseM}
                                    size="xl"
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    contentClassName="custom-modal"
                                >
                                    <Modal.Header
                                        closeButton
                                    >
                                        {(!viewModeM && !updateModeM ? "Registro de nuevo tareo" :
                                            (viewModeM && !updateModeM) ? "Visualización de registro " :
                                                (!viewModeM && updateModeM) ? "Actualización de registro " : "")}
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form>
                                            {updateModeM && (
                                                <div className="row">
                                                    <label className="col-4">Código de tareo:</label>
                                                    <Field
                                                        name="tareoCode"
                                                        ref={formRefs.tareoCode}
                                                        className="myInput col-8"
                                                        disabled={true}
                                                    />
                                                </div>
                                            )}

                                            {(updateModeM || viewModeM) && (
                                                <div className="row">
                                                    <label className="col-4">Usuario</label>
                                                    <Field
                                                        name="userData"
                                                        ref={formRefs.userData}
                                                        className={`myInput col-8`}
                                                        isDisabled={true}

                                                    />
                                                </div>

                                            )}

                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="small-label">Descripción</label>

                                                        <Field
                                                            name="description"
                                                            as="textarea"
                                                            rows="3"
                                                            innerRef={formRefs.description}
                                                            className={`form-control small-input ${errors.description ? "is-invalid" : ""
                                                                }`}
                                                            disabled={viewModeM}
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label className="small-label">Categoría</label>
                                                        <Field
                                                            name="category"
                                                            component={SelectPerso}
                                                            className={`form-control small-input ${errors.category ? "is-invalid" : ""}`}
                                                            options={categoryList}
                                                        />
                                                    </div>
                                                </div>
                                            </div>




                                        </form>

                                    </Modal.Body>

                                </Modal>

                            </div>

                        </>
                    );
                }}

            </Formik>


        </>

    );

}

export default RegisterModal;