import { AgGridReact } from 'ag-grid-react';
import styles from './DepartmentsTable.module.css';
import { useAppDispatch, useAppSelector } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { IDepartment } from './../../../../shared/types';
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
import {
  IFetchDepartmentsResult,
  clearDepartments,
  createDepartment,
  deleteDepartments,
  fetchDepartments,
  updateDepartment,
} from 'store/slices/departmentSlice';
import { ITablesColumnDef } from 'components/ModalAddRow/ModalAddRow';
import { ConfirmForDelete } from 'components/ConfirmForDelete';

interface IDepartmentTableProps {
  employeesRef: React.RefObject<AgGridReact<any>>;
}

export function DepartmentsTable({ employeesRef }: IDepartmentTableProps) {
  const dispatch = useAppDispatch();

  const gridRef = useRef<AgGridReact>(null);

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

  const dataSource: IDatasource = {
    rowCount: DEFAULT_LIMIT,

    getRows(params) {
      const { startRow, endRow, successCallback } = params;
      dispatch(fetchDepartments({ startRow, endRow })).then((result) => {
        const payload = result.payload as IFetchDepartmentsResult;

        const lastRow = payload.hasMore ? undefined : startRow + payload.departments.length;

        successCallback(payload.departments, lastRow);
      });
    },
  };

  const columnDefs: ITablesColumnDef[] = [
    {
      field: 'departmentId',
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

  const onCellValueChanged = (event: CellValueChangedEvent<IDepartment>) => {
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

  const defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };

  const onGridReady = (params: GridReadyEvent<IDepartment>) => {
    params.api.setDatasource(dataSource);
  };

  const handleInsert = (values: Record<string, string>) => {
    dispatch(createDepartment(values)).then(() => {
      dispatch(clearDepartments());
      gridRef.current!.api.refreshInfiniteCache();
    });
  };

  const handleCloseConfirmForDelete = () => {
    setIsOpenConfirmForDelete(false);
  };

  const handleClickForDelete = () => {
    const selectedNodes = gridRef.current!.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    setIsOpenConfirmForDelete(true);
  };

  const handleDelete = () => {
    const selectedNodes = gridRef.current!.api.getSelectedNodes();
    if (!selectedNodes.length) return;

    gridRef.current!.api.deselectAll();

    const deletingIds = selectedNodes.map(({ data }: { data: IDepartment }) => data.departmentId);
    dispatch(deleteDepartments(deletingIds)).then(() => {
      dispatch(clearDepartments());
      gridRef.current!.api.refreshInfiniteCache();
      employeesRef.current!.api.refreshInfiniteCache();
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
