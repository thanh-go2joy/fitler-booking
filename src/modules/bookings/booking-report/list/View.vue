<template>
  <sa-section class="booking-rp">
    <template slot="header">
      <div class="booking-rp__filter" :class="ui.bookingReportsLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="custom-height">
            <sa-select-check
              v-model="filter.hotelStatus"
              :indeterminate="checkBox.isIndeterminateStatus"
              :model-check-all="checkBox.checkAllStatus"
              :options="ui.statusOptions"
              :isLoadingDataParent="ui.bookingReportsLoading"
              @changeCheckAll="handleCheckAllStatus"
              @input="handleCheckedStatus"
              translate
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="custom-height">
            <sa-select-check
              v-model="regionListSn"
              :isCheckAll="true"
              label="value"
              keyValue="name"
              :model-check-all="checkBox.checkAllRegion"
              :options="ui.regionOptions"
              :isLoadingDataParent="ui.bookingReportsLoading"
              @changeCheckAll="handleCheckAllRegion"
              @input="handleCheckedRegion"
              translate
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="custom-height">
            <sa-select-check
              v-model="filter.provinceSn"
              :indeterminate="checkBox.isIndeterminateProvinces"
              :model-check-all="checkBox.checkAllProvinces"
              label="sn"
              keyValue="name"
              :options="provinces"
              :isLoadingDataParent="ui.bookingReportsLoading"
              @changeCheckAll="handleCheckAllProvinces"
              @input="handleCheckedProvince"
              :loadingButton="ui.provincesLoading"
            />
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
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
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="3">
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
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="3">
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
            >
              <el-option
                v-for="(item, index) in suggestionsHotels"
                :key="index"
                :label="item.name"
                :value="item"
              >
                <div class="booking-rp__filter--text-line booking-rp__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="booking-rp__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="10" :md="8" :lg="7" :xl="6">
            <el-date-picker
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
          <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
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
          <el-col :xs="24" :sm="6" :md="6" :lg="3" :xl="2">
            <el-button
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
              icon="el-icon-download"
              plain
              :disabled="isDisabledExport"
              @click="exportBookingReports"
            >
              {{ $t('button.export') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="16" :md="10" :lg="6" :xl="5">
            <el-button
              icon="el-icon-search"
              plain
              @click="$router.push({ name: 'searchByBookingNo', query: { type: 0 }})"
            >
              {{ $t('page.bookingReport.searchBooking') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      ref="elTableBooking"
      v-loading="ui.bookingReportsLoading"
      :data="dataList"
      :cell-class-name="setCLassIndexColumn"
      max-height="580px"
    >
      <el-table-column
        :fixed="isFixedLeft"
        :label="$t('page.bookingReport.hotel_name')"
        min-width="200"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.row.total && scope.row.name && scope.row.hotelSn"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                hotelSn: scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        :label="$t('page.bookingReport.code')"
        min-width="150"
      />
      <el-table-column
        min-width="150"
        :label="$t('page.bookingReport.total_booking')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.all,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalBooking }}
          </router-link>
          <span v-else>
            {{ scope.row.totalBooking }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="190"
        :label="$t('option.completedCheckedIn')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.completedCheckedIn,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalComplete }}
          </router-link>
          <span v-else>
            {{ scope.row.totalComplete }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        :label="$t('option.upComing')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.awaitingCheckin,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalAwaitingCheckin }}
          </router-link>
          <span v-else>
            {{ scope.row.totalAwaitingCheckin }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        :label="$t('option.go2joyCancel')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.cancel,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalGo2JoyCancelled }}
          </router-link>
          <span v-else>
            {{ scope.row.totalGo2JoyCancelled }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        :label="$t('option.hotelCancel')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.cancel,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalHotelCancelled }}
          </router-link>
          <span v-else>
            {{ scope.row.totalHotelCancelled }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        :label="$t('option.userCancel')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.cancel,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalUserCancelled }}
          </router-link>
          <span v-else>
            {{ scope.row.totalUserCancelled }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"

        :label="$t('option.noShow')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.noShow,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalNoShow }}
          </router-link>
          <span v-else>
            {{ scope.row.totalNoShow }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        :label="$t('option.waitForGo2Joy')"
      >
        <template slot-scope="scope">
          <router-link
            v-if="!scope.$index"
            :to="{ name: 'bookingReportHotels',
              query: {
                source: filter.source,
                bookingStatus: ui.bookingStatus.awaitingGo2JoyProcessing,
                hotelSn: pagination.total === 1 ? filter.hotelSn : scope.row.hotelSn,
                deviceType: filter.deviceType,
                startDate: filter.startDate,
                endDate: filter.endDate,
                type: filter.type,
                provinceSn: `${setData().provinceSn}`
              }
            }"
          >
            {{ scope.row.totalAwaitingGo2JoyProcessing }}
          </router-link>
          <span v-else>
            {{ scope.row.totalAwaitingGo2JoyProcessing }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :class="ui.bookingReportsLoading ? 'is-disabled' : ''"
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
import SaSection from '@/components/globals/SaSection.vue'
import SaSelectCheck from '@/components/globals/SaSelectCheck.vue'
import { fetchBookingReports, exportBookingReports, statisticsUserBookingReports } from './api'
import { fetchListProvinces } from '@/api/province'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { debounce, scrollToTop } from '@/utils/helpers'
import { region, repStatus, SOURCE_OPTIONS_FILTERS, DEVICE_TYPE_OPTIONS, TIME_TYPE_OPTIONS, STATUS_OPTIONS } from '@/utils/const'
const allRegion = region.reduce(function async (preValue, curValue) {
  return preValue.concat(curValue.value)
}, [])
const timeDebounce = 500
const timeDebounceSecond = 1000
const allHotelStatus = [3, 4, 5, 6]
const today = new Date()
export default {
  components: { SaSection, SaSelectCheck },
  name: 'BookingReport',
  data: (vm) => {
    return {
      regionListSn: [1, 2, 4, 5],
      provinces: [],
      suggestionsHotels: [],
      bookingReports: [],
      statistics: {},
      pagination: {},
      hotelSelected: '',
      isDisabledExport: false,
      filter: {
        source: 0,
        hotelStatus: allHotelStatus,
        deviceType: 0,
        provinceSn: [],
        startDate: vm.formatDate(today, false),
        endDate: vm.formatDate(today, false),
        type: 1,
        limit: 10,
        page: 1
      },
      ui: {
        bookingStatus: {
          all: 0,
          completedCheckedIn: 8,
          awaitingCheckin: 3,
          cancel: 4,
          noShow: 6,
          awaitingGo2JoyProcessing: 7
        },
        bookingReportsLoading: false,
        hotelsLoading: false,
        provincesLoading: false,
        provinceOptions: [],
        regionOptions: region,
        statusOptions: STATUS_OPTIONS,
        deviceTypeOptions: DEVICE_TYPE_OPTIONS,
        timeTypeOptions: TIME_TYPE_OPTIONS,
        sourceOptions: SOURCE_OPTIONS_FILTERS
      },
      checkBox: {
        isIndeterminateStatus: false,
        isIndeterminateProvinces: false,
        checkAllStatus: true,
        checkAllProvinces: true,
        checkAllRegion: true
      },
      isFixedLeft: null
    }
  },
  created () {
    this.fetchProvinces()
    this.fetchSuggestionsHotels({ limit: 10, hotelStatus: 0 })
    this.isDisabledExport = !this.hasPermission('sabookingreport', 'pExport')
    this.changeFilter()
  },
  computed: {
    dateRange: {
      get () {
        return [this.filter.startDate, this.filter.endDate]
      },
      set (val) {
        this.filter.startDate = val[0]
        this.filter.endDate = val[1]
        const days = (new Date(this.filter.endDate).getTime() - new Date(this.filter.startDate).getTime()) / (1000 * 3600 * 24)
        if (days <= 40 && this.hasPermission('sabookingreport', 'pExport')) {
          this.isDisabledExport = false
        } else {
          this.isDisabledExport = true
        }
      }
    },
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.bookingReports
    }
  },
  watch: {
    dateRange (value) {
      if (!value) {
        delete this.filter.startDate
        delete this.filter.endDate
      } else {
        this.filter.startDate = value[0]
        this.filter.endDate = value[1]
      }
    },
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
  methods: {
    setData () {
      const formData = { ...this.filter }
      formData.hotelStatus = JSON.stringify(formData.hotelStatus)
      formData.provinceSn = JSON.stringify(formData.provinceSn)

      if (JSON.parse(formData.hotelStatus).length === this.ui.statusOptions.length) {
        formData.hotelStatus = '[]'
      }
      if (JSON.parse(formData.provinceSn).length === this.ui.provinceOptions.length) {
        formData.provinceSn = '[]'
      }
      return formData
    },
    setFixedResponsive () {
      if (window.innerWidth <= 768) {
        this.isFixedLeft = null
      } else {
        this.isFixedLeft = !this.ui.bookingReportsLoading ? 'left' : null
      }
      this.$nextTick(() => {
        this.$refs.elTableBooking.bodyWrapper.scrollTop = 0
      })
    },
    changeFilter () {
      this.filter.page = 1
      this.fetchBookingReports()
    },
    searchSuggestionsHotels: debounce(function (keySearch) {
      this.fetchSuggestionsHotels({
        limit: 10,
        hotelStatus: 0,
        keyword: keySearch
      })
    }, timeDebounce),
    async fetchSuggestionsHotels (params) {
      this.ui.hotelsLoading = true
      try {
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.suggestionsHotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.hotelsLoading = false
      }
    },
    async fetchProvinces () {
      this.ui.provincesLoading = true
      try {
        this.provinces = []
        if (this.regionListSn.length > 0) {
          const { data } = await fetchListProvinces(this.regionListSn)
          if (data?.code === repStatus.sussess) {
            this.ui.provinceOptions = await data.data.provinces.reduce(function async (preValue, curValue) {
              return preValue.concat(curValue.sn)
            }, [])
            this.provinces = data.data.provinces
          }
        }
      } catch (error) {
        return false
      } finally {
        this.handleCheckAllProvinces(true)
        this.ui.provincesLoading = false
      }
    },
    handleCheckedRegion: debounce(function () {
      this.fetchProvinces()
    }, timeDebounceSecond),
    async fetchBookingReports () {
      this.ui.bookingReportsLoading = true
      try {
        const formData = this.setData()
        const { data } = await fetchBookingReports(formData)
        if (data?.code === repStatus.sussess) {
          this.bookingReports = data.data.bookingReportList
          this.pagination = data.data.meta
          this.fetchStatistics(formData)
        }
      } catch (error) {
        return false
      } finally {}
    },
    async fetchStatistics (formData) {
      try {
        const { data } = await statisticsUserBookingReports(formData)
        if (data?.code === repStatus.sussess) {
          this.bookingReports.unshift(data.data)
        }
      } catch (error) {
        return false
      } finally {
        this.ui.bookingReportsLoading = false
      }
    },
    async exportBookingReports () {
      this.ui.exportLoading = true
      try {
        const formData = this.setData()
        delete formData.hotelStatus
        delete formData.limit
        delete formData.page
        formData.hotelSn = formData.hotelGroupSn || 0
        const { data } = await exportBookingReports(formData)
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
    handleCheckAllStatus (val) {
      this.checkBox.checkAllStatus = val
      this.filter.hotelStatus = val ? allHotelStatus : []
      this.checkBox.isIndeterminateStatus = false
    },
    handleCheckedStatus: debounce(function (value) {
      this.checkBox.checkAllStatus = value.length === this.ui.statusOptions.length
      this.checkBox.isIndeterminateStatus = value.length > 0 && value.length < this.ui.statusOptions.length
    }, 1000),
    handleCheckAllRegion (val) {
      this.checkBox.checkAllRegion = val
      this.regionListSn = val ? allRegion : []
      this.fetchProvinces()
    },
    handleCheckAllProvinces (val) {
      this.checkBox.checkAllProvinces = val
      this.filter.provinceSn = val ? this.ui.provinceOptions : []
      this.checkBox.isIndeterminateProvinces = false
    },
    handleCheckedProvince: debounce(function (value) {
      this.checkBox.checkAllProvinces = value.length === this.ui.provinceOptions.length
      this.checkBox.isIndeterminateProvinces = value.length > 0 && value.length < this.ui.provinceOptions.length
    }, timeDebounceSecond),
    handleSizeChange (value) {
      this.filter.page = this.pagination.currentPage = 1
      this.filter.limit = value
      if (this.filter.page === 1) {
        this.fetchBookingReports()
      }
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchBookingReports()
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
.booking-rp {
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
  :deep(.el-range-editor) {
    width: 100% !important;
  }
}
:deep(.hidden-index-column) {
  div {
    display: none;
  }
}
.el-col {
  padding: 6px 10px;
}
.el-popover .el-checkbox {
  display: block;
  padding: 6px 12px;
}
.el-popover .el-checkbox-group {
  overflow: auto;
  height: 100%;
  max-height: 200px;
}
.el-popover .el-checkbox-group::-webkit-scrollbar {
  width: 2px;
  background-color: #F5F5F5;
}
.el-popover .el-checkbox-group::-webkit-scrollbar-thumb {
  background-color: #000000;
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
