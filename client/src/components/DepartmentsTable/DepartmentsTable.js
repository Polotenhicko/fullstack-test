import { AgGridReact } from 'ag-grid-react';
import styles from './DepartmentsTable.module.css';
import { useAppDispatch } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { DEFAULT_LIMIT } from '../../constants/tables';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { ModalAddRow } from '../ModalAddRow';
import {
  clearDepartments,
  createDepartment,
  deleteDepartments,
  fetchDepartments,
  updateDepartment,
} from 'store/slices/departmentSlice';
import { ConfirmForDelete } from 'components/ConfirmForDelete';

export function DepartmentsTable({ employeesRef }) {
  const dispatch = useAppDispatch();

  const gridRef = useRef(null);

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenConfirmForDelete, setIsOpenConfirmForDelete] = useState(false);
  const confirmationText =
    'When deleting departments, the associated employee department ID fields will become null.';

  const closeModalAddRow = () => {
    setIsOpenAddModal(false);
  };

  useEffect(() => {
    return () => {
      dispatch(clearDepartments());
    };
  }, [dispatch]);

  const dataSource = {
    rowCount: DEFAULT_LIMIT,

    getRows(params) {
      const { startRow, endRow, successCallback } = params;
      dispatch(fetchDepartments({ startRow, endRow })).then((result) => {
        const payload = result.payload;

        const lastRow = payload.hasMore ? undefined : startRow + payload.departments.length;

        successCallback(payload.departments, lastRow);
      });
    },
  };

  const columnDefs = [
    {
      field: 'departmentId',
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
      field: 'departmentName',
      cellDataType: 'text',
      customInfo: {
        required: true,
        inputType: 'text',
      },
    },
    {
      field: 'managerId',
      cellDataType: 'number',
      customInfo: {
        required: true,
        inputType: 'number',
      },
    },
    {
      field: 'budget',
      cellDataType: 'number',
      customInfo: {
        required: false,
        inputType: 'number',
      },
    },
    {
      field: 'establishmentYear',
      cellDataType: 'number',
      customInfo: {
        required: true,
        inputType: 'number',
      },
    },
  ];

  const onCellValueChanged = (event) => {
    const fieldName = event.colDef.field;

    if (!fieldName) throw new Error('Does not have fieldName!');

    const oldData = { ...event.data, [fieldName]: event.oldValue };

    const departmentId = oldData.departmentId;

    dispatch(
      updateDepartment({
        departmentId,
        fields: {
          [fieldName]: event.newValue,
        },
      }),
    );
  };

  const defaultColDef = {
    flex: 1,
    editable: true,
  };

  const onGridReady = (params) => {
    params.api.setDatasource(dataSource);
  };

  const handleInsert = (values) => {
    dispatch(createDepartment(values)).then(() => {
      dispatch(clearDepartments());
      gridRef.current.api.refreshInfiniteCache();
    });
  };

  const handleCloseConfirmForDelete = () => {
    setIsOpenConfirmForDelete(false);
  };

  const handleClickForDelete = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    setIsOpenConfirmForDelete(true);
  };

  const handleDelete = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    gridRef.current.api.deselectAll();

    const deletingIds = selectedNodes.map(({ data }) => data.departmentId);
    dispatch(deleteDepartments(deletingIds)).then(() => {
      dispatch(clearDepartments());
      gridRef.current.api.refreshInfiniteCache();
      employeesRef.current.api.refreshInfiniteCache();
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
        <Button onClick={handleClickForDelete} variant="contained" disableElevation sx={{ color: '#fff' }}>
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
      <ConfirmForDelete
        isOpen={isOpenConfirmForDelete}
        confirmationText={confirmationText}
        onAgree={handleDelete}
        onClose={handleCloseConfirmForDelete}
      />
    </div>
  );
}
