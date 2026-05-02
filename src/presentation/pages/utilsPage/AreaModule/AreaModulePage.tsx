import type { FC } from "react";
import AreaModuleForm from "./form/AreaModuleForm";
import AreaModuleTable from "./table/AreaModuleTable";

const AreaModule: FC = () => {

    return (
        <>
            <AreaModuleForm/>
            <br />
            <AreaModuleTable/>
        </>
    );
}

export default AreaModule;