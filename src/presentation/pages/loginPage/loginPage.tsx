import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import type { LoginFormInterface } from '../../forms/loginForm.types';

const LoginPage: React.FC = () => {

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
      {() => (
        <Form className="card">
          <h1>Gracias totales</h1>
          <div className="row">
            <Field
                className="myInput col-3" 
                name="userName" 
                placeholder="Usuario" 
            />
          </div>
          
          <div className="row">
            <Field
                className="myInput col-3"
                name="password"
                type="password"
                placeholder="Password"
            />

          </div>

          <button type="submit">Login</button>
        </Form>
      )}
    </Formik>
            
        </>
         
        
       
        
    )
}

export default LoginPage;