<script setup lang="ts">
import { onMounted } from "vue";
import Table from "@/components/Table.vue";
import { useTableStore } from "@/stores/table";

const tableStore = useTableStore();

onMounted(() => {
  tableStore.loadData();
});
</script>

<template>
  <div class="data_container">
    <!-- Loading -->
    <div v-if="tableStore.loading" class="loading">
      <h3>Loading data...</h3>
    </div>

    <!-- Error -->
    <div v-else-if="tableStore.error" class="error">
      <h3>Error Loading Data</h3>
      <p>{{ tableStore.error }}</p>
      <button @click="tableStore.loadData()">Try again</button>
    </div>

    <!-- No data -->
    <div v-else-if="!tableStore.hasData" class="no_data">
      <h3>No data...</h3>
    </div>

    <!-- Data -->
    <Table v-else :data="tableStore.data" />
  </div>
</template>

<style lang="scss" src="@/styles/main.scss"></style>
