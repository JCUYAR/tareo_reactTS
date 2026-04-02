import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../../presentation/pages/loginPage/loginPage";
import GeneralPage from "../../presentation/pages/generalPage/generalPage";
import PrivateRoute from "./PrivateRouter";
import AppLayout from "../toolbar/Applayout";

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route 
        path="/general" 
        element={
            <PrivateRoute>
                <AppLayout />
            </PrivateRoute>
        } />
  </Routes>
</BrowserRouter>