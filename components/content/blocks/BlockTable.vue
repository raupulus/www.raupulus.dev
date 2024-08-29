<template>
  <div :id="table.id" class="r-table-container">
    <table class="r-table">
      <thead v-if="table.data.withHeadings && table.data.content.length">
        <tr>
          <th v-for="cell in table.data.content[0]">{{ cell }}</th>
        </tr>
      </thead>


      <tbody v-if="table.data.content.length">

        <tr v-for="row, idxRow in table.data.content">
          <td v-if="table.data.withHeadings && idxRow >= 1" v-for="cell, idx in row">
            <span class="r-table-field-head">{{ table.data.content[0][idx] }}:</span>{{ cell }}
          </td>

          <td v-else-if="!table.data.withHeadings" v-for="cell in row">{{ cell }}</td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { BlockTableType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const table = props.block as BlockTableType
</script>

<style scoped>
.r-table-container {
  margin: 1rem 0;
  width: 100%;
  box-sizing: border-box;
}

.r-table {
  margin: auto;
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 24px 5px rgba(185, 188, 191, 0.2);
  border-radius: 5px;
  overflow: auto;
}

.r-table thead th {
  padding: 10px 16px;
  text-align: center;
  background-color: #f3f3f5;
}

.r-table tbody tr td {
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
}

.r-table-field-head {
  display: none;
}

@media screen and (max-width: 767px) {
  .r-table {
    background-color: transparent;
    box-shadow: none;
  }

  .r-table thead {
    display: none;
  }

  .r-table tbody tr {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    padding: 1rem;
    position: relative;
    background-color: #fff;
    box-shadow: 0 0 24px 5px rgba(185, 188, 191, 0.2);
  }

  .r-table tbody tr td {
    display: flex;
    background-color: transparent;
    padding: 0;
    margin-bottom: 5px;
    margin-right: 16px;
    border: none;
    flex-wrap: wrap;
  }

  .r-table-field-head {
    display: block;
    font-weight: 700;
    margin-right: 5px;
  }
}
</style>
