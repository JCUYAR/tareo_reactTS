import { Button, Modal } from "react-bootstrap";
import "../../../../app/styles/registerModal.css"
import { Field, Formik } from "formik";
import * as Yup from "yup";
import type { AddTareo, TareoResponse, UpdtAddTareo, UpdtTareo } from "../../../forms/tareoForm.types";
import { useEffect, useRef, useState } from "react";
import type { SelectDto } from "../../../general/SelectDto";
import { listUsers } from "../../../../infraestructure/api/userService";
import Select from "react-select/base";
import type { ActionMeta, InputActionMeta, SelectInstance } from "react-select";
import SelectPerso from "../../../../shared/components/SelectPerso";
import { addTareoService, listArea, listCategory, listOneById, listStatus, updtTareoService } from "../../../../infraestructure/api/tareoService";
import { useAuth } from "../../../../app/providers/AuthContext";
import { useAlertModal } from "../../../../app/providers/AlertModalContext";
import { isDiferent } from "../../../../app/helpers/generalFunctions";

interface RegisterModalProps {
    onOpen: boolean;
    onCloseM: () => void;
    viewMode: boolean;
    updateMode: boolean;
    idTareo?: number | null;
    idUserReg?: number | null;
    resetModes?: () => void;
    prefilledDate?: Date | null;
    prefilledTime?: string;
    prefilledEndTime?: string;
}

