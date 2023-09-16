import { createAction } from '@reduxjs/toolkit';
import { IEmployee } from '../../../shared/types';

export const employeesReceivedAction = createAction<IEmployee[]>('RECEIVED_EMPLOYEES');
