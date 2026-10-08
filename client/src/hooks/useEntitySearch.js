// hooks/useEntitySearch.js
import { useState, useEffect, useMemo } from 'react';

export function useEntitySearch(fetchFn, searchFields = []) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchFn();
        setData(res.data || []);
      } catch (err) {
        setError(err.message || 'Error loading data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchFn]);

  // Filtrado genérico según las propiedades definidas en searchFields
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase().trim()

    return data.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field)
        if (value === undefined || value === null) {
          return false
        }
        if (Array.isArray(value)) {
          return value.some(
            v => String(v).toLowerCase().includes(query)
          )
        }
        return String(value).toLowerCase().includes(query)
      });
    });
  }, [data, search, searchFields]);

  return {
    data: filteredData,
    search,
    setSearch,
    loading,
    error,
    totalCount: data.length
  };
}

function getNestedValue(object, path) {
  return path.split('.').reduce((value, key) => {
    if (Array.isArray(value)) {
      return value.flatMap(item => item?.[key] ?? [])
    }

    return value?.[key]
  }, object)
}