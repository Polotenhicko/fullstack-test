export interface IDepartment {
  departmentId: number;
  departmentName: string;
  managerId: number;
  budget: number;
  establishmentYear: number;
}

export interface IEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  salary: number;
  hireDate: string;
  departmentId: number;
}
