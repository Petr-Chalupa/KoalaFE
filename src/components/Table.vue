<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
    defineProps<{ data?: any[], parentID?: string | null }>(),
    {
        data: () => [],
        parentID: null
    }
);
const emit = defineEmits(["deleteRow"]);

const localData = ref([...props.data]);
const keys = ref<string[]>([]);
const visibleChildren = ref<string[]>([]);

if (props.data?.length > 0) {
    const keySet = new Set<string>();
    for (const item of props.data) {
        Object.keys(item.data).forEach(key => keySet.add(key));
    }
    keys.value = Array.from(keySet);
}

function sortValuesByKeys(obj: Record<string, any>) {
    return keys.value.map(key => obj.hasOwnProperty(key) ? obj[key] : "-");
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
    localData.value = localData.value.filter(row => row.data.ID !== rowID);
    emit("deleteRow", rowID, props.parentID);
}

function handleDeleteRow(rowID: string, parentID: string) {
    if (parentID === null) return;

    const parentRow = localData.value.find(row => row.data.ID === parentID);
    if (!parentRow) return;

    const childKey = Object.keys(parentRow.children)[0];
    if (!childKey) return;

    parentRow.children[childKey].records = parentRow.children[childKey].records.filter((child: any) => child.data.ID !== rowID);
    if (parentRow.children[childKey].records.length === 0) {
        delete parentRow.children[childKey];
    }
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
            <template v-for="(row, index) in localData" :key="row.data.ID">
                <tr :class="{ odd_index: index % 2 != 0 }" @click="toggleChildren(row.data.ID)">
                    <td>
                        <div v-if="Object.keys(row.children).length > 0" :class="{ dropdown: true, open: visibleChildren.includes(row.data.ID) }"></div>
                    </td>
                    <td v-for="value in sortValuesByKeys(row.data)" :key="value">{{ value }}</td>
                    <td>
                        <img class="delete_btn" @click.stop="deleteRow(row.data.ID)" src="@/icons/delete_cross.svg" alt="X" />
                    </td>
                </tr>
                <tr v-if="Object.keys(row.children).length > 0" :class="{ children: true, hidden: !visibleChildren.includes(row.data.ID) }">
                    <td :colspan="keys.length + 2">
                        <Table :data="row.children[Object.keys(row.children)[0]].records" :parentID="row.data.ID" @delete-row="handleDeleteRow" />
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
