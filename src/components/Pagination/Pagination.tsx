import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;
  const isSinglePage = totalPages <= 1;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Mostrando {startItem} a {endItem} de {totalElements} resultado(s)
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handlePrevious}
          disabled={isFirstPage || isSinglePage}
          aria-label="Página anterior"
        >
          <ChevronLeft size={20} />
          <span>Anterior</span>
        </button>

        <div className={styles.pageInfo}>
          Página {currentPage + 1} de {totalPages}
        </div>

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={isLastPage || isSinglePage}
          aria-label="Próxima página"
        >
          <span>Próxima</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

