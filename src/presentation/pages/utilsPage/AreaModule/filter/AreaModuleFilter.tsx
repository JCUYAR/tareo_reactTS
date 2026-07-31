import { Field, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";


interface AreaModuleFilterProps {
    sendSearchFilter: (param: string) => void;
    onSearch: () => void;
}

interface initValues {
    search: string;
}

const AreaModuleFilter: React.FC<AreaModuleFilterProps> = ({
    sendSearchFilter,
    onSearch
}) => {
    const formRefs = {
        search: useRef<HTMLInputElement>(null)
    }

    const initialValues: initValues = {
        search: ""
    }

    const [initialState, setInitalState] = useState(initialValues)

    return (
        <>
            <Formik
                initialValues={initialState}
                onSubmit={(values) => {
                }}
            >
                {({
                    values
                }) => {
                    const disableSearchButton = !values.search;

                    const handleSearch = () => {
                        sendSearchFilter(values.search);
                    }

                    useEffect(() => {
                        sendSearchFilter(values.search);
                    }, [values.search]);
                    return (
                        <>
                            <div className="container py-3">
                                <div className="row justify-content-center align-items-end g-3">

                                    <div className="col-md-8">
                                        <label
                                            htmlFor="search"
                                            className="form-label fw-semibold"
                                        >
                                            Buscar área por descripción
                                        </label>

                                        <Field
                                            id="search"
                                            name="search"
                                            ref={formRefs.search}
                                            onClick={handleSearch}
                                            onKeyDown={handleSearch}
                                            placeholder="Buscar por descripción"
                                            className="form-control small-input"
                                        />
                                    </div>

                                    <div className="col-auto">
                                        <Button
                                            className="btn btn-clear"
                                            disabled={disableSearchButton}
                                            onClick={onSearch}
                                        >
                                            Buscar
                                        </Button>
                                    </div>
                                    <div className="col-auto">
                                        <Button
                                            className="btn btn-success"
                                        >
                                            Nuevo
                                        </Button>
                                    </div>

                                    <div className="col-auto">
                                        <Button
                                            className="btn btn-danger"
                                        >
                                            Salir
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </>
                    );
                }}

            </Formik>


        </>
    );
}

export default AreaModuleFilter;