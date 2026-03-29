import GeneralPage from "./presentation/pages/generalPage/generalPage";
import LoginPage from "./presentation/pages/loginPage/loginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Ruta inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página principal */}
        <Route path="/dashboard" element={<GeneralPage />} />
      </Routes>
    </BrowserRouter>
    </>

  );
}

export default App;