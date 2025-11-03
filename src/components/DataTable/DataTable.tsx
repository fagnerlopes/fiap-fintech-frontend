import styles from './DataTable.module.css';
import type { DataTableProps } from '../../types/table.types';

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  renderActions,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado',
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (data.length === 0) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
            {renderActions && <th className={styles.actions}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              {renderActions && (
                <td className={styles.actions}>{renderActions(item)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

