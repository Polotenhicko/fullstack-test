import { createAction } from '@reduxjs/toolkit';
import { IDepartment } from '../../../shared/types';

export const departmentsReceived = createAction<IDepartment[]>('RECEIVED_DEPARTMENTS');
