import { AgGridReact } from 'ag-grid-react';
import styles from './Table.module.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IEmployeesState, fetchEmployees } from '../../store/slices/employeesSlice';
import { AppDispatch, useAppDispatch } from '../../store/store';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { IEmployee } from '../../../shared/types';
import { useDispatch } from 'react-redux';

type TEmployeesColumns = {
  field: keyof IEmployee;
}[];

export function Table() {
  const employees = useSelector(({ employees }: { employees: IEmployeesState }) => employees);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  console.log(employees.employees);

  const columnDefs: TEmployeesColumns = [
    { field: 'employeeId' },
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'position' },
    { field: 'salary' },
    { field: 'hireDate' },
    { field: 'departmentId' },
  ];

  return (
    <div className={styles.table} style={{ height: 500 }}>
      <AgGridReact className="ag-theme-alpine" rowData={employees.employees} columnDefs={columnDefs} />
    </div>
  );
}
