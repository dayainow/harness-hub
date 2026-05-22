import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 공통 필터 상태 타입
export interface PageFilterState {
  currentPage: number;
  itemsPerPage: number;
  searchOption: string;
  searchValue: string;
  sortFilter: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, string>;
  dateRange?: {
    minDate: string;
    maxDate: string;
  };
}

// 공통 필터 액션
export interface PageFilterActions {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSearchOption: (option: string) => void;
  setSearchValue: (value: string) => void;
  setSortFilter: (filter: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilter: (key: string, value: string) => void;
  setDateRange: (minDate: string, maxDate: string) => void;
  resetFilters: () => void;
}

// 기본 초기값
export const defaultFilterState: PageFilterState = {
  currentPage: 1,
  itemsPerPage: 30,
  searchOption: '',
  searchValue: '',
  sortFilter: 'createdAt',
  sortOrder: 'desc',
  filters: {},
  dateRange: {
    minDate: '',
    maxDate: '',
  },
};

// 필터 스토어 생성 팩토리 함수
export const createPageFilterStore = (
  storeName: string,
  initialState: Partial<PageFilterState> = {}
) => {
  return create<PageFilterState & PageFilterActions>()(
    persist(
      (set) => ({
        ...defaultFilterState,
        ...initialState,

        setCurrentPage: (page) => set({ currentPage: page }),

        setItemsPerPage: (itemsPerPage) =>
          set({ itemsPerPage, currentPage: 1 }),

        setSearchOption: (option) => set({ searchOption: option }),

        setSearchValue: (value) => set({ searchValue: value }),

        setSortFilter: (filter) => set({ sortFilter: filter }),

        setSortOrder: (order) => set({ sortOrder: order }),

        setFilter: (key, value) =>
          set((state) => ({
            filters: { ...state.filters, [key]: value },
            currentPage: 1,
          })),

        setDateRange: (minDate, maxDate) =>
          set({
            dateRange: { minDate, maxDate },
            currentPage: 1,
          }),

        resetFilters: () =>
          set({
            ...defaultFilterState,
            ...initialState,
          }),
      }),
      {
        name: `${storeName}-filter-storage`,
      }
    )
  );
};

// 예제 페이지 필터 스토어
export const useExampleFilterStore = createPageFilterStore('example', {
  searchOption: 'title',
  sortFilter: 'createdAt',
});
