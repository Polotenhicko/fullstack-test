import { createAction } from '@reduxjs/toolkit';
import { IEmployee } from '../../../shared/types';

export const employeesClearAction = createAction('CLEAR_EMPLOYEES');
