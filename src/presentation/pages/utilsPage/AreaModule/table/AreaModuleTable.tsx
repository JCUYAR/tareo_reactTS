import { useEffect, useState, type FC } from "react";
import TableComponent from "../../../../../shared/components/TableComponent";
import { createColumnHelper, getCoreRowModel, useReactTable, type CellContext } from "@tanstack/react-table";
import type { PagedResponse } from "../../../../general/PagedResponse";
import type { CatalogParams, ListCatalog } from "../../../../Lists/catalog.types";
import { getPagedListCategory } from "../../../../../infraestructure/api/catalogService";
import { Dropdown, DropdownButton } from "react-bootstrap";


interface AreaModuleTableProps {
    search: string;
    searchTrigger: number;
    enableViewMode: () => void;
    sendRegId: (id: string) => void;
}

const AreaModuleTable: React.FC<AreaModuleTableProps> = ({
    search,
    searchTrigger,
    enableViewMode,
    sendRegId
}) => {

    const columnHelper = createColumnHelper<ListCatalog>();

    const [responseInfo, setResponseInfo] = useState<PagedResponse<ListCatalog[]>>();

    const totalItems = responseInfo?.totalItems || 0;

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, });

    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
            size: 90,
            cell: (props) => {
                const code = props.getValue();
                const hasMultipleSpaces = /\s{2,}/.test(code);
                return (
                    <div
                        style={{
                            width: "90px",
                            textAlign: "center",
                            overflow: "hidden",
                            whiteSpace: hasMultipleSpaces ? "pre-wrap" : "nowrap",
                            textOverflow: hasMultipleSpaces ? "clip" : "ellipsis",
                        }}
                    >
                        {code}
                    </div>
                );
            },
        }),
        columnHelper.accessor("description", {
            header: "Descripción",
            size: 320,
            cell: (props) => {
                const description = props.getValue();
                const hasMultipleSpaces = /\s{2,}/.test(description);
                return (
                    <div
                        style={{
                            width: "320px",
                            textAlign: "left",
                            overflow: "hidden",
                            whiteSpace: hasMultipleSpaces ? "pre-wrap" : "nowrap",
                            textOverflow: hasMultipleSpaces ? "clip" : "ellipsis",
                        }}
                    >
                        {description}
                    </div>
                );
            },
        }),
        {
            header: "Acción",
            size: 70,
            cell: (props: CellContext<ListCatalog, string>) => {
                return (
                    <DropdownButton
                        key={"start"}
                        id={props.row.getValue("id")}
                        drop={"end"}
                        // as={ButtonGroup}
                        variant="secondary"
                        title={"Acción"}
                        size="sm"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                        }}
                        className="c-btn"
                    >
                        <Dropdown.Item
                            onClick={() => {
                                actionPreview(props.row.getValue("id"))

                                
                            }}
                        >
                            Visualizar
                        </Dropdown.Item>
                        <Dropdown.Item
                            // onClick={() => {
                            //     props.table.options.meta?.handleEdit(
                            //         props.row.getValue("code")
                            //     );
                            // }}
                        >
                            Editar
                        </Dropdown.Item>
                        <Dropdown.Item
                            // onClick={() => {
                            //     setGetID(props.row.getValue("code"))
                            //     props.table.options.meta?.handleDelete(
                            //         props.row.original.code
                            //     );
                            // }}
                        >
                            Eliminar
                        </Dropdown.Item>
                    </DropdownButton>
                );
            },
        },
    ];

    const actionEdit = async (code: string) => {
        // navigate(/archivos/ctcheq07/form?codeCta=${encodeURIComponent(code)}&edit=true); 
    };

    const actionPreview = async (code: string) => {
        sendRegId(code);
        enableViewMode();
    };

    const getList = (request: CatalogParams) => {
        getPagedListCategory(request).then((response) => {
            if (response.success) {
                setResponseInfo(response as PagedResponse<ListCatalog[]>);
            }
        });
    };

    const table = useReactTable({
        data: responseInfo?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        rowCount: responseInfo?.totalItems,
        pageCount: responseInfo?.totalPages,
        onPaginationChange: setPagination,
        state: { pagination },
        meta: {
            handleEdit: (code: string) => {
                actionEdit(code)
            },
            handleDelete: (code: string) => {
                // handleDeleteAction1(code);
            },
            handleSelect: (id: string) => { },
            handlePreview: (code: string) => {
                actionPreview(code);
            },
            handleAdd: (id: string) => { },
            handleWarning: (id: string) => { },
            handleAddEdit: (id: string) => { },
        },
    });

    useEffect(() => {
        getList({
            pageNumber: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            type: "1",
            description: search
        });
    }, [searchTrigger, pagination]);



    return (
        <>
            <div style={{ overflow: "auto" }}>
                <TableComponent
                    table={table}
                    totalItems={totalItems}
                // stickyColumns={[0]}
                // onClickHandler={handleClickTable}
                // stickyColumnsRight={[9]}
                // disabledCellsEvent={[0, 10]}
                // actionLastTab={actionLastTab}
                />
            </div>
        </>
    );
}

export default AreaModuleTable;