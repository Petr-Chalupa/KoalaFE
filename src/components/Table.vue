<script setup lang="ts">
import { computed, ref } from "vue";
import { useTableStore } from "@/stores/table";
import type { TableRow } from "@/types/table";

const props = withDefaults(
    defineProps<{ data?: TableRow[], parentID?: string | null }>(),
    { data: () => [], parentID: null }
);

const tableStore = useTableStore();
const visibleChildren = ref<string[]>([]);
const keys = computed<string[]>(() => {
    if (!props.data?.length) return [];

    const keySet = new Set<string>();
    for (const item of props.data) {
        Object.keys(item.data).forEach(key => keySet.add(key));
    }
    return Array.from(keySet);
});

function sortValuesByKeys(obj: Record<string, any>) {
    return keys.value.map(key => obj.hasOwnProperty(key) ? obj[key] : "-");
}

function hasChildren(row: TableRow): boolean {
    return Object.keys(row.children).length > 0;
}

function getFirstChildrenRecords(row: TableRow): TableRow[] {
    const firstChildKey = Object.keys(row.children)[0];
    return firstChildKey ? row.children[firstChildKey].records : [];
}

function toggleChildren(rowID: string) {
    const idIndex = visibleChildren.value.indexOf(rowID);
    if (idIndex != -1) {
        visibleChildren.value.splice(idIndex, 1);
    } else {
        visibleChildren.value.push(rowID);
    }
}

function deleteRow(rowID: string) {
    tableStore.deleteRow(rowID, props.parentID);
}
</script>

<template>
    <table class="table">
        <thead>
            <tr>
                <th><!--children collapsing--></th>
                <th v-for="key in keys" :key="key">{{ key }}</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(row, index) in props.data" :key="row.data.ID">
                <tr :class="{ odd_index: index % 2 != 0 }" @click="toggleChildren(row.data.ID)">
                    <td>
                        <div v-if="hasChildren(row)" :class="{ dropdown: true, open: visibleChildren.includes(row.data.ID) }"></div>
                    </td>
                    <td v-for="value in sortValuesByKeys(row.data)" :key="value">{{ value }}</td>
                    <td>
                        <img class="delete_btn" @click.stop="deleteRow(row.data.ID)" src="@/icons/delete_cross.svg" alt="X" />
                    </td>
                </tr>
                <tr v-if="hasChildren(row)" :class="{ children: true, hidden: !visibleChildren.includes(row.data.ID) }">
                    <td :colspan="keys.length + 2">
                        <Table :data="getFirstChildrenRecords(row)" :parentID="row.data.ID" />
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
