import type { Header, Table } from "@tanstack/react-table";
import type { CSSProperties, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../app/styles/table.css"

const TableLoader = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.6)",
      zIndex: 2,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: "3px solid #d6d6d6",
        borderTopColor: "#3699ff",
        borderRadius: "50%",
        animation: "table-loader-spin 0.8s linear infinite",
      }}
    />
    <style>{`
      @keyframes table-loader-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

type Props = {
  table: Table<any>;
  totalItems: number;
  pagination?: boolean;
  messageEmpty?: string;
  loading?: boolean;
  onClickHandler?: (raw: any) => void;
  enterEventHandler?: (raw: any) => void;
  disabledCellsEvent?: number[];
  isFocus?: boolean;
  stickyColumns?: number[];
  stickyColumnsRight?: number[];
  resizable?: boolean;
  changeSizeTable?: (value: any) => void;
  style?: CSSProperties;
  stickyHeader?: boolean;
  actionLastTab?: () => void;
  nameFocusElement?: string | null;
  beforeDisabledInput?: () => void;
  actionRow?: boolean;
  rowSelection?: number | null;
  highlightSelectedRow?: boolean;
  focusElementRowSelection?: boolean;
};

const useFormRefs = () => {
  return {
    sizePage: useRef<any>(null),
    firstPage: useRef<any>(null),
    previousPage: useRef<any>(null),
    nextPage: useRef<any>(null),
    lastPage: useRef<any>(null),
  };
};

const TableComponent: FC<Props> = ({
  table,
  totalItems = 0,
  pagination = true,
  messageEmpty = "No se encontro resultados",
  loading = false,
  onClickHandler,
  enterEventHandler,
  disabledCellsEvent,
  isFocus = false,
  stickyColumns = [],
  stickyColumnsRight = [],
  resizable = false,
  changeSizeTable = null,
  stickyHeader = false,
  actionLastTab,
  style,
  nameFocusElement,
  beforeDisabledInput,
  actionRow = true,
  rowSelection = null,
  highlightSelectedRow = false,
}) => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [tableStatus, setTableStatus] = useState<Table<any>>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [dimensionsContainer, setDimensionsContainer] = useState<any>({
    width: 0,
    height: 0,
  });
  const [sizesGroups, setSizesGroups] = useState<number[]>();

  const formRefs = useFormRefs();

  // Recalcula el rango mostrado (ej: "1 al 10 de 50") cada vez que cambia la paginación
  useEffect(() => {
    calcPagination();
  }, [table.getState().pagination, totalItems]);

  // Enfoca el elemento indicado por nombre al montar / cuando cambia nameFocusElement
  useEffect(() => {
    if (nameFocusElement) {
      formRefs[nameFocusElement as keyof typeof formRefs]?.current?.focus();
    }
  }, [nameFocusElement]);

  // Enfoca y marca como seleccionada la fila indicada por rowSelection
  useEffect(() => {
    if (rowSelection != null) {
      tableRef.current?.focus();
      setSelectedRowIndex(rowSelection);

      setTimeout(() => {
        const tr = tableRef.current?.querySelector<HTMLTableRowElement>(
          `tr[data-key="${rowSelection}"]`
        );
        if (tr) {
          const firstFocusable = tr.querySelector<HTMLElement>(
            "input, button, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
          );
          firstFocusable?.focus();
        } else {
          const enabledInputs = getEnableInputs();
          const firstEnabledInput = enabledInputs.at(0) ?? null;
          if (firstEnabledInput) {
            firstEnabledInput.focus();
          }
        }
      }, 100);
    }
  }, [rowSelection]);

  const calcPagination = () => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const startIndex = pageIndex * pageSize + 1;
    const endIndex = Math.min((pageIndex + 1) * pageSize, totalItems);

    if (startIndex > totalItems && pageIndex > 0) {
      table?.previousPage();
    }

    setStartIndex(startIndex);
    setEndIndex(endIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    if (event.key == "Tab" && isFocus && tableRef) {
      requestAnimationFrame(() => {
        const trSelection =
          tableRef.current?.querySelector<HTMLTableRowElement>(".selected-row");
        if (trSelection) {
          const rowKey = trSelection?.getAttribute("data-key");
          const index = parseInt(rowKey ?? "0") + 1;
          setSelectedRowIndex(index);

          const nextTr = tableRef.current?.querySelector<HTMLTableRowElement>(
            `tr[data-key="${index}"]`
          );
          if (nextTr) {
            const firstFocusable = nextTr.querySelector<HTMLElement>(
              "input, button, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
            );
            firstFocusable?.focus();
          } else {
            const enabledInputs = getEnableInputs();
            const firstEnabledInput = enabledInputs.at(0) ?? null;
            if (firstEnabledInput) {
              firstEnabledInput.focus();
            }
          }
        } else {
          const focused = document.activeElement;
          const tr = focused?.closest("tr");
          const rowKey = tr?.getAttribute("data-key");
          if (rowKey) {
            const index = parseInt(rowKey ?? "0");
            setSelectedRowIndex(index);
          }
        }
      });
    }

    if (actionRow) {
      if (selectedRowIndex === null) return;

      if (event.key === "ArrowUp" && selectedRowIndex > 0) {
        event.preventDefault();
        setSelectedRowIndex(selectedRowIndex - 1);
        requestAnimationFrame(() => {
          tableRef.current?.focus();
        });
      } else if (
        event.key === "ArrowDown" &&
        selectedRowIndex < table.getRowModel().rows.length - 1
      ) {
        event.preventDefault();
        setSelectedRowIndex(selectedRowIndex + 1);
        requestAnimationFrame(() => {
          tableRef.current?.focus();
        });
      }
    }

    if (enterEventHandler) {
      if (selectedRowIndex === null) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();

        const isFocused =
          formRefs.firstPage.current === document.activeElement ||
          formRefs.previousPage.current === document.activeElement ||
          formRefs.nextPage.current === document.activeElement ||
          formRefs.lastPage.current === document.activeElement ||
          formRefs.sizePage.current === document.activeElement;

        if (!isFocused) {
          const data = table.getRowModel().rows[selectedRowIndex].original;
          enterEventHandler(data);
        }
      }
    }
  };

  const onclickFunction = (
    rowIndex: number,
    cellIndex: number,
    totalCells: number
  ) => {
    if (disabledCellsEvent) {
      const isIndex = disabledCellsEvent.includes(cellIndex + 1);
      if (isIndex) return;
    }

    if (enterEventHandler) {
      setSelectedRowIndex(rowIndex);
    }

    if (onClickHandler) {
      const data = table.getRowModel().rows[rowIndex].original;
      onClickHandler(data);
    }
  };

  // Configura el tabIndex de la tabla y, si hay enterEventHandler, selecciona/enfoca la primera fila
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.tabIndex = isFocus ? 0 : -1;
    }

    if (enterEventHandler) {
      setSelectedRowIndex(0);
      tableRef.current?.focus();
    }
  }, []);

  // Observa el tamaño del contenedor para recalcular columnas fijas (sticky)
  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        setDimensionsContainer({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (refContainer.current) {
      resizeObserver.observe(refContainer.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [refContainer]);

  useEffect(() => {
    const sizesGroup = stickyColumns?.map((item) => getSize(item));
    setSizesGroups(sizesGroup);
  }, [dimensionsContainer]);

  // Fija (pin) las columnas indicadas en stickyColumns / stickyColumnsRight
  useEffect(() => {
    if (stickyColumns) {
      stickyColumns.map((e) => {
        table.getHeaderGroups()?.[0].headers[e].column.pin("left");
      });
    }

    if (stickyColumnsRight) {
      stickyColumnsRight.map((e) => {
        const c = table.getHeaderGroups()?.[0].headers[e];
        if (c) c.column.pin("right");
      });
    }

    setTableStatus(table);
  }, [table]);

  const getSize = (index: number) => {
    let totalSize = 0;

    const indexOf = stickyColumns?.indexOf(index);
    if (indexOf !== -1) {
      for (let i = 0; i < indexOf; i++) {
        const columnId = stickyColumns[i];
        const header = document.getElementById(`header-${columnId}`);
        if (header) {
          const sizeHeader = header.offsetWidth || 0;
          totalSize += sizeHeader;
        }
      }
    }

    return totalSize;
  };

  const handleKeyDownPage = (e: any) => {
    const source = e.target.name;

    if (e.key == "Tab" && actionLastTab) {
      const enabledInputs = getEnableInputs();
      const lastEnabledInput = enabledInputs.at(-1) ?? null;

      if (source == lastEnabledInput.name) {
        e.preventDefault();
        actionLastTab();
      }
    }
  };

  const getEnableInputs = (): any[] => {
    const formEntries = Object.entries(formRefs);

    const enabledInputs = formEntries
      .map(([key, ref]) => ref.current)
      .filter((el: any) => {
        if (el?.inputRef) {
          if (!el?.inputRef?.disabled) {
            return el;
          }
        } else {
          if (!el?.disabled) {
            return el;
          }
        }
      });

    return enabledInputs;
  };

  const handleKeyDownPageTotalItems0 = (e: any) => {
    if (e.key == "Tab" && actionLastTab) {
      e.preventDefault();
      actionLastTab();
    }
  };

  const headerColumn = (header: Header<any, unknown>, meta?: any) => {
    if (meta?.description) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`Tooltip-${header.getContext()}`}>
              {meta?.intlID
                ? meta.descriptio
                : meta.description}
            </Tooltip>
          }
        >
          <div>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
        </OverlayTrigger>
      );
    }

    return flexRender(header.column.columnDef.header, header.getContext());
  };

  const handleOnClick = (name: string, onClick: () => void) => {
    onClick();
    requestAnimationFrame(() => {
      const formEntries = Object.entries(formRefs);
      const current = formEntries.find((e) => e[0] == name)?.[1].current;

      if (current) {
        if (current.disabled) {
          if (beforeDisabledInput) {
            beforeDisabledInput();
          } else if (actionLastTab) {
            actionLastTab();
          }
        }
      }
    });
  };

  return (
    <div
      ref={tableRef}
      style={{
        minHeight: "11rem",
        outline: "none",
        position: "relative",
        width: "100%",
      }}
      className={`el pepe`}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`c-table-container ${stickyColumns.length > 0 ? "c-table-container-overflow" : ""
          }`}
        ref={refContainer}
        style={{ ...style, minHeight: !totalItems ? "" : "11rem" }}
      >
        <table
          className="c-table"
          style={{
            minWidth: tableStatus?.getTotalSize(),
            width: "100%",
          }}
          autoFocus
          tabIndex={-1}
        >
          <thead
            style={{
              position: stickyHeader ? "sticky" : "relative",
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    id={`header-${index}`}
                    key={header.id}
                    className="text-center"
                    style={{
                      ...getCommonPinningStyles(
                        header.column,
                        stickyColumns,
                        stickyColumnsRight
                      ),
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : headerColumn(header, header.column.columnDef.meta)}
                    {resizable && (
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""
                            }`,
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
            <tr></tr>
          </thead>
          <tbody>
            {tableStatus?.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                data-key={rowIndex}
                data-rowid={row.original.value}
                className={rowIndex === selectedRowIndex ? "selected-row" : ""}
                style={{
                  ...((actionRow || highlightSelectedRow) &&
                    rowIndex === selectedRowIndex && {
                    backgroundColor: "#d6d6d6",
                  }),
                  cursor: onClickHandler ? "pointer" : "",
                }}
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className="text-center"
                    style={{
                      whiteSpace: "pre",
                      ...getCommonPinningStyles(
                        cell.column,
                        stickyColumns,
                        stickyColumnsRight
                      ),
                      background: `${stickyColumnsRight.includes(cellIndex) ||
                        stickyColumns.includes(cellIndex)
                        ? "inherit"
                        : undefined
                        }`,
                    }}
                    onClick={() => {
                      onclickFunction(
                        rowIndex,
                        cellIndex,
                        row.getVisibleCells().length
                      );
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Tab" &&
                        rowIndex === tableStatus?.getRowModel().rows.length - 1 &&
                        cellIndex === row.getVisibleCells().length - 1 &&
                        totalItems == 0
                      ) {
                        handleKeyDownPageTotalItems0(e);
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <TableLoader />}
      </div>
      {totalItems <= 0 && !loading && (
        <div className="text-center my-3"> {messageEmpty}</div>
      )}

      {pagination && totalItems > 0 ? (
        <>
          <div className="h-2" />
          <div className="table-footer">
            <select
              name="sizePage"
              ref={formRefs.sizePage}
              className="form-select form-select-sm table-page-size"
              value={tableStatus?.getState().pagination.pageSize}
              onChange={(e) => {
                tableStatus?.setPageSize(Number(e.target.value));
                if (changeSizeTable != null) {
                  changeSizeTable(e.target.value);
                }
              }}
              onKeyDown={handleKeyDownPage}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>

            <button
              name="firstPage"
              ref={formRefs.firstPage}
              className="btn btn-sm btn-icon btn-light"
              onClick={() => handleOnClick("firstPage", () => tableStatus?.firstPage())}
              disabled={!tableStatus?.getCanPreviousPage()}
              onKeyDown={handleKeyDownPage}
            >
              <i className="bi bi-chevron-double-left"></i>
            </button>
            <button
              name="previousPage"
              ref={formRefs.previousPage}
              className="btn btn-sm btn-icon btn-light"
              onClick={() =>
                handleOnClick("previousPage", () => tableStatus?.previousPage())
              }
              disabled={!tableStatus?.getCanPreviousPage()}
              onKeyDown={handleKeyDownPage}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="text-black fw-bold">{`${startIndex} al ${endIndex} de ${totalItems} `}</div>

            <button
              name="nextPage"
              ref={formRefs.nextPage}
              className="btn btn-sm btn-icon btn-light"
              onClick={() => handleOnClick("nextPage", () => tableStatus?.nextPage())}
              disabled={!tableStatus?.getCanNextPage()}
              onKeyDown={handleKeyDownPage}
            >
              <i className="bi bi-chevron-right"></i>
            </button>

            <button
              name="lastPage"
              ref={formRefs.lastPage}
              className="btn btn-sm btn-icon btn-light"
              onClick={() => handleOnClick("lastPage", () => tableStatus?.lastPage())}
              disabled={!tableStatus?.getCanNextPage()}
              onKeyDown={handleKeyDownPage}
            >
              <i className="bi bi-chevron-double-right"></i>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

const getCommonPinningStyles = (
  column: any,
  columns1: any,
  columns2: any
): CSSProperties | null => {
  if (columns1.length > 0 || columns2.length > 0) {
    const isPinned = column.getIsPinned();

    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  }

  return null;
};

export default TableComponent;