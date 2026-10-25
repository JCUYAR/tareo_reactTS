import { useState, type FC } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "../../../app/styles/tabStyles.css";
import AreaModule from "./AreaModule/AreaModulePage";

const UtilsModulePage: FC = () => {
    const [activeTab, setActiveTab] = useState("area");

    return (
        <>
            <div className="tabs-wrapper">
                 <div className="tabs-container">
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k ?? "")}
                        className="custom-tabs"

                    >
                        <Tab eventKey="area" title="Area" />
                        <Tab eventKey="status" title="Estado" />
                        <Tab eventKey="categoria" title="Categoría" /> 
                    </Tabs>

                    {/* CONTENEDOR ÚNICO */}
                    <div className="tab-content-box">
                        {activeTab === "area" && <AreaModule />}
                        {activeTab === "status" && <AreaModule mantType="status"/>}
                        {/* {activeTab === "categoria" && <Categoria />} */}
                    </div>
                 </div>
                
            </div>

        </>
    );

}

export default UtilsModulePage;