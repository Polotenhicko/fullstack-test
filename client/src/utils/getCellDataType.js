import { ColDef } from 'ag-grid-community';

export const getCellDataType = (type) => {
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
