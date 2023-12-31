import { AgGridReact } from 'ag-grid-react';
import styles from './EmployeesTable.module.css';
import {
  IFetchEmployeesResult,
  clearEmployees,
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from '../../store/slices/employeesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { IEmployee } from './../../../../shared/types';
import { DEFAULT_LIMIT } from '../../constants/tables';
import {
  CellValueChangedEvent,
  ColDef,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  ValueFormatterParams,
} from 'ag-grid-community';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { ModalAddRow } from '../ModalAddRow';
import { ITablesColumnDef } from 'components/ModalAddRow/ModalAddRow';

interface IEmployeesTableProps {
  employeesRef: React.RefObject<AgGridReact<any>>;
}

export function EmployeesTable({ employeesRef }: IEmployeesTableProps) {
  const dispatch = useAppDispatch();

  const gridRef = employeesRef;

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const closeModalAddRow = () => {
    setIsOpenAddModal(false);
  };

  useEffect(() => {
    return () => {
      dispatch(clearEmployees());
    };
  }, [dispatch]);

  const dataSource: IDatasource = {
    rowCount: DEFAULT_LIMIT,

    getRows(params) {
      const { startRow, endRow, successCallback } = params;
      dispatch(fetchEmployees({ startRow, endRow })).then((result) => {
        const payload = result.payload as IFetchEmployeesResult;

        const lastRow = payload.hasMore ? undefined : startRow + payload.employees.length;

        successCallback(payload.employees, lastRow);
      });
    },
  };

  const columnDefs: ITablesColumnDef[] = [
    {
      field: 'employeeId',
      cellRenderer: (props: ValueFormatterParams) => {
        if (props.value !== undefined) {
          return props.value;
        } else {
          return <img src="https://www.ag-grid.com/example-assets/loading.gif" alt="Loading..." />;
        }
      },
      cellDataType: 'number',
      editable: false,
      customInfo: {
        required: false,
        inputType: 'number',
      },
    },
    {
      field: 'firstName',
      cellDataType: 'text',
      customInfo: {
        required: true,
        inputType: 'text',
      },
    },
    {
      field: 'lastName',
      cellDataType: 'text',
      customInfo: {
        required: true,
        inputType: 'text',
      },
    },
    {
      field: 'position',
      cellDataType: 'text',
      customInfo: {
        required: true,
        inputType: 'text',
      },
    },
    {
      field: 'salary',
      cellDataType: 'number',
      customInfo: {
        required: false,
        inputType: 'number',
      },
    },
    {
      field: 'hireDate',
      cellDataType: 'dateString',
      customInfo: {
        required: true,
        inputType: 'date',
      },
    },
    {
      field: 'departmentId',
      cellDataType: 'number',
      customInfo: {
        required: false,
        inputType: 'number',
      },
    },
  ];

  const onCellValueChanged = (event: CellValueChangedEvent<IEmployee>) => {
    const fieldName = event.colDef.field;

    if (!fieldName) throw new Error('Does not have fieldName!');

    const oldData = { ...event.data, [fieldName]: event.oldValue };

    const employeeId = oldData.employeeId;

    dispatch(
      updateEmployee({
        employeeId,
        fields: {
          [fieldName]: event.newValue === '' ? null : event.newValue,
        },
      }),
    ).then(() => {
      gridRef.current!.api.refreshInfiniteCache();
    });
  };

  const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };

  const onGridReady = (params: GridReadyEvent<IEmployee>) => {
    params.api.setDatasource(dataSource);
  };

  const handleInsert = (values: Record<string, string>) => {
    dispatch(createEmployee(values)).then(() => {
      dispatch(clearEmployees());
      gridRef.current!.api.refreshInfiniteCache();
    });
  };

  const handleDelete = () => {
    const selectedNodes = gridRef.current!.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    gridRef.current!.api.deselectAll();

    const deletingIds = selectedNodes.map(({ data }: { data: IEmployee }) => data.employeeId);
    dispatch(deleteEmployee(deletingIds)).then(() => {
      dispatch(clearEmployees());
      gridRef.current!.api.refreshInfiniteCache();
    });
  };

  const rowStyle: GridOptions = {
    getRowStyle() {
      return { background: '#fff' };
    },
  };

  return (
    <div>
      <div className={styles.controlBar}>
        <Button
          onClick={() => setIsOpenAddModal(true)}
          variant="contained"
          disableElevation
          sx={{ color: '#fff' }}
        >
          Add row
        </Button>
        <Button onClick={() => handleDelete()} variant="contained" disableElevation sx={{ color: '#fff' }}>
          Delete rows
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cacheBlockSize={DEFAULT_LIMIT}
          maxBlocksInCache={DEFAULT_LIMIT}
          gridOptions={rowStyle}
          onCellValueChanged={onCellValueChanged}
          onGridReady={onGridReady}
          rowModelType="infinite"
          rowSelection="multiple"
        />
      </div>
      <ModalAddRow
        fields={columnDefs}
        onClose={closeModalAddRow}
        onInsert={handleInsert}
        isOpen={isOpenAddModal}
      />
    </div>
  );
}
