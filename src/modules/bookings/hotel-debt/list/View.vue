<template>
  <sa-section class="hotel-debt">
    <template slot="header">
      <div class="hotel-debt__header">
        <el-row :class="ui.isTableLoading ? 'is-disabled' : ''">
          <el-col :xs="24" :sm="16" :md="14" :lg="14" :xl="14">
            <el-select
              class="w-100"
              :loading="ui.isLoadingHotel"
              v-model="ui.hotel"
              value-key="sn"
              element-loading-spinner="el-icon-loading"
              remote
              filterable
              prefix-icon="el-icon-search"
              clearable
              :placeholder="$t('page.hotelDisplay.hotelName')"
              :remote-method="searchSuggestionsHotels"
              @change="listHotetDebt"
            >
              <el-option
                  v-for="(item, index) in hotels"
                  :key="index"
                  :label="`${item.name} - ${item.address}`"
                  :value="{sn: item.sn,status: item.hotelStatus}"
              >
                <div class="hotel-debt__filter--text-line hotel-debt__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="hotel-debt__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="10" :lg="10" :xl="10">
            <el-button class="w-100" type="success" icon="el-icon-download" plain  @click="onExport">
              {{ $t('button.export') }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
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
      ref="hotelDebt"
      max-height="580px"
      :data="dataList"
      v-loading="ui.isTableLoading"
    >
      <el-table-column :min-width="220" :fixed="isFixedLeft"
        :label="$t('page.hotelDebt.hotel_name')"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.hotel">{{ scope.row.hotel.name }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
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
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.pay_amount')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.payAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="150" align="right"
        :label="$t('page.hotelDebt.balance')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatMoneyUI(scope.row.balance) }}</p>
          <p v-else class="text-danger">{{ formatMoneyUI(scope.row.balance) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="140"
        :label="$t('page.hotelDebt.create_time')"
      >
        <template slot-scope="scope">
          <p v-if="scope.$index !== 0">{{ formatDateUI(scope.row.createTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="100" :fixed="isFixedRight" align="center"
        :label="$t('action')"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.$index !== 0"
            class="w-100"
            type="primary"
            plain
            size="small"
            @click="onDirectDetail(scope.row)"
          >
            {{ $t('button.detail') }}
          </el-button>
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
import { listHotetDebt, onExportHotetDebt } from './api'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { debounce, scrollToTop } from '@/utils/helpers'
import { repStatus } from '@/utils/const'

const timeDebounce = 500
const today = new Date()
export default {
  name: 'HotelDebt',
  components: {
    saSection
  },
  data () {
    return {
      filter: {
        limit: 10,
        page: 1,
        startDate: this.formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
          false
        ),
        endDate: this.formatDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          false
        )
      },
      pagination: {},
      ui: {
        isTableLoading: false,
        isLoadingHotel: false,
        hotel: {}
      },
      hotels: [],
      data: [],
      isFixedRight: null,
      isFixedLeft: null
    }
  },
  computed: {
    dateRange: {
      get () {
        return [this.filter.startDate, this.filter.endDate]
      },
      set (val) {
        this.filter.startDate = val[0]
        this.filter.endDate = val[1]
      }
    },
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.data
    }
  },
  created () {
    this.listHotetDebt()
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
        this.$refs.hotelDebt.bodyWrapper.scrollTop = 0
      })
    },
    setPeriodDebtTime (row) {
      return row.startDate ? `${this.formatDateUI(row.startDate, false)} ~ ${this.formatDateUI(row.endDate, false)}` : ''
    },
    async listHotetDebt () {
      this.ui.isTableLoading = true
      try {
        if (this.ui.hotel?.status === -1) {
          this.filter.hotelGroupSn = this.ui.hotel?.sn
        } else {
          this.filter.hotelSn = this.ui.hotel?.sn
        }
        const params = { ...this.filter }
        const { data } = await listHotetDebt(params)
        if (data?.code === repStatus.sussess) {
          this.data = data.data.hotelDebts
          this.data.unshift(data.data.statistics)
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isTableLoading = false
      }
    },
    searchSuggestionsHotels: debounce(function (keyword) {
      this.listSuggestionsHotels({
        limit: 10,
        keyword: keyword
      })
    }, timeDebounce),
    async listSuggestionsHotels (params) {
      this.ui.isLoadingHotel = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.hotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingHotel = false
      }
    },
    async onExport () {
      try {
        if (this.ui.hotel?.status === -1) {
          this.filter.hotelGroupSn = this.ui.hotel?.sn
        } else {
          this.filter.hotelSn = this.ui.hotel?.sn
        }
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
        this.listHotetDebt()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.listHotetDebt()
    },
    onDirectNewHotelDebt () {
      this.$router.push({ name: 'hotelDebtCreate' })
    },
    onDirectNewHotelPaid () {
      this.$router.push({ name: 'hotelDebtCreatePaid' })
    },
    onDirectDetail (row) {
      this.$router.push({ name: 'hotelDebtDetailList', params: { sn: row.hotelSn } })
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
    &__filter {
      &--text-line {
        line-height: 24px;
      }
      &--text-distance {
        padding: 4px 0;
      }
      &--text-size {
        font-size: 13px
      }
    }
  }
  .el-select-dropdown__item {
    height: auto;
  }
</style>
