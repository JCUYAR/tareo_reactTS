import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState, type FC } from "react";
import type { UpdtAddArea } from "../../../../forms/areaForm.types";
import { Button } from "react-bootstrap";
import { isDiferent } from "../../../../../app/helpers/generalFunctions";
import { addAreaService, addStatusService, getOneById, updateAreaService, updateStatusService } from "../../../../../infraestructure/api/catalogService";
import { useAlertModal } from "../../../../../app/providers/AlertModalContext";

interface AreaModuleFormProps {
    mantType?: string;
    onClose?: () => void;
    onSearch: () => void;
    viewModeMaster: boolean;
    updateModeMaster: boolean;
    regId: string;
}

const AreaModuleForm: FC<AreaModuleFormProps> = ({
    mantType,
    onClose,
    onSearch,
    viewModeMaster,
    updateModeMaster,
    regId
}) => {

    const formRefs = {
        id: useRef<HTMLInputElement>(null),
        description: useRef<HTMLInputElement>(null),
        submit: useRef<HTMLButtonElement>(null),
        clean: useRef<HTMLButtonElement>(null),
        exit: useRef<HTMLButtonElement>(null)
    }

    const formSchema = Yup.object({
        description: Yup.string()
            .required("*Este campo es requerido")
    })

    const areaFormType: UpdtAddArea = {
        id: "",
        description: ""
    }

    const { alertModal } = useAlertModal();

    const [initialState, setInitialState] = useState(areaFormType);

    const [viewModeM, setViewModeM] = useState<boolean>(false);
    const [updateModeM, setUpdateModeM] = useState<boolean>(false);

    const dataType = (mantType == "status" ? "2" : "1")
    const dataTypeTitle = dataType == "1" ? "área" : "estado"

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
                    setFieldValue,
                    resetForm,
                    validateForm,
                    validateField
                }) => {
                    const {
                        id: _id,
                        ...cleanInitial
                    } = initialState;

                    const {
                        id: _ide,
                        ...cleanDataTemp
                    } = values;

                    const isDirty = isDiferent(cleanInitial, cleanDataTemp);

                    const handleOnClean = () => {
                        if (!viewModeM && !updateModeM) {
                            resetForm();
                        } else if (!viewModeM && updateModeM) {
                            setFieldValue("id", initialState.id);
                            setFieldValue("description", initialState.description);
                        }
                    }

                    const handleExit = () => {
                        handleOnClean();
                        setViewModeM(false);
                        setUpdateModeM(false);
                        onClose && onClose();
                    }

                    const addProccess = async () => {
                        const body = {
                            description: values.description
                        };

                        switch (dataType) {
                            case "1":
                                addAreaService(body.description).then((add) => {
                                    if (add.success) {
                                        alertModal("success", `Se ha creado una nueva área: ${body.description}`, () => {
                                            handleExit();
                                            onSearch && onSearch();
                                        });
                                    }
                                });
                                break;

                            case "2":
                                addStatusService(body.description).then((add) => {
                                    if (add.success) {
                                        alertModal("success", `Se ha creado un nuevo estado: ${body.description}`, () => {
                                            handleExit();
                                            onSearch && onSearch();
                                        });
                                    }
                                });
                                break;
                        }


                    }

                    const updateProccess = async () => {
                        const body = {
                            id: values.id,
                            description: values.description
                        };

                        switch (dataType) {
                            case "1":
                                updateAreaService(parseInt(body.id), body.description).then((updt) => {
                                    if (updt.success) {
                                        alertModal("success", `Se ha actualizado el registro de área`, () => {
                                            handleExit();
                                            onSearch && onSearch();
                                        });
                                    }
                                });
                                break;

                            case "2":
                                updateStatusService(parseInt(body.id), body.description).then((updt) => {
                                    if (updt.success) {
                                        alertModal("success", `Se ha actualizado el registro de estado`, () => {
                                            handleExit();
                                            onSearch && onSearch();
                                        });
                                    }
                                });
                                break;
                        }

                    }

                    const handleSubmit = () => {
                        if (!viewModeM && !updateModeM) {
                            addProccess();
                        } else if (viewModeM && !updateModeM) {
                            setViewModeM(false);
                            setUpdateModeM(true);
                        } else if (!viewModeM && updateModeM) {
                            updateProccess();
                        }
                    }

                    const visualizeArea = async () => {
                        const getViewReg = await getOneById(dataType, regId);
                        setInitialState(getViewReg.data[0]);
                        setFieldValue("id", getViewReg.data[0].id);
                        setFieldValue("description", getViewReg.data[0].description);
                    }


                    useEffect(() => {
                        if (viewModeMaster) {
                            setViewModeM(viewModeMaster)
                        }
                        if (updateModeMaster) {
                            setUpdateModeM(updateModeMaster)
                        }
                    }, [viewModeMaster, updateModeMaster])

                    useEffect(() => {
                        if ((viewModeM && !updateModeM)) {
                            visualizeArea();
                        } else if (!viewModeM && updateModeM) {
                            visualizeArea();
                        }
                        // console.log("register id: ", regId)
                        // console.log("viewModeM: ", viewModeM);
                        // console.log("updateModeM: ", updateModeM);
                    }, [viewModeM, updateModeM])

                    return (
                        <>
                            <div className="p-4">
                                <h5>
                                    {(!viewModeM && !updateModeM ? `Registro de ${dataTypeTitle}` :
                                        (viewModeM && !updateModeM) ? `Visualización de ${dataTypeTitle}` :
                                            (!viewModeM && updateModeM) ? `Actualización de ${dataTypeTitle}` : "")}
                                </h5>
                                <form
                                    style={{ textAlign: "left" }}
                                >
                                    {(updateModeM || viewModeM) && (
                                        <div className="row mb-3">
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label className="small-label">Identificador</label>
                                                    <Field
                                                        name="id"
                                                        ref={formRefs.id}
                                                        className="form-control small-input"
                                                        disabled={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="small-label">Descripción</label>

                                                <Field
                                                    name="description"
                                                    innerRef={formRefs.description}
                                                    className={`form-control small-input ${errors.description ? "is-invalid" : ""
                                                        }`}
                                                    disabled={viewModeM}
                                                    placeholder={`Ingrese descripción ${dataTypeTitle}`}
                                                    autoFocuss
                                                />
                                                {errors.description && (
                                                    <div style={{ color: "red" }}>{errors.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 d-flex gap-1">
                                        {!viewModeM && (
                                            <Button
                                                className="btn btn-secondary"
                                                disabled={!isDirty}
                                                onClick={(event: any) => {
                                                    handleOnClean();
                                                }}
                                            >
                                                {updateModeM ? "Reestablecer" : "Limpiar"}
                                            </Button>
                                        )}

                                        <Button
                                            className="btn btn-success"
                                            onClick={handleSubmit}
                                            disabled={(!viewModeM) && !isDirty}
                                        >
                                            {viewModeM ? "Editar" :
                                                updateModeM ? "Actualizar" : "Guardar"}
                                        </Button>

                                        <Button
                                            className="btn btn-danger"
                                            onClick={handleExit}
                                        >
                                            Salir
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </>
                    );


                }}


            </Formik>
        </>
    );
}

export default AreaModuleForm;