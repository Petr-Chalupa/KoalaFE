interface TableRowData {
    ID: string;
    [key: string]: any;
}

export interface TableRow {
    data: TableRowData;
    children: Record<string, { records: TableRow[] }>;
}

export interface TableState {
    data: TableRow[];
    loading: boolean;
    error: string | null;
}
