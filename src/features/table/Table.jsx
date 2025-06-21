"use client";

import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getIssues } from "../../entity/issue/issueController";

// ---- Constants ----
const INITIAL_COLUMNS = [
  {
    headerName: "ID",
    field: "id",
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "Title",
    field: "title",
    width: 180,
    sortable: false,
    filterable: false,
  },
  {
    headerName: "State",
    field: "state",
    width: 120,
    type: "boolean",
    sortable: false,
  },
  {
    headerName: "Created",
    field: "created",
    width: 180,
    type: "dateTime",
    filterable: false,
  },
  {
    headerName: "Updated",
    field: "updated",
    width: 180,
    type: "dateTime",
    filterable: false,
  },
];

// ---- Component ----
function Table() {
  // ---- State ----
  const [tableData, setTableData] = useState({
    columns: INITIAL_COLUMNS,
    rows: [],
  });

  const [query, setQuery] = useState({
    page: 0,
    per_page: 10,
  });

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("github-columns-visible");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // ---- Handlers ----
  const handleColumnVisibilityChange = (model) => {
    setColumnVisibilityModel(model);
    localStorage.setItem("github-columns-visible", JSON.stringify(model));
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setQuery((prev) => ({
      ...prev,
      page: newPage,
      per_page: newPageSize,
    }));
  };

  const handleSortChange = (field, direction) => {
    setQuery((prev) => ({
      ...prev,
      page: 0,
      pageSize: 10,
      sort: field,
      direction,
    }));
  };

  const onFilterChange = useCallback((filterModel) => {
    const items = filterModel.items || [];
    const firstFilter = items[0];
    if (!firstFilter) return;

    let { field, value } = firstFilter;

    if (field === "state") {
      value = value ? "open" : "closed";
      if (value === undefined || value === null) value = "all";
    }

    setQuery((prev) => ({
      ...prev,
      page: 0,
      pageSize: 10,
      filter: { field, value },
    }));
  }, []);

  // ---- Data fetching ----
  const getIssuesData = useCallback(() => getIssues(query), [query]);

  const transformIssuesData = (issues) =>
    issues.map((issue) => ({
      ...issue,
      state: issue.state === "open",
      created: new Date(issue.created_at),
      updated: new Date(issue.updated_at),
    }));

  const { data, error, isLoading } = useQuery({
    queryKey: ["tableData", query],
    queryFn: getIssuesData,
    onError: (err) => toast.error(err.message || "Something went wrong!"),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  // ---- Side effects ----
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong!");
      setTableData((prev) => ({ ...prev, rows: [] }));
      return;
    }

    if (data?.error) {
      toast.error(data.error || "Something went wrong!");
      setTableData((prev) => ({ ...prev, rows: [] }));
      return;
    }

    if (data?.success) {
      setTableData((prev) => ({
        ...prev,
        rows: transformIssuesData(data.data),
      }));
    }
  }, [data, error]);

  // ---- Render ----
  return (
    <DataGrid
      pageSizeOptions={[10, 25, 50]}
      columns={tableData.columns}
      rows={tableData.rows}
      loading={isLoading}
      paginationModel={{ page: query.page, pageSize: query.per_page }}
      rowCount={1000} // Estimate or set dynamically
      paginationMode="server"
      onPaginationModelChange={(model) =>
        handlePaginationChange(model.page, model.pageSize)
      }
      onSortModelChange={(sortModel) => {
        if (sortModel.length > 0) {
          handleSortChange(sortModel[0].field, sortModel[0].sort);
        }
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={handleColumnVisibilityChange}
      sortingMode="server"
      filterMode="server"
      onFilterModelChange={onFilterChange}
    />
  );
}

export default Table;
