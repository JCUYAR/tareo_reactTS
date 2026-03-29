import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import type { LoginFormInterface } from '../../forms/loginForm.types';
import '../../../app/styles/loginStyles.css';
import Icon from '../../../shared/ui/Icon';

const LoginPage: React.FC = () => {
    const formRefs = {
        userName: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
        submit: useRef<HTMLButtonElement>(null)
    }

    const loginFormType: LoginFormInterface = {
        userName: "",
        password: ""
    }

    const [initialState, setInitalState] = useState(loginFormType)


    return (
        <>
            <Formik
                initialValues={initialState}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {({
                    values,
                    errors,
                    setErrors,
                    setFieldValue
                }) => {
                    useEffect(() => {
                        setErrors({})
                    }, [])
                    return (
                        <div className="container-fluid vh-100">
                            <div className="row h-100">

                                {/* IZQUIERDA → FORMULARIO */}
                                <div className="col-md-5 d-flex align-items-center justify-content-center left-background">
                                    <Form className="card p-4 w-75">
                                        <div className="row">
                                            <h2 className="col-8" style={{ color: "black" }}>
                                                Bienvenido al registro de Tareo
                                            </h2>
                                            <Icon
                                                name="FaBook"
                                                className="col-4"
                                                size={50}
                                                CStyle={{ color: "blue" }}
                                            />
                                        </div>


                                        <div className="mb-3 text-center">
                                            <label className="form-label text-start w-50">
                                                Ingrese su usuario:
                                            </label>

                                            <Field
                                                className="myInput form-control mx-auto w-50"
                                                name="userName"
                                                innerRef={formRefs.userName}
                                                placeholder="Usuario"
                                            />
                                        </div>

                                        <div className="mb-3 text-center">
                                            <label className="form-label text-start w-50">
                                                Ingrese su contraseña:
                                            </label>
                                            <Field
                                                className="myInput form-control mx-auto w-50"
                                                name="password"
                                                innerRef={formRefs.password}
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </div>

                                        <div className="mb-3 text-center">
                                            <button
                                                type="submit"
                                                name="submit"
                                                ref={formRefs.submit}
                                                className="buttonSubmit btn btn-primary mx-auto w-50"
                                            >
                                                Iniciar sesión
                                            </button>
                                        </div>


                                    </Form>
                                </div>

                                {/* DERECHA → ESPACIO PARA IMAGEN */}
                                <div className="col-md-7 login-background">
                                    <img src="" alt="" />
                                </div>

                            </div>
                        </div >
                    );
                }}
            </Formik >

        </>




    )
}

export default LoginPage;