import { AgGridReact } from 'ag-grid-react';
import styles from './EmployeesTable.module.css';
import {
  clearEmployees,
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from '../../store/slices/employeesSlice';
import { useAppDispatch } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DEFAULT_LIMIT } from '../../constants/tables';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { ModalAddRow } from '../ModalAddRow';

export function EmployeesTable({ employeesRef }) {
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

  const dataSource = {
    rowCount: DEFAULT_LIMIT,

    getRows(params) {
      const { startRow, endRow, successCallback } = params;
      dispatch(fetchEmployees({ startRow, endRow })).then((result) => {
        const payload = result.payload;

        const lastRow = payload.hasMore ? undefined : startRow + payload.employees.length;

        successCallback(payload.employees, lastRow);
      });
    },
  };

  const columnDefs = [
    {
      field: 'employeeId',
      cellRenderer: (props) => {
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

  const onCellValueChanged = (event) => {
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
      gridRef.current.api.refreshInfiniteCache();
    });
  };

  const defaultColDef = {
    flex: 1,
    editable: true,
  };

  const onGridReady = (params) => {
    params.api.setDatasource(dataSource);
  };

  const handleInsert = (values) => {
    dispatch(createEmployee(values)).then(() => {
      dispatch(clearEmployees());
      gridRef.current.api.refreshInfiniteCache();
    });
  };

  const handleDelete = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    gridRef.current.api.deselectAll();

    const deletingIds = selectedNodes.map(({ data }) => data.employeeId);
    dispatch(deleteEmployee(deletingIds)).then(() => {
      dispatch(clearEmployees());
      gridRef.current.api.refreshInfiniteCache();
    });
  };

  const rowStyle = {
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
