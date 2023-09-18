export interface IDepartment {
  departmentId: number;
  departmentName: string;
  managerId: number | null;
  budget: number | null;
  establishmentYear: number | null;
}

export interface IEmployee {
  employeeId: number;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  salary: number | null;
  hireDate: string | null;
  departmentId: number | null;
}
