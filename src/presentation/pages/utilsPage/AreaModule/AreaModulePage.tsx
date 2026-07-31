import { useEffect, useState, type FC } from "react";
import AreaModuleForm from "./form/AreaModuleForm";
import AreaModuleTable from "./table/AreaModuleTable";
import AreaModuleFilter from "./filter/AreaModuleFilter";

const AreaModule: FC = () => {

    const [searchParam, setSearchParam] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(0);

    return (
        <>
            <div className="row align-items-stretch">

                <div className="col-4">
                    <AreaModuleForm />
                </div>

                <div className="col-auto d-flex justify-content-center p-0">
                    <div style={{
                        borderLeft: '1px solid #000000',
                        height: '100%',
                        opacity: 0.2
                    }} />
                </div>

                <div className="col-7 flex-grow-1">
                    <div className="col-12">
                        <AreaModuleFilter
                            sendSearchFilter={setSearchParam}
                            onSearch={() => setSearchTrigger(x => x + 1)}
                        />

                    </div>
                    <AreaModuleTable
                        search={searchParam}
                        searchTrigger={searchTrigger}
                    />
                </div>

            </div>
        </>
    );

}

export default AreaModule;