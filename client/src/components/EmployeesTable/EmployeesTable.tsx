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
  GridReadyEvent,
  IDatasource,
  ValueFormatterParams,
} from 'ag-grid-community';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { ModalAddRow } from '../ModalAddRow';
import { ITablesColumnDef } from 'components/ModalAddRow/ModalAddRow';
import MDAlert from 'components/MDAlert';
import MDSnackbar from 'components/MDSnackbar';

export function EmployeesTable() {
  const employees = useAppSelector(({ employees }) => employees);
  const dispatch = useAppDispatch();
  console.log(employees);

  const gridRef = useRef<AgGridReact>(null);

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
        console.log(payload);

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
        required: false,
        inputType: 'text',
      },
    },
    {
      field: 'lastName',
      cellDataType: 'text',
      customInfo: {
        required: false,
        inputType: 'text',
      },
    },
    {
      field: 'position',
      cellDataType: 'text',
      customInfo: {
        required: false,
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
        required: false,
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
    const employeeId = event.data.employeeId;
    const fieldName = event.colDef.field;

    if (!fieldName) throw new Error('Doe not have fieldName!');

    dispatch(
      updateEmployee({
        employeeId,
        fields: {
          [fieldName]: event.newValue,
        },
      }),
    );
  };

  const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };

  const onGridReady = (params: GridReadyEvent<IEmployee>) => {
    params.api.setDatasource(dataSource);
  };

  const handleInsert = (values: Record<string, string>) => {
    dispatch(createEmployee(values)).then((v) => {
      dispatch(clearEmployees());
      gridRef.current!.api.refreshInfiniteCache();
    });
  };

  const handleDelete = () => {
    const selectedNodes = gridRef.current!.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    const deletingIds = selectedNodes.map(({ data }: { data: IEmployee }) => data.employeeId);
    dispatch(deleteEmployee(deletingIds)).then(() => {
      dispatch(clearEmployees());
      gridRef.current!.api.refreshInfiniteCache();
    });
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
          onCellValueChanged={onCellValueChanged}
          onGridReady={onGridReady}
          rowModelType="infinite"
          rowSelection="multiple"
        />
      </div>
      {isOpenAddModal && <ModalAddRow fields={columnDefs} onClose={closeModalAddRow} onInsert={handleInsert} />}
    </div>
  );
}
