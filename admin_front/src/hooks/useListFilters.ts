import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

/**
 * Type for list filter default settings
 */
export interface ListFilterDefaults {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  searchOption?: string;
  // Extension: additional keys that should not be classified as customFilters
  reservedKeys?: string[];
  // Parameter prefix (independent state management per tab)
  prefix?: string;
}

/**
 * useListFilters hook return type
 */
export interface UseListFiltersReturn {
  // ===== URL query parameter values =====

  // Pagination
  page: number;
  limit: number;

  // Sorting
  sort: string;
  order: 'asc' | 'desc';

  // Search (values stored in URL)
  searchOption: string;
  searchValue: string;

  // Date filter (values stored in URL)
  minDate: string;
  maxDate: string;

  // Custom filters (all query parameters)
  customFilters: Record<string, string>;

  // ===== Local state (values being entered) =====

  localSearchOption: string;
  localSearchValue: string;
  localMinDate: string;
  localMaxDate: string;

  // ===== Setter functions =====

  // Pagination
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  // Sorting
  setSort: (sort: string) => void;
  setOrder: (order: 'asc' | 'desc') => void;

  // Search local state
  setLocalSearchOption: (option: string) => void;
  setLocalSearchValue: (value: string) => void;

  // Date local state
  setLocalMinDate: (date: string) => void;
  setLocalMaxDate: (date: string) => void;

  // Execute search (sync local state to URL)
  executeSearch: () => void;

  // ===== General-purpose functions =====

  // Update multiple filters at once
  updateFilters: (updates: Record<string, any>) => void;

  // Reset all filters
  resetFilters: () => void;
}

export function useListFilters(defaults: ListFilterDefaults = {}): UseListFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== Default value settings =====
  const defaultPage = defaults.page ?? 1;
  const defaultLimit = defaults.limit ?? 30;
  const defaultSort = defaults.sort ?? 'createdAt';
  const defaultOrder = defaults.order ?? 'desc';
  const defaultSearchOption = defaults.searchOption ?? '';
  const prefix = defaults.prefix ? `${defaults.prefix}_` : '';

  // ===== Parameter key helper function =====
  const getKey = (key: string) => `${prefix}${key}`;

  // ===== Read values from URL (with enhanced type safety) =====
  // Page: only allow positive integers >= 1
  const pageParam = Number(searchParams.get(getKey('page')));
  const page = (pageParam > 0) ? pageParam : defaultPage;

  // Limit: only allow positive integers >= 1
  const limitParam = Number(searchParams.get(getKey('limit')));
  const limit = (limitParam > 0) ? limitParam : defaultLimit;

  const sort = searchParams.get(getKey('sort')) || defaultSort;
  const order = (searchParams.get(getKey('order')) as 'asc' | 'desc') || defaultOrder;
  const searchOption = searchParams.get(getKey('searchOption')) || defaultSearchOption;
  const searchValue = searchParams.get(getKey('searchValue')) || '';
  const minDate = searchParams.get(getKey('minDate')) || '';
  const maxDate = searchParams.get(getKey('maxDate')) || '';

  // Custom filters (excluding reservedKeys, only matching the prefix)
  const customFilters: Record<string, string> = {};
  const baseReservedKeys = ['page', 'limit', 'sort', 'order', 'searchOption', 'searchValue', 'minDate', 'maxDate'];
  const reservedKeys = defaults.reservedKeys
    ? [...baseReservedKeys, ...defaults.reservedKeys]
    : baseReservedKeys;

  searchParams.forEach((value, key) => {
    // If prefix exists: only process keys starting with the prefix
    if (prefix) {
      if (key.startsWith(prefix)) {
        const unprefixedKey = key.substring(prefix.length);
        if (!reservedKeys.includes(unprefixedKey)) {
          customFilters[unprefixedKey] = value;
        }
      }
    } else {
      // If no prefix: keep existing logic
      if (!reservedKeys.includes(key)) {
        customFilters[key] = value;
      }
    }
  });

  // ===== Search/date local state (values being entered) =====
  const [localSearchOption, setLocalSearchOption] = useState(searchOption);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [localMinDate, setLocalMinDate] = useState(minDate);
  const [localMaxDate, setLocalMaxDate] = useState(maxDate);

  // Sync local state when URL changes
  useEffect(() => {
    setLocalSearchOption(searchOption);
    setLocalSearchValue(searchValue);
    setLocalMinDate(minDate);
    setLocalMaxDate(maxDate);
  }, [searchOption, searchValue, minDate, maxDate]);

  // ===== General-purpose update function =====
  const updateFilters = useCallback((updates: Record<string, any>, options?: { replace?: boolean }) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      const prefixedKey = getKey(key);
      // Remove empty values, 'all', null, and undefined from the query
      if (value === '' || value === 'all' || value === null || value === undefined) {
        newParams.delete(prefixedKey);
      } else {
        newParams.set(prefixedKey, String(value));
      }
    });

    // replace option: overwrite current URL without adding to history
    setSearchParams(newParams, { replace: options?.replace });
  }, [searchParams, setSearchParams, prefix]);

  // ===== Individual setter functions =====
  const setPage = useCallback((newPage: number) => {
    // Do not add to history on page change (replace: true)
    updateFilters({ page: newPage }, { replace: true });
  }, [updateFilters]);

  const setLimit = useCallback((newLimit: number) => {
    updateFilters({ limit: newLimit, page: 1 }); // Reset to first page on limit change
  }, [updateFilters]);

  const setSort = useCallback((newSort: string) => {
    // Do not add to history on sort change (replace: true)
    updateFilters({ sort: newSort }, { replace: true });
  }, [updateFilters]);

  const setOrder = useCallback((newOrder: 'asc' | 'desc') => {
    // Do not add to history on sort order change (replace: true)
    updateFilters({ order: newOrder }, { replace: true });
  }, [updateFilters]);

  // ===== Execute search (sync local state to URL) =====
  const executeSearch = useCallback(() => {
    updateFilters({
      searchOption: localSearchOption,
      searchValue: localSearchValue,
      minDate: localMinDate,
      maxDate: localMaxDate,
      page: 1, // Reset to first page on search
    });
  }, [localSearchOption, localSearchValue, localMinDate, localMaxDate, updateFilters]);

  // ===== Reset all filters =====
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
    setLocalSearchOption(defaultSearchOption);
    setLocalSearchValue('');
    setLocalMinDate('');
    setLocalMaxDate('');
  }, [setSearchParams, defaultSearchOption]);

  return {
    // URL query parameter values
    page,
    limit,
    sort,
    order,
    searchOption,
    searchValue,
    minDate,
    maxDate,
    customFilters,

    // Local state
    localSearchOption,
    localSearchValue,
    localMinDate,
    localMaxDate,

    // Setters
    setPage,
    setLimit,
    setSort,
    setOrder,
    setLocalSearchOption,
    setLocalSearchValue,
    setLocalMinDate,
    setLocalMaxDate,

    // Functions
    executeSearch,
    updateFilters,
    resetFilters,
  };
}