import { useState, type FC } from "react";
import AreaModuleForm from "./form/AreaModuleForm";
import AreaModuleTable from "./table/AreaModuleTable";
import AreaModuleFilter from "./filter/AreaModuleFilter";

const AreaModule: FC = () => {

    const [searchParam, setSearchParam] = useState("");
    const [receiveRegId, setReceiveRegId] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);

    const [viewModeM, setViewModeM] = useState<boolean>(false);
    const [updateModeM, setUpdateModeM] = useState<boolean>(false);

    const enableViewMode = () => {
        setViewModeM(true);
        setUpdateModeM(false);
        requestAnimationFrame(() => {
            setShowForm(true);
        })
    }

    const enableUpdateMode = () => {
        setViewModeM(false);
        setUpdateModeM(true);
        requestAnimationFrame(() => {
            setShowForm(true);
        })
    }

    return (
        <div className="d-flex align-items-stretch" style={{ overflow: "hidden" }}>

            <div
                style={{
                    flex: showForm ? "0 0 33.3333%" : "0 0 0%",
                    maxWidth: showForm ? "33.3333%" : "0%",
                    opacity: showForm ? 1 : 0,
                    overflow: "hidden",
                    transition:
                        "flex-basis 0.35s ease, max-width 0.35s ease, opacity 0.25s ease " +
                        (showForm ? "0.1s" : "0s"),
                }}
            >
                <div style={{ minWidth: "300px" }}>
                    <AreaModuleForm 
                        onClose={() => {
                            setShowForm(false);
                            setViewModeM(false);
                            setUpdateModeM(false);
                        }} 
                        onSearch={() => setSearchTrigger((x) => x + 1)}
                        viewModeMaster={viewModeM}
                        updateModeMaster={updateModeM}
                        regId={receiveRegId}
                    />
                </div>
            </div>

            <div
                style={{
                    width: "1px",
                    marginLeft: showForm ? "0.5rem" : 0,
                    marginRight: showForm ? "0.5rem" : 0,
                    backgroundColor: "#000000",
                    opacity: showForm ? 0.2 : 0,
                    transition: "opacity 0.3s ease, margin 0.35s ease",
                }}
            />

            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div className="col-12">
                    <AreaModuleFilter
                        sendSearchFilter={setSearchParam}
                        onSearch={() => setSearchTrigger((x) => x + 1)}
                        onNew={() => setShowForm(true)}
                    />
                </div>
                <AreaModuleTable
                    search={searchParam}
                    searchTrigger={searchTrigger}
                    enableViewMode={enableViewMode}
                    sendRegId={setReceiveRegId}
                    enableUpdateMode={enableUpdateMode} 
                />
            </div>

        </div>
    );

}

export default AreaModule;