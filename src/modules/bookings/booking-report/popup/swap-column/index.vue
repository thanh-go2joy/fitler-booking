<template>
  <el-dialog :visible.sync="ui.dialogFormVisible" top="4vh">
    <p slot="title" style="font-size: 20px;">{{ $t('page.bookingReport.adjustColumn') }}</p>
    <el-table-draggable handle="td" class="el-dialog-content">
      <el-table
        ref="multipleTable"
        row-key="label"
        v-loading="ui.isLoading"
        :data="columns"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="canSelectRow"
          width="55">
        </el-table-column>
        <el-table-column
          :label="$t('page.bookingReport.selectAll')"
          min-width="120"
        >
          <template slot-scope="scope">
            <p>{{ $t('page.bookingReport.'+scope.row.label) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="24"
        >
          <i>
            <img :src="ui.threeLineSrc" alt="go2jot_line" width="20" />
          </i>
        </el-table-column>
      </el-table>
    </el-table-draggable>
    <div slot="footer">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-button class="w-100" @click="onReetColumnToDefault">{{ $t('page.bookingReport.default') }}</el-button>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-button class="w-100" type="primary" :loading="ui.isSubmiting" @click="onChangeColumn">{{ $t('page.bookingReport.adjustColumn') }}</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import ElTableDraggable from 'el-table-draggable'

export default {
  name: 'PopupSwapColumn',
  components: {
    ElTableDraggable
  },
  data () {
    return {
      ui: {
        isLoading: false,
        isSubmiting: false,
        dialogFormVisible: false,
        threeLineSrc: require('@/assets/images/svg/three-line.svg')
      },
      columns: [],
      columnChecked: [],
      columnDetault: []
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      return rowIndex === 0 || rowIndex === 1 || rowIndex === 16 ? 'disable-action' : ''
    },
    canSelectRow (row, index) {
      return !(index === 0 || index === 1 || index === 16)
    },
    async open (tableColumn, columnDetault) {
      await this.onResetColumn()
      this.ui.isLoading = true
      this.columnDetault = columnDetault
      this.columns = tableColumn
      const columnChecked = tableColumn.filter(item => item.show)
      this.toggleSelection(columnChecked)
    },
    toggleSelection (rows) {
      this.ui.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        }
      })
      this.ui.isLoading = false
    },
    handleSelectionChange (data) {
      data.map(item => {
        item.show = true
      })
      this.columnChecked = data
    },
    onChangeColumn () {
      var columnChecked = new Set(this.columnChecked)
      var difference = [...new Set([...this.columns].filter(x => !columnChecked.has(x)))]
      difference.map(item => {
        item.show = false
      })
      this.$emit('onSuccess', this.columns)
      this.ui.dialogFormVisible = false
    },
    onReetColumnToDefault () {
      this.$emit('onSuccess', this.columnDetault)
      this.ui.dialogFormVisible = false
    },
    onResetColumn () {
      this.columns = []
      this.columnChecked = []
      this.columnDetault = []
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: 26vw;
  @media (max-width: 640px) {
    width: 90vw;
  }
  .el-dialog__header,
  .el-dialog__body {
    text-align: left;
    padding: 16px 20px;
    .el-form-item {
      margin-bottom: unset;
    }
  }
}
.el-dialog-content {
  height: 62vh;
  overflow: auto;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    margin: 5px 0;
    background-color: #DCDFE6;
  }
  &::-webkit-scrollbar-thumb:hover {
    width: 12px;
    background: #999999;
  }
}
:deep(.disable-action) {
  pointer-events: none;
}
:deep(.el-table__header) {
  .el-checkbox {
    padding: 4px;
  }
}
</style>
