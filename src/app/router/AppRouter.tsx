import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../../presentation/pages/loginPage/loginPage";
import GeneralPage from "../../presentation/pages/generalPage/generalPage";

import PrivateRoute from "./PrivateRouter";
import AppLayout from "../toolbar/Applayout";
import RegisterTareo from "../../presentation/pages/register/registerTareoPage";
import UtilsModulePage from "../../presentation/pages/utilsPage/UtilsModulePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PRIVATE AREA */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<GeneralPage />} />
          <Route path="/registerT" element={<RegisterTareo/>} />
          <Route path="/utils" element={<UtilsModulePage/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}