<template>
  <sa-section class="hotel-debt">
    <template slot="header">
      <div class="hotel-debt__header" :class="ui.isTableLoading ? 'is-disabled' : ''">
        <el-row class="flex-center">
          <el-col :xs="24" :sm="16" :md="16" :lg="18" :xl="16">
            <b v-if="hotelName">{{ hotelName }}</b>
            <i v-else class="el-icon-loading"></i>
          </el-col>
          <el-col :xs="24" :sm="8" :md="10" :lg="12" :xl="12">
            <el-button v-if="hotelName" class="w-100" type="success" icon="el-icon-download" plain  @click="onExport">
              {{ $t('button.export') }}
            </el-button>
            <i v-else class="el-icon-loading"></i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="8" :md="12" :lg="12" :xl="12">
            <el-button
              class="w-100"
              type="warning"
              plain
              @click="onDirectNewHotelDebt"
              icon="el-icon-plus"
            >
              {{ $t('page.hotelDebt.new_hotel_debt') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="8" :md="12" :lg="12" :xl="12">
            <el-button
              class="w-100"
              type="warning"
              plain
              @click="onDirectNewHotelPaid"
              icon="el-icon-plus"
            >
              {{ $t('page.hotelDebt.new_hotel_paid') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      ref="hotelDebtDetailList"
      max-height="580px"
      :data="dataList"
      v-loading="ui.isTableLoading"
    >
      <el-table-column :min-width="150" align="right" :fixed="isFixedLeft"
        :label="$t('page.hotelDebt.current_debt')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.currentDebt) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.period_debt')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.periodDebt) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="200"
        :label="$t('page.hotelDebt.period_debt_time')"
      >
        <template slot-scope="scope">
          <p>{{ setPeriodDebtTime(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="100"
        :label="$t('page.hotelDebt.pay_date')"
      >
        <template slot-scope="scope">
          <p>{{ formatDateUI(scope.row.payDate, false) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.other_debt')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.otherDebt) }}</p>
          <p v-else class="text-danger">{{ formatMoneyUI(scope.row.otherDebt) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.pay_amount')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.payAmount) }}</p>
          <p v-else class="text-danger">{{ formatMoneyUI(scope.row.payAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.balance')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.balance) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150"
        :label="$t('page.hotelDebt.create_time')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">
            {{ formatDateUI(scope.row.createTime) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :min-width="120" :fixed="isFixedRight" align="center"
        :label="$t('action')"
      >
        <template slot-scope="scope">
          <el-popover
              placement="left"
              trigger="click"
            >
            <el-button
              v-if="scope.$index !== 0"
              slot="reference" type="primary" plain size="small">
                {{ $t('action')}}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-row :gutter="20" class="operations-btn">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-button
                    class="w-100"
                    type="primary"
                    plain
                    size="small"
                    @click="onDirectDetail(scope.row)"
                  >
                    {{ $t('button.detail') }}
                  </el-button>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-button
                    class="w-100"
                    type="success"
                    plain
                    size="small"
                    @click="onEdit(scope.row)"
                  >
                    {{ $t('button.edit') }}
                  </el-button>
                </el-col>
                <el-col v-show="isShowDeleteButton(scope.row)" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-button
                    class="w-100"
                    type="danger"
                    plain
                    size="small"
                    :loading="ui.isDeleting"
                    @click="onDelete(scope.row)"
                  >
                    {{ $t('button.delete') }}
                  </el-button>
                </el-col>
              </el-row>
            </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :class="ui.isTableLoading ? 'is-disabled' : ''"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.perPage"
        :current-page="pagination.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      />
    </template>
  </sa-section>
</template>
<script>
import saSection from '@/components/globals/SaSection.vue'
import { listHotetDebt, onExportHotetDebt, onDelete } from './api'
import { repStatus } from '@/utils/const'
import { scrollToTop } from '@/utils/helpers'

export default {
  name: 'HotelDebtDetailList',
  components: {
    saSection
  },
  data () {
    return {
      filter: {
        limit: 10,
        page: 1,
        hotelSn: Number(this.$route.params.sn)
      },
      pagination: {},
      ui: {
        isTableLoading: false,
        isDeleting: false
      },
      hotelName: '',
      data: [],
      isFixedRight: null,
      isFixedLeft: null
    }
  },
  created () {
    this.fetchHotetDebt()
  },
  computed: {
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.data
    }
  },
  methods: {
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = this.isFixedRight = null
      } else {
        this.isFixedLeft = !this.ui.isTableLoading ? 'left' : null
        this.isFixedRight = !this.ui.isTableLoading ? 'right' : null
      }
      this.$nextTick(() => {
        this.$refs.hotelDebtDetailList.bodyWrapper.scrollTop = 0
      })
    },
    isShowDeleteButton (row) {
      return row.finalRecord === 1
    },
    setPeriodDebtTime (row) {
      return row.startDate ? `${this.formatDateUI(row.startDate, false)} ~ ${this.formatDateUI(row.endDate, false)}` : ''
    },
    async fetchHotetDebt () {
      this.ui.isTableLoading = true
      try {
        const params = { ...this.filter }
        const { data } = await listHotetDebt(params)
        if (data?.code === repStatus.sussess) {
          this.data = data.data.hotelDebts
          this.hotelName = this.data[0].hotel.name
          this.data.unshift(data.data.statistics)
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isTableLoading = false
      }
    },
    async onExport () {
      try {
        const formData = { ...this.filter }
        const { data } = await onExportHotetDebt(formData)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: this.$t('message.exportSuccess')
          })
        }
      } catch (error) {
        return false
      }
    },
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchHotetDebt()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchHotetDebt()
    },
    onDirectDetail (row) {
      this.$router.push({ name: 'hotelDebtDetail', params: { sn: row.sn } })
    },
    onEdit (row) {
      this.$router.push({ name: 'hotelDebtEdit', params: { sn: row.sn } })
    },
    async onDelete (row) {
      this.$confirm(`${this.$t('message.areYouSure')}`, `${this.$t('button.delete')}`, {
        confirmButtonText: this.$t('button.ok'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(async () => {
          this.ui.isDeleting = true
          try {
            const { data } = await onDelete(row.sn)
            if (data?.code === repStatus.sussess) {
              this.$message({
                type: 'success',
                message: this.$t('message.deleteSuccess')
              })
            }
            this.fetchHotetDebt()
          } catch (error) {
            return false
          } finally {
            this.ui.isDeleting = false
          }
        })
        .catch((error) => {
          this.ui.isDeleting = false
          this.$message({
            type: 'info',
            message: error.response ? error.response.data.message : error
          })
        })
    },
    onDirectNewHotelDebt () {
      this.$router.push({ name: 'hotelDebtCreate' })
    },
    onDirectNewHotelPaid () {
      this.$router.push({ name: 'hotelDebtCreatePaid' })
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-debt {
    &__header {
      display: flex;
      justify-content: space-between;
      @media (max-width: 768px) {
        display: block;
      }
    }
  }
  .flex-center {
    display:flex;
    align-items: center
  }
  .el-popover {
    .el-row {
      margin: 4px 0 !important;
    }
    .el-col {
      padding: 2px 10px;;
      button {
        margin: 2px 0;
      }
    }
  }
  .el-col {
    padding: 6px 10px;
  }
  .w-100 {
    width: 100% !important;
  }
  .operations-btn {
    width: 150px
  }
</style>
