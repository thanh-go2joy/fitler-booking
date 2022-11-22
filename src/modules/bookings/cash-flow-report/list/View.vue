<template>
  <sa-section class="cash-flow-mgt">
    <template slot="header">
      <div class="cash-flow-mgt__filter" :class="ui.isTableLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="custom-height">
            <sa-select-check
              v-model="filter.hotelStatus"
              :model-check-all="checkBox.checkAllStatus"
              :options="ui.statusOptions"
              :isLoadingDataParent="ui.isTableLoading"
              @changeCheckAll="handleCheckAllStatus"
              @input="handleCheckedStatus"
              translate
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="5" :xl="3" class="custom-height">
            <sa-select-check
              :isCheckAll="true"
              v-model="filter.provinceSn"
              :model-check-all="checkBox.checkAllProvinces"
              label="sn"
              keyValue="name"
              :options="provinces"
              :isLoadingDataParent="ui.isTableLoading"
              @changeCheckAll="handleCheckAllProvinces"
              @input="handleCheckedProvince"
              :loadingButton="ui.provincesLoading"
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-select
              v-model="filter.deviceType"
            >
              <el-option
                v-for="(item, index) in ui.deviceTypeOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="5" :xl="3">
            <el-select
              v-model="filter.source"
            >
              <el-option
                v-for="(item, index) in ui.sourceOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="3">
            <el-select
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
            >
              <el-option
                v-for="(item, index) in hotels"
                :key="index"
                :label="item.name"
                :value="{sn: item.sn,status: item.hotelStatus}"
                style="font-size: 13px; color: #4a5d6e;"
              >
                <div class="cash-flow-mgt__filter--text-line cash-flow-mgt__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="cash-flow-mgt__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="5">
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
          <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="4">
            <el-select
              v-model="filter.type"
            >
              <el-option
                v-for="(item, index) in ui.timeTypeOptions"
                :key="index"
                :label="$t(`${item.key}`)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="6" :md="5" :lg="3" :xl="2">
            <el-button
              type="primary"
              plain
              @click="changeFilter"
            >
              {{ $t('button.search') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3">
            <el-button v-if="hasPermission('sabooking', 'pExport')" type="success" icon="el-icon-download" plain :loading="ui.isExporting"  @click="onExport">
              {{ $t('button.export') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
              <!-- <router-link v-if="hasPermission('sahoteldebt', 'pView')" :to="{name: 'sendMail',
                  params: {
                    startDate: filter.startDate,
                    endDate: filter.endDate
                  }
                }"
                class="el-button el-button--default is-plain">
                  <i class="el-icon-s-promotion"/>
                  {{ $t('button.sendMail') }}
              </router-link> -->
              <el-button v-if="hasPermission('sahoteldebt', 'pView')" icon="el-icon-s-promotion" plain  @click="onSendMail">
                {{ $t('button.sendMail') }}
              </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      ref="cashFlowReport"
      max-height="580px"
      :data="dataList"
      v-loading="ui.isTableLoading"
      :cell-class-name="tableCellClassName"
    >
    <el-table-column :min-width="240"
        :label="$t('page.cashFlowReport.hotelName')"
        :fixed="isFixedLeft"
      >
        <template slot-scope="scope">
          <router-link
            type="primary"
            :to="{
              name: 'cashFlowReportDetail',
              query: {
                sn: scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                hotelStatus: `${setData().hotelStatus}`
              }
            }"
          >
            {{ scope.row.hotelName }}
          </router-link>
          <br />
          <p>
            {{ scope.row.hotelCode }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
            <span>{{ $t('page.cashFlowReport.totalCFBooking') }}</span>
            <el-tooltip class="ml-4" effect="light" :content="$t('page.cashFlowReport.describeTotalCFBooking')" placement="bottom">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
        </template>
        <template slot-scope="scope">
          <p>{{ scope.row.totalBooking }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
            <span>{{ $t('page.cashFlowReport.totalCFAgoda') }}</span>
            <el-tooltip class="ml-4" effect="light" :content="$t('page.cashFlowReport.describeTotalCFAgoda')" placement="bottom">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
        </template>
        <template slot-scope="scope">
          <p>{{ scope.row.totalAgodaBooking }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
            <span>{{ $t('page.cashFlowReport.totalCFGo2Joy') }}</span>
            <el-tooltip class="ml-4" effect="light" :content="$t('page.cashFlowReport.describeTotalCFGo2Joy')" placement="bottom">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
        </template>
        <template slot-scope="scope">
          <p>{{ scope.row.totalGo2JoyBooking }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
          <p>{{ this.$t('page.cashFlowReport.productAmount') }}</p>
          <p>{{ this.$t('page.cashFlowReport.extraFee') }}</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.productValue) }}</p>
          <p>{{ formatMoneyUI(scope.row.extraFee) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(1)</span>
            {{ this.$t('page.cashFlowReport.totalAmount') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.totalAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160" >
        <template slot="header">
          <p>
            <span class="text-danger">(2)</span>
            {{ this.$t('page.cashFlowReport.g2jDiscount') }}
          </p>
          <p>
            <span class="text-danger">(3)</span>
            {{ this.$t('page.cashFlowReport.hotelDiscount') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.totalGo2joyDiscount) }}</p>
          <p>{{ formatMoneyUI(scope.row.totalHotelDiscount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="180">
        <template slot="header">
          <p>
            <span class="text-danger">(4)</span>
            {{ this.$t('page.cashFlowReport.userPay') }}
          </p>
          <p class="text-danger">(1) - (2) - (3)</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.amountFromUser) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(5)</span>
            {{ this.$t('page.cashFlowReport.paidInAdvance') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.prepayAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(6)</span>
            {{ this.$t('page.cashFlowReport.commission') }}
          </p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.totalCommissionAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>
            <span class="text-danger">(7)</span>
            {{ this.$t('page.cashFlowReport.balance') }}
          </p>
          <p>{{ this.$t('page.cashFlowReport.receivable') }}</p>
          <p>{{ this.$t('page.cashFlowReport.payable') }}</p>
          <p class="text-danger">(6) - (2) - (5)</p>
        </template>
        <template slot-scope="scope">
          <p>{{ formatMoneyUI(scope.row.theBalance) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>{{ this.$t('page.cashFlowReport.currentDebt') }},</p>
          <p>{{ this.$t('page.cashFlowReport.otherDebt') }}</p>
        </template>
        <template slot-scope="scope" v-if="!scope.row.total">
          <p>{{ formatMoneyUI(scope.row.currentDebt) }}</p>
          <p>{{ formatMoneyUI(scope.row.ortherDebt) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160"
        :label="$t('page.cashFlowReport.periodDebt')"
      >
        <template slot-scope="scope" v-if="!scope.row.total">
          <p :class="isColorRed(scope.row)">
            {{ formatMoneyUI(scope.row.periodDebt) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :min-width="160">
        <template slot="header">
          <p>{{ this.$t('page.cashFlowReport.expectedPay') }},</p>
          <p>{{ this.$t('page.cashFlowReport.payAmount') }}</p>
        </template>
        <template slot-scope="scope" v-if="!scope.row.total">
          <p>{{ formatMoneyUI(scope.row.expectedPay) }}</p>
          <p>{{ formatMoneyUI(scope.row.payAmount) }}</p>
        </template>
      </el-table-column>
      <el-table-column :min-width="120"
        :fixed="isFixedRight"
        align="center"
        :label="$t('action')"
      >
        <template slot-scope="scope">
          <el-popover
              placement="left"
              trigger="click"
            >
            <el-button
              v-show="isShowOperations(scope.row)"
              slot="reference" type="primary" plain size="small">
                {{ $t('action')}}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
              <el-row :gutter="20" class="operations-btn">
                <el-col v-show="scope.row.origin != 2 && hasPermission('sahoteldebt', 'pView')" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-button
                    class="w-100"
                    type="primary"
                    plain
                    size="small"
                    @click="onDirectHotelDebt(scope.row)"
                  >
                    {{ $t('page.cashFlowReport.hotelDebt') }}
                  </el-button>
                </el-col>
                <el-col v-show="hasPermission('sabooking', 'pExport')" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-button
                    class="w-100"
                    type="info"
                    plain
                    size="small"
                    :loading="ui.isRowExporting"
                    @click="onExportById(scope.row.hotelSn)"
                  >
                    {{ $t('button.export') }}
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
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
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
import { listCashFlow, onExportCashFlow, onExportCashFlowByID } from './api'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { fetchProvinces } from '@/api/province'
import { debounce, scrollToTop } from '@/utils/helpers'
import SaSelectCheck from '@/components/globals/SaSelectCheck.vue'
import { BOOKING_ORIGIN, repStatus, TIME_TYPE_OPTIONS, SOURCE_OPTIONS_FILTERS, DEVICE_TYPE_OPTIONS, STATUS_OPTIONS } from '@/utils/const'

const timeDebounce = 500
const timeDebounceSecond = 1000
const today = new Date()
const allHotelStatus = [3, 4, 5, 6]
export default {
  name: 'CashFlowReport',
  components: {
    saSection,
    SaSelectCheck
  },
  data () {
    return {
      filter: {
        source: 0,
        limit: 10,
        page: 1,
        provinceSn: [],
        startDate: this.formatDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
          false
        ),
        endDate: this.formatDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          false
        ),
        type: 1,
        deviceType: 0,
        hotelStatus: [3, 4, 5, 6],
        bookingStatus: 0
      },
      pagination: {},
      ui: {
        isExporting: false,
        isRowExporting: false,
        isTableLoading: false,
        isLoadingHotel: false,
        provinceOptions: [],
        hotel: {},
        timeTypeOptions: TIME_TYPE_OPTIONS,
        statusOptions: STATUS_OPTIONS,
        deviceTypeOptions: DEVICE_TYPE_OPTIONS,
        sourceOptions: SOURCE_OPTIONS_FILTERS
      },
      checkBox: {
        checkAllStatus: true,
        checkAllProvinces: true
      },
      hotels: [],
      data: [],
      provinces: [],
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
    this.listProvinces()
    this.changeFilter()
  },
  methods: {
    setData () {
      const formData = { ...this.filter }
      formData.hotelStatus = JSON.stringify(formData.hotelStatus)
      formData.provinceSn = JSON.stringify(formData.provinceSn)

      if (JSON.parse(formData.hotelStatus).length === allHotelStatus.length) {
        formData.hotelStatus = '[]'
      }
      if (JSON.parse(formData.provinceSn).length === this.ui.provinceOptions.length) {
        formData.provinceSn = '[]'
      }
      return formData
    },
    tableCellClassName ({ row }) {
      if (row.haveHotelInviteSn) return 'bg-antique'
      else return ''
    },
    isColorRed (row) {
      if (row.periodDebt && row.periodDebt !== row.theBalance) return 'text-danger bold'
      else return ''
    },
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = this.isFixedRight = null
      } else {
        this.isFixedLeft = !this.ui.isTableLoading ? 'left' : null
        this.isFixedRight = !this.ui.isTableLoading ? 'right' : null
      }
      this.$nextTick(() => {
        this.$refs.cashFlowReport.bodyWrapper.scrollTop = 0
      })
    },
    changeFilter () {
      this.filter.page = 1
      this.listCashFlow()
    },
    isShowOperations (row) {
      return !row.total && (this.hasPermission('sabooking', 'pExport') || (row.origin !== BOOKING_ORIGIN.agoda && this.hasPermission('sahoteldebt', 'pView')))
    },
    async listCashFlow () {
      this.ui.isTableLoading = true
      try {
        if (this.ui.hotel?.status === -1) {
          this.filter.hotelGroupSn = this.ui.hotel?.sn
        } else {
          this.filter.hotelSn = this.ui.hotel?.sn
        }

        const params = this.setData()
        const { data } = await listCashFlow(params)
        if (data?.code === repStatus.sussess) {
          this.data = data.data.cashFlowList
          const statistics = data.data.statistics
          statistics.total = true
          this.data.unshift(statistics)
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
    async listProvinces () {
      this.ui.provincesLoading = true
      try {
        const { data } = await fetchProvinces({ limit: 100, status: 1 })
        if (data?.code === repStatus.sussess) {
          this.provinces = data.data.provinces
          this.ui.provinceOptions = await data.data.provinces.reduce(
            function async (preValue, curValue) {
              return preValue.concat(curValue.sn)
            },
            []
          )
          this.filter.provinceSn = [...this.ui.provinceOptions]
        }
      } catch (error) {
        return false
      } finally {
        this.ui.provincesLoading = false
      }
    },
    async onExport () {
      this.ui.isExporting = true
      try {
        if (this.ui.hotel?.status === -1) {
          this.filter.hotelGroupSn = this.ui.hotel?.sn
        } else {
          this.filter.hotelSn = this.ui.hotel?.sn
        }
        const formData = this.setData()
        delete formData.limit
        delete formData.page
        const { data } = await onExportCashFlow(formData)

        if (data?.code === repStatus.sussess) {
          this.$message({
            type: 'success',
            message: this.$t('message.exportSuccess')
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isExporting = false
      }
    },
    async onExportById (id) {
      this.ui.isRowExporting = true
      try {
        const params = {
          startDate: this.filter.startDate,
          endDate: this.filter.endDate,
          type: this.filter.type,
          deviceType: this.filter.deviceType,
          hotelSn: id
        }
        const { data } = await onExportCashFlowByID(params)
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
    handleCheckAllStatus (val) {
      this.checkBox.checkAllStatus = val
      this.filter.hotelStatus = val ? allHotelStatus : []
    },
    handleCheckedStatus: debounce(function (value) {
      this.checkBox.checkAllStatus = value.length === allHotelStatus.length
    }, timeDebounceSecond),
    handleCheckAllProvinces (val) {
      this.checkBox.checkAllProvinces = val
      this.filter.provinceSn = val ? this.ui.provinceOptions : []
    },
    handleCheckedProvince: debounce(function (value) {
      this.checkBox.checkAllProvinces = value.length === this.ui.provinceOptions.length
    }, timeDebounceSecond),
    onSizeChange (size) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = size
      if (this.filter.page === 1) {
        this.listCashFlow()
      }
    },
    onCurrentChange (currentPage) {
      this.filter.page = currentPage
      this.listCashFlow()
    },
    onDirectHotelDebt (row) {
      // v1
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/detail-list-hotel-debt-mgt?hotelSn=${row.hotelSn}&dateFrom=${this.filter.startDate}&dateTo=${this.filter.endDate}&${dataAccountDirectToV1}`
      // v2
      // this.$router.push({ name: 'hotelDebtDetail', params: { sn: row.hotelSn } })
    },
    onSendMail () {
      const dataAccountDirectToV1 = `sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      window.location.href = `${process.env.VUE_APP_DOMAIN_V1}/create-sending-mail-mgt?dateFrom=${this.filter.startDate}&dateTo=${this.filter.endDate}&${dataAccountDirectToV1}`
    }
  }
}
</script>

<style lang="scss" scoped>
.cash-flow-mgt {
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
  :deep(.el-button), :deep(.el-select) {
    width: 100%;
  }
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
.el-select-dropdown__item {
  height: auto;
}
.operations-btn {
  width: 150px
}
.custom-height {
  height: 52px;
  @media (min-width: 769px) {
    height: 0
  }
}
:deep(.bg-antique) {
  background: var(--antique-white-color)
}
</style>
