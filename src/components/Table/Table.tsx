import { AgGridReact } from 'ag-grid-react';
import styles from './Table.module.css';
import { TFetchEmployeesResult, fetchEmployees } from '../../store/slices/employeesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { IEmployee } from '../../../shared/types';
import { DEFAULT_LIMIT } from '../../constants/tables';
import { ColDef, GridReadyEvent, IDatasource, ValueFormatterParams } from 'ag-grid-community';
import classNames from 'classnames';

export function Table() {
  const employees = useAppSelector(({ employees }) => employees);
  const dispatch = useAppDispatch();

  const dataSource: IDatasource = {
    rowCount: DEFAULT_LIMIT,

    getRows(params) {
      const { startRow, endRow, successCallback, failCallback } = params;
      console.log(startRow, endRow);

      dispatch(fetchEmployees({ startRow, endRow })).then((result) => {
        const payload = result.payload as TFetchEmployeesResult;

        successCallback(payload.employees, payload.hasMore ? undefined : endRow);
      });
    },
  };

  const columnDefs: ColDef[] = [
    {
      field: 'employeeId',
      cellRenderer: (props: ValueFormatterParams) => {
        if (props.value !== undefined) {
          return props.value;
        } else {
          return <img src="https://www.ag-grid.com/example-assets/loading.gif" />;
        }
      },
    },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'position' },
    { field: 'salary' },
    { field: 'hireDate' },
    { field: 'departmentId' },
  ];

  const onGridReady = (params: GridReadyEvent<IEmployee>) => {
    params.api.setDatasource(dataSource);
  };

  return (
    <div className={classNames(styles.table, 'ag-theme-alpine')} style={{ height: 500 }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowModelType="infinite"
        onGridReady={onGridReady}
        cacheBlockSize={10}
        maxBlocksInCache={10}
      />
    </div>
  );
}
