import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useRef, useState, type FC } from "react";
import type { UpdtAddArea } from "../../../../forms/areaForm.types";
import { Button } from "react-bootstrap";
import { isDiferent } from "../../../../../app/helpers/generalFunctions";

const AreaModuleForm: FC = () => {

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

    const [initialState, setInitialState] = useState(areaFormType);

    const [viewModeM, setViewModeM] = useState<boolean>(false);
    const [updateModeM, setUpdateModeM] = useState<boolean>(false);

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

                    return (
                        <>
                            <div className="p-4">
                                <h5>
                                    {(!viewModeM && !updateModeM ? "Registro de nueva área" :
                                        (viewModeM && !updateModeM) ? `Visualización de área` :
                                            (!viewModeM && updateModeM) ? `Actualización de área` : "")}
                                </h5>
                                <form
                                    style={{textAlign: "left"}}
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
                                                    placeholder="Ingrese descripción área"
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
                                                    // handleClean();
                                                }}
                                            >
                                                {updateModeM ? "Reestablecer" : "Limpiar"}
                                            </Button>
                                        )}

                                        <Button
                                            className="btn btn-success"
                                            // onClick={onSubmit}
                                            disabled={(!viewModeM) && !isDirty}
                                        >
                                            {viewModeM ? "Editar" :
                                                updateModeM ? "Actualizar" : "Guardar"}
                                        </Button>

                                        <Button
                                            className="btn btn-danger"
                                        // onClick={handleClose}
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