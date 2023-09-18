import { ColDef } from 'ag-grid-community';

export const getCellDataType = (type: ColDef['cellDataType']): string => {
  switch (type) {
    case 'dateString':
      return 'date';
    case 'text':
      return 'text';
    case 'number':
      return 'number';
    default:
      return 'text';
  }
};