const RegisterModal = ({
    onOpen = false,
    onCloseM,
    viewMode = false,
    updateMode = false,
    idTareo = null,
    idUserReg = null,
    resetModes,
    prefilledDate = null,
    prefilledTime = "",
    prefilledEndTime = ""
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
        total_hours: useRef<HTMLInputElement>(null),
        submit: useRef<HTMLButtonElement>(null),
        clean: useRef<HTMLButtonElement>(null),
        exit: useRef<HTMLButtonElement>(null)
    }

    const formSchema = Yup.object({
        description: Yup.string()
            .required("*La descripción es obligatoria"),

        category: Yup.string()
            .required("*La categoría es obligatoria"),

        area: Yup.string()
            .required("*El área es obligatoria"),

        status: Yup.string()
            .required("*El estado es obligatorio"),

        work_date: Yup.string()
            .required("*La fecha de registro es obligatoria"),

        start_time: Yup.string()
            .required("*La hora de inicio es obligatoria"),

        end_time: Yup.string()
            .required("*La hora de finalización es obligatoria"),
    })

    const tareoFormType: UpdtAddTareo = {
        id: null,
        description: "",
        user_id: null,
        category: null,
        area: null,
        status: null,
        start_time: "",
        end_time: "",
        tareoCode: "",
        work_date: "",
        total_hours: ""
    }

    const emptyTareo: UpdtAddTareo = {
        description: "",
        user_id: null,
        category: null,
        area: null,
        status: null,
        work_date: "",
        start_time: "",
        end_time: "",
        id: null,
        tareoCode: null,
        total_hours: null
    };

    const { user } = useAuth();
    const { alertModal } = useAlertModal();

    const [initialState, setInitalState] = useState(tareoFormType)

    const [userList, setUserList] = useState<SelectDto[]>([]);
    const [categoryList, setCategoryList] = useState<SelectDto[]>([]);
    const [areaList, setAreaList] = useState<SelectDto[]>([]);
    const [statusList, setStatusList] = useState<SelectDto[]>([]);

    const [viewModeM, setViewModeM] = useState<boolean>(false);
    const [updateModeM, setUpdateModeM] = useState<boolean>(false);


    const getListAllUser = async () => {
        const response = await listUsers();
        setUserList(response.data);
    }

    const getListAllCate = async () => {
        const response = await listCategory();
        setCategoryList(response.data);
    }

    const getListAllArea = async () => {
        const response = await listArea();
        setAreaList(response.data);
    }

    const getListAllStatus = async () => {
        const response = await listStatus();
        setStatusList(response.data);
    }

    const handleClose = () => {
        setInitalState(emptyTareo)
        onCloseM();
        resetModes && resetModes();
    }



    return (
        <>

            <Formik
                initialValues={initialState}
                validationSchema={!viewModeM ? formSchema : ""}
                validateOnMount={!viewModeM && !updateModeM}
                validateOnBlur={!viewModeM}
                validateOnChange={true}
                onSubmit={(values) => {
                }}
            >
                {({
                    values,
                    errors,
                    setErrors,
                    touched,
                    setFieldValue,
                    resetForm,
                    validateForm,
                    validateField
                }) => {
                    

                    const handleSubmit = async () => {
                        if (updateModeM) {
                            try {
                                if (!user) return;
                                if (!values.category || !values.area || !values.status) {
                                    return;
                                }
                                const updtPayload: UpdtTareo = {
                                    id: initialState.id,
                                    description: values.description,
                                    category: parseInt(values.category, 10),
                                    area: parseInt(values.area, 10),
                                    status: parseInt(values.status, 10),
                                    user_id: parseInt(initialState.user_id ?? ""),
                                    work_date: initialState.work_date,
                                    start_time: values.start_time,
                                    end_time: values.end_time
                                };
                                const submit = await updtTareoService(updtPayload);

                                if (submit.success) {
                                    alertModal("success", "Tareo actualizado correctamente", () => {
                                        handleClose();
                                    });
                                } else {
                                    alertModal("error", submit.errors[0].description);
                                }
                            } catch (error) {
                                alertModal("error", "Ha ocurrido un error al actualizar el tareo");
                            }
                        } else {
                            try {
                                if (!user) return;
                                if (!values.category || !values.area || !values.status) {
                                    return;
                                }
                                const addPayload: AddTareo = {

                                    description: values.description,
                                    user_id: user.id,
                                    category: parseInt(values.category, 10),
                                    area: parseInt(values.area, 10),
                                    status: parseInt(values.status, 10),
                                    work_date: values.work_date,
                                    start_time: values.start_time,
                                    end_time: values.end_time
                                };
                                const submit = await addTareoService(addPayload);

                                if (submit.success) {
                                    alertModal("success", "Tareo registrado correctamente", () => {
                                        handleClose();
                                    });
                                } else {
                                    alertModal("error", submit.errors[0].description);
                                }

                            } catch (error) {
                                alertModal("error", "Ha ocurrido un error general no controlado, comunicarse con soporte");
                            }
                        }

                    };

                    const onSubmit = () => {
                        if (viewModeM) {
                            setViewModeM(false);
                            setUpdateModeM(true);
                        } else {
                            handleSubmit();
                        }
                    }

                    const handleClean = () => {
                        // debugger
                        if (updateModeM) {
                            setFieldValue("tareoCode", initialState.tareoCode);
                            setFieldValue("description", initialState.description);
                            setFieldValue("category", initialState.category?.toString());
                            setFieldValue("area", initialState.area?.toString());
                            setFieldValue("status", initialState.status?.toString());
                            setFieldValue("work_date", initialState.work_date?.toString().split("T")[0]); // ✅ recorta el ISO
                            setFieldValue("start_time", initialState.start_time);
                            setFieldValue("end_time", initialState.end_time);
                        } else if (!updateModeM && !viewModeM) {
                            console.log("EL peep")
                            setInitalState(emptyTareo)
                            resetForm();
                            setFieldValue("tareoCode", null)
                            requestAnimationFrame(() => {
                                validateForm();
                            })
                        }
                    }

                    // Fuera del componente, junto a los tipos
                    const mapTareoToState = (t: TareoResponse): UpdtAddTareo => ({
                        id: parseInt(t.id),
                        user_id: t.user_id,
                        description: t.description,
                        category: t.category,
                        area: t.area,
                        status: t.status,
                        work_date: t.work_date,
                        start_time: t.startTime,
                        end_time: t.endTime,
                        tareoCode: t.tareoCode,
                        total_hours: null
                    });

                    const getUserById = async () => {
                        if (idTareo && idUserReg) {
                            const { data } = await listOneById(idTareo, idUserReg);
                            const mapped = mapTareoToState(data);

                            setInitalState(prev => ({ ...prev, ...mapped }));

                            // ✅ Usa mapped, no initialState
                            setFieldValue("userData", `${user?.name} ${user?.lName}`);
                            setFieldValue("tareoCode", mapped.tareoCode);
                            setFieldValue("description", mapped.description);
                            setFieldValue("category", mapped.category?.toString());
                            setFieldValue("area", mapped.area?.toString());
                            setFieldValue("status", mapped.status?.toString());
                            setFieldValue("work_date", mapped.work_date?.toString().split("T")[0]); // ✅ recorta el ISO
                            setFieldValue("start_time", mapped.start_time);
                            setFieldValue("end_time", mapped.end_time);
                        }
                    };

                    const {
                        id: _id,
                        user_id: _user_id,
                        total_hours: _total_hours,
                        ...cleanInitial
                    } = initialState;

                    const {
                        id: _ide,
                        user_id: _user_ide,
                        total_hours: _total_hourse,
                        userData: _user_data,
                        ...cleanDataTemp
                    } = values;

                    const isDirty = isDiferent(cleanInitial, cleanDataTemp);

                                         useEffect(() => {
                        console.log("initialState: ", cleanInitial);
                        console.log("values: ", cleanDataTemp);
                        console.log("isDirty: ", isDirty);
                     }, [isDirty]);



                    useEffect(() => {
                        setViewModeM(viewMode);
                        setUpdateModeM(updateMode);
                    }, [viewMode, updateMode,]);

                    useEffect(() => {
                        getListAllUser();
                        getListAllCate();
                        getListAllArea();
                        getListAllStatus();

                        // ✅ Inyecta fecha y hora si vienen del click en el track
                        if (prefilledDate) {
                            const dateStr = prefilledDate.toISOString().split("T")[0];
                            setFieldValue("work_date", dateStr);
                            
                        }
                        if (prefilledTime) {
                            setFieldValue("start_time", prefilledTime);
                            
                        }
                        if (prefilledEndTime) {
                            setFieldValue("end_time", prefilledEndTime);
                        }
                        requestAnimationFrame(() => {
                            validateForm()
                        })
                    }, []);

                    useEffect(() => {
                        if (viewModeM || updateModeM) {
                            getUserById();
                        }
                    }, [viewModeM, updateModeM])

                    return (
                        <>
                            <div>
                                <Modal
                                    show={onOpen}
                                    onHide={handleClose}
                                    size="xl"
                                    centered
                                    backdrop="static"
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    contentClassName="custom-modal"
                                >
                                    <Modal.Header
                                        closeButton
                                    >
                                        {(!viewModeM && !updateModeM ? "Registro de nuevo tareo" :
                                            (viewModeM && !updateModeM) ? `Visualización de registro - Usuario: ${`${user?.name} ${user?.lName}`}` :
                                                (!viewModeM && updateModeM) ? `Actualización de registro - Usuario: ${`${user?.name} ${user?.lName}`}` : "")}
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form>
                                            {(updateModeM || viewModeM) && (
                                                <div className="row mb-3">
                                                    <div className="col-2">
                                                        <div className="form-group">
                                                            <label className="small-label">Código de tareo</label>
                                                            <Field
                                                                name="tareoCode"
                                                                ref={formRefs.tareoCode}
                                                                className="form-control small-input"
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* <div className="col-3">
                                                        <div className="form-group">
                                                            <label className="small-label">Usuario</label>
                                                            <Field
                                                                name="userData"
                                                                ref={formRefs.userData}
                                                                className={`form-control small-input`}
                                                                disabled={true}

                                                            />
                                                        </div>
                                                    </div> */}
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
                                                            placeholder="Ingrese descripción de tareo"
                                                            autoFocus
                                                        />
                                                        {errors.description && (
                                                            <div style={{color: "red"}}>{errors.description}</div>
                                                        )}
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
                                                            className={errors.category ? "is-invalid" : ""}
                                                            options={categoryList}
                                                            ref={formRefs.category}
                                                            isValid={errors.category}
                                                            placeholder="Seleccione categoría"
                                                            disabled={viewModeM}
                                                        />
                                                        {errors.category && (
                                                            <div style={{color: "red"}}>{errors.category}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label className="small-label">Area</label>
                                                        <Field
                                                            name="area"
                                                            component={SelectPerso}
                                                            className={errors.area ? "is-invalid" : ""}
                                                            options={areaList}
                                                            ref={formRefs.area}
                                                            isInvalid={errors.area}
                                                            placeholder="Seleccione area"
                                                            disabled={viewModeM}
                                                        />
                                                        {errors.area && (
                                                            <div style={{color: "red"}}>{errors.area}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label className="small-label">Estado de tareo</label>
                                                        <Field
                                                            name="status"
                                                            component={SelectPerso}
                                                            className={errors.status ? "is-invalid" : ""}
                                                            options={statusList}
                                                            ref={formRefs.status}
                                                            placeholder="Seleccione estado de tareo"
                                                            disabled={viewModeM}
                                                        />
                                                        {errors.status && (
                                                            <div style={{color: "red"}}>{errors.status}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-4">
                                                    <div className="mb-2">
                                                        <label className="small-label d-block">Fecha de registro</label>
                                                        <Field
                                                            name="work_date"
                                                            type="date"
                                                            className={`form-control small-input  ${errors.work_date ? "is-invalid" : ""}`}
                                                            ref={formRefs.work_date}
                                                            disabled={viewModeM || updateModeM}
                                                        />
                                                        {errors.work_date && (
                                                            <div style={{color: "red"}}>{errors.work_date}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="mb-2">
                                                        <label className="small-label d-block">Hora de inicio de tarea</label>
                                                        <Field
                                                            name="start_time"
                                                            type="time"
                                                            className={`form-control small-input  ${errors.start_time ? "is-invalid" : ""}`}
                                                            ref={formRefs.start_time}
                                                            disabled={viewModeM}
                                                        />
                                                        {errors.start_time && (
                                                            <div style={{color: "red"}}>{errors.start_time}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-4">
                                                    <div className="mb-2">
                                                        <label className="small-label d-block">Hora de termino de tarea</label>
                                                        <Field
                                                            name="end_time"
                                                            type="time"
                                                            className={`form-control small-input  ${errors.end_time ? "is-invalid" : ""}`}
                                                            ref={formRefs.end_time}
                                                            disabled={viewModeM}
                                                        />
                                                        {errors.end_time && (
                                                            <div style={{color: "red"}}>{errors.end_time}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 d-flex gap-1">
                                                {!viewModeM && (
                                                    <Button
                                                        className="btn btn-secondary"
                                                        disabled={!isDirty}
                                                        onClick = {(event: any) => {
                                                            handleClean();
                                                        }}
                                                    >
                                                        {updateModeM ? "Reestablecer" : "Limpiar"}
                                                    </Button>
                                                )}

                                                <Button
                                                    className="btn btn-success"
                                                    onClick={onSubmit}
                                                    disabled={(!viewModeM) && !isDirty}
                                                >
                                                    {viewModeM ? "Editar" :
                                                        updateModeM ? "Actualizar" : "Guardar"}
                                                </Button>

                                                <Button
                                                    className="btn btn-danger"
                                                    onClick={handleClose}
                                                >
                                                    Salir
                                                </Button>
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