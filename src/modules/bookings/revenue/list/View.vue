<template>
  <sa-section
    class="revenue-report"
  >
    <template slot="header">
      <div class="revenue-report__filter" :class="ui.isLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="custom-height">
            <sa-select-check
              v-model="filter.hotelStatus"
              :indeterminate="checkBox.isIndeterminateStatus"
              :model-check-all="checkBox.checkAllStatus"
              :options="ui.hotelStatusOptions"
              translate
              @changeCheckAll="handleCheckAllStatus"
              @input="handleCheckedStatus"
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="5" :lg="4" :xl="3">
            <el-select
              v-model="filter.source"
            >
              <el-option
                v-for="(item, index) in ui.sourceOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-select
              v-model="filter.provinceSn"
              :placeholder="$t('page.settings.province')"
              :loading="ui.provincesLoading"
            >
              <el-option
                v-for="(item, index) in provinces"
                :key="index"
                :label="index !== 0 ? item.name : $t(item.name)"
                :value="item.sn"
              />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="7" :lg="6" :xl="3">
            <el-select
              v-model="hotelSelected"
              :loading="ui.hotelsLoading"
              :placeholder="$t('page.bookingReport.hotel_name')"
              remote
              filterable
              :remote-method="searchSuggestionsHotels"
              prefix-icon="el-icon-search"
              clearable
              value-key="sn"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="(item, index) in listSuggestionsHotels"
                :key="index"
                :label="item.name"
                :value="item"
              >
                <div class="revenue-report__filter--text-line revenue-report__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="revenue-report__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5">
            <el-date-picker
              class="w-100"
              v-model="dateRange"
              type="daterange"
              popper-class="custom-date-range"
              range-separator="-"
              :start-placeholder="$t('page.firstBooking.startDate')"
              :end-placeholder="$t('page.firstBooking.endDate')"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false"
            />
          </el-col>
          <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="2">
            <el-button
              class="w-100"
              type="primary"
              plain
              @click="changeFilter"
            >
              {{ $t('button.search') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-button
              type="success"
              plain
              @click="handleExportFile"
              icon="el-icon-download"
              :loading="ui.exportLoading"
            >
              {{ $t('button.export') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <upload-file
              accept=".xlsx, .xls, .csv"
              @change="handleImportFile"
            >
              {{ $t('page.sms.importFile') }}
            </upload-file>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      ref="revenueReport"
      max-height="580px"
      v-loading="ui.isLoading"
      :data="dataList"
      :cell-class-name="setCLassIndexColumn"
    >
      <el-table-column min-width="180" :fixed="isFixedLeft"
        :label="$t('page.revenueReport.hotelName')"
      >
        <template slot-scope="scope">
          <router-link :to="{ name: 'revenueReportDetails', params: { sn: scope.row.hotelSn } }">
            {{ scope.row.hotelName }}
          </router-link>
          <p>{{ scope.row.hotelCode }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160"
        prop="companyCode"
        :label="$t('page.revenueReport.companyCode')"
      >
      </el-table-column>
      <el-table-column min-width="160"
        prop="totalTransaction"
        :label="$t('page.revenueReport.totalTransaction')"
      >
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>{{ $t('page.revenueReport.productAmount') }}</p>
          <p>{{ $t('page.revenueReport.extraFee') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.productAmount) }}</p>
          <p>{{ formatMoneyUI(scope.row.extraFee) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(1)</span>
            {{ $t('page.revenueReport.totalAmount') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.totalAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(2)</span>
            {{ $t('page.revenueReport.go2joyDiscount') }}
          </p>
          <p>
            <span class="text-danger">(3)</span>
            {{ $t('page.revenueReport.hotelDiscount') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.go2joyDiscount) }}</p>
          <p>{{ formatMoneyUI(scope.row.hotelDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="180"
        prop="userPay"
      >
        <template slot="header">
          <p>
            <span class="text-danger">(4)</span>
            {{ $t('page.revenueReport.userPay') }}
          </p>
          <p class="text-danger">(1)-(2)-(3)</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.userPay) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(5)</span>
            {{ $t('page.revenueReport.paidInAdvance') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.paidInAdvance) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(6)</span>
            {{ $t('page.revenueReport.commission') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.commission) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="160">
        <template slot="header">
          <p>{{ $t('page.revenueReport.balance') }}</p>
          <p>{{ $t('page.revenueReport.receivable') }}</p>
          <p>{{ $t('page.revenueReport.payable') }}</p>
          <p><span class="text-danger">(6)-(2)-(5)</span></p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.balance) }}</p>
        </template>
      </el-table-column>
      <el-table-column min-width="140" :fixed="isFixedRight"
        :label="$t('action')"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.total"
            type="success"
            plain
            icon="el-icon-download"
            :loading="ui.isRowExporting"
            @click="handleExportFileRow(scope.row.hotelSn)"
          >
            {{ $t('button.export') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :class="ui.isLoading ? 'is-disabled' : ''"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pagination.perPage"
        :current-page="pagination.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </template>
  </sa-section>
</template>
<script>
import SaSelectCheck from '@/components/globals/SaSelectCheck.vue'
import SaSection from '@/components/globals/SaSection.vue'
import { fetchRevenues, updateCompanyCode, exportRevenues, exportRevenuesInternal } from './api'
import { debounce, scrollToTop } from '@/utils/helpers'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { fetchProvinces } from '@/api/province'
import UploadFile from '@/components/globals/UploadFile.vue'
import { repStatus, SOURCE_OPTIONS_FILTERS, STATUS_OPTIONS } from '@/utils/const'

const timeDebounce = 500
const allHotelStatus = [3, 4, 5, 6]
export default {
  name: 'RevenueReport',
  components: {
    SaSection,
    SaSelectCheck,
    UploadFile
  },
  data: (vm) => {
    return {
      ui: {
        isRowExporting: false,
        isLoading: false,
        exportLoading: false,
        hotelsLoading: false,
        provincesLoading: false,
        isImporting: false,
        sourceOptions: SOURCE_OPTIONS_FILTERS,
        hotelStatusOptions: STATUS_OPTIONS
      },
      pagination: {},
      filter: {
        source: 0,
        originHotel: 0,
        hotelStatus: allHotelStatus,
        provinceSn: '',
        startDate: vm.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), false),
        endDate: vm.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), false),
        limit: 10,
        page: 1
      },
      hotelSelected: '',
      checkBox: {
        isIndeterminateStatus: false,
        checkAllStatus: true
      },
      provinces: [],
      revenues: [],
      listSuggestionsHotels: [],
      isFixedLeft: null,
      isFixedRight: null
    }
  },
  created () {
    this.fetchProvinces()
    this.fetchSuggestionsHotels({ limit: 10 })
    this.changeFilter()
  },
  watch: {
    hotelSelected (value) {
      if (this.filter.hotelGroupSn) {
        delete this.filter.hotelGroupSn
      } else if (this.filter.hotelSn) {
        delete this.filter.hotelSn
      }
      if (value) {
        this.filter[value.hotelStatus === -1 ? 'hotelGroupSn' : 'hotelSn'] = value.sn
      }
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
      return this.revenues
    }
  },
  methods: {
    setData () {
      const formData = { ...this.filter }
      formData.hotelStatus = JSON.stringify(formData.hotelStatus)

      if (JSON.parse(formData.hotelStatus).length === this.ui.hotelStatusOptions.length) {
        formData.hotelStatus = '[]'
      }
      formData.provinceSn = `[${formData.provinceSn}]`
      return formData
    },
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = this.isFixedRight = null
      } else {
        this.isFixedLeft = !this.ui.isLoading ? 'left' : null
        this.isFixedRight = !this.ui.isLoading ? 'right' : null
      }
      this.$nextTick(() => {
        this.$refs.revenueReport.bodyWrapper.scrollTop = 0
      })
    },
    changeFilter () {
      this.filter.page = 1
      this.fetchRevenues()
    },
    searchSuggestionsHotels: debounce(function (keySearch) {
      this.fetchSuggestionsHotels({
        limit: 10,
        keyword: keySearch
      })
    }, timeDebounce),
    async fetchRevenues () {
      this.ui.isLoading = true
      try {
        const formData = this.setData()
        const { data } = await fetchRevenues(formData)
        if (data?.code === repStatus.sussess) {
          const statistics = data.data.statistics
          statistics.total = true
          this.revenues = data.data.revenues
          this.revenues.unshift(statistics)
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoading = false
      }
    },
    async fetchProvinces () {
      try {
        this.ui.provincesLoading = true
        const { data } = await fetchProvinces({ limit: 100, status: 1 })
        if (data?.code === repStatus.sussess) {
          this.provinces = [{ name: 'page.revenueReport.all', sn: '' }, ...data.data.provinces]
        }
      } catch (error) {
        return false
      } finally {
        this.ui.provincesLoading = false
      }
    },
    async fetchSuggestionsHotels (params) {
      this.ui.hotelsLoading = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.listSuggestionsHotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.hotelsLoading = false
      }
    },
    async handleExportFileRow (hotelSn) {
      this.ui.isRowExporting = true
      try {
        const params = {
          hotelSn: hotelSn,
          ...this.filter
        }
        delete params.hotelStatus
        delete params.provinceSn
        delete params.limit
        delete params.page
        const { data } = await exportRevenuesInternal(params)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: this.$t('message.exportSuccess')
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isRowExporting = false
      }
    },
    async handleExportFile () {
      this.ui.exportLoading = true
      try {
        const formData = this.setData()
        const { data } = await exportRevenues(formData)
        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: this.$t('message.exportSuccess')
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.exportLoading = false
      }
    },
    async handleImportFile (file) {
      this.ui.isImporting = true
      try {
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await updateCompanyCode(formData)
        if (data?.code === repStatus.sussess) {
          this.changeFilter()
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isImporting = false
      }
    },
    handleCheckAllStatus (val) {
      this.checkBox.checkAllStatus = val
      this.filter.hotelStatus = val ? allHotelStatus : []
      this.checkBox.isIndeterminateStatus = false
    },
    handleCheckedStatus: debounce(function (value) {
      this.checkBox.checkAllStatus = value.length === this.ui.hotelStatusOptions.length
      this.checkBox.isIndeterminateStatus = value.length > 0 && value.length < this.ui.hotelStatusOptions.length
    }, 1000),
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchRevenues()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchRevenues()
    },
    setCLassIndexColumn ({ row, column }) {
      if (row.total === true && column.type === 'index') {
        return 'hidden-index-column'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.hidden-index-column) {
  div {
    display: none;
  }
}
.revenue-report {
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
  :deep(.upload-file__label) {
    padding: 11px 20px;
  }
  :deep(.el-button), :deep(.el-select) {
    width: 100%;
  }
}
.el-col {
  padding: 6px 10px;
}
.w-100 {
  width: 100% !important;
}
.el-select-dropdown__item {
  height: auto;
}
.custom-height {
  height: 52px;
  @media (min-width: 769px) {
    height: 0
  }
}
</style>
