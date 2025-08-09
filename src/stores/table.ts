import { defineStore } from "pinia";
import type { TableState, TableRow } from "@/types/table";

export const useTableStore = defineStore("table", {
    state: (): TableState => ({
        data: [],
        loading: false,
        error: null,
    }),

    getters: {
        hasData: (state): boolean => state.data !== null && state.data.length > 0,
    },

    actions: {
        loadData(url: string = "/data.json") {
            this.loading = true;
            this.error = null;

            fetch(url)
                .then((response) => response.json())
                .then((jsonData) => {
                    this.data = jsonData;
                    this.loading = false;

                    if (!Array.isArray(this.data)) {
                        throw new Error("Invalid data format");
                    }
                })
                .catch((err) => {
                    this.error = "Failed to load data: " + err.message;
                    this.loading = false;
                });
        },

        deleteRow(rowID: string, parentID: string | null = null) {
            if (!this.data) return;

            if (parentID === null) {
                this.data = this.data.filter((row) => row.data.ID !== rowID);
            } else {
                this.deleteNestedRow(this.data, rowID, parentID);
            }
        },

        deleteNestedRow(rows: TableRow[], rowID: string, parentID: string) {
            for (const row of rows) {
                if (row.data.ID === parentID) {
                    for (const [childKey, childVal] of Object.entries(row.children)) {
                        childVal.records = childVal.records.filter((child) => child.data.ID !== rowID);
                        if (childVal.records.length === 0) {
                            delete row.children[childKey];
                        }
                    }
                    return;
                }

                for (const child of Object.values(row.children)) {
                    this.deleteNestedRow(child.records, rowID, parentID);
                }
            }
        },
    },
});
