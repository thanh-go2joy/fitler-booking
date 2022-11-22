<template>
  <sa-section class="hotel-debt-apply-hotel">
    <template slot="header">
      <div class="hotel-debt-apply-hotel__filter" :class="ui.isTableLoading ? 'is-disabled' : ''">
        <el-row>
          <el-col :xs="24" :sm="8" :md="6" :lg="5" :xl="3">
            <el-select
                v-model="filter.applyTarget"
              >
                <el-option
                  v-for="(item, index) in ui.appLyType"
                  :key="index"
                  :label="$t(item.key)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-select
              :disabled="isDisabledExport"
              v-model="filter.provinceSn"
              v-loading="ui.loadingProvince"
              element-loading-spinner="el-icon-loading"
              :placeholder="$t('page.collection.province')"
              @change="listDistricts"
            >
              <el-option
                v-for="(item, index) in provinces"
                :key="index"
                :label="item.name"
                :value="item.sn"
              />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3">
            <el-select
              :disabled="isDisabledExport"
              v-model="filter.districtSn"
              v-loading="ui.loadingDistrict"
              element-loading-spinner="el-icon-loading"
              :placeholder="$t('page.collection.district')"
            >
              <el-option
                v-for="(item, index) in districts"
                :key="index"
                :label="item.name"
                :value="item.sn"
              />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="10" :md="6" :lg="6" :xl="3">
            <el-select
              v-model="filter.keyword"
              :loading="ui.isLoadingHotel"
              :disabled="isDisabledExport"
              :placeholder="$t('page.hotelDisplay.hotelName')"
              :remote-method="searchSuggestionsHotels"
              element-loading-spinner="el-icon-loading"
              remote
              filterable
              prefix-icon="el-icon-search"
              clearable
            >
              <el-option
                v-for="(item, index) in hotels"
                :key="index"
                :label="`${item.name} - ${item.address}`"
                :value="item.name"
                style="font-size: 13px; color: #4a5d6e;"
              >
                <div class="hotel-debt-apply-hotel__filter--text-line hotel-debt-apply-hotel__filter--text-distance">
                  <p>{{ item.name }}</p>
                  <p class="hotel-debt-apply-hotel__filter--text-size text-grey">{{ item.address }}</p>
                </div>
              </el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="6" :md="4" :lg="3" :xl="3">
            <el-button
              :disabled="isDisabledExport"
              icon="el-icon-plus"
              type="primary"
              plain
              @click="addHotelApply">
                {{$t('button.add')}}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="5" :md="3" :lg="2" :xl="5" class="custom-height">
            <upload-file
              accept=".xlsx, .xls, .csv"
              :isDisabled="isDisabledExport"
              @change="handleExceed"
            />
          </el-col>
          <el-col :xs="24" :sm="5" :md="4" :lg="2" :xl="4">
            <el-button
              type="info"
              plain
              :loading="ui.isCallAPI"
              @click="onGetBack"
            >
              {{ $t('button.back') }}
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="5" :md="4" :lg="2" :xl="3">
            <el-button
              type="warning"
              plain
              :loading="ui.isCallAPI"
              @click="onSave"
            >
              {{ $t('button.save') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table
      ref="hotelDebtApplyHotel"
      max-height="580px"
      :data="dataList"
      v-loading="ui.isTableLoading">
      <el-table-column :min-width="200" :fixed="isFixedLeft"
        :label="$t('page.hotelDebt.hotel_name')"
      >
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'hotelDisplayDetails', params: { sn: scope.row.sn } }"
          >
          {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('page.hotelDebt.code')" :min-width="160">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column :min-width="120"
        :label="$t('page.hotelDebt.status')"
      >
        <template slot-scope="scope">
          {{ getHotelStatus(scope.row.hotelStatus) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('page.hotelDebt.phone')" :min-width="150">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column :min-width="300"
        :label="$t('page.hotelDebt.address')"
      >
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column :min-width="160"
        :label="$t('page.hotelDebt.create_time')"
      >
        <template slot-scope="scope">
          {{ formatDateUI(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column :min-width="180"
        :label="$t('page.hotelDebt.last_update')"
      >
        <template slot-scope="scope">
          {{ formatDateUI(scope.row.lastUpdate) }}
        </template>
      </el-table-column>
      <el-table-column :min-width="120" :fixed="isFixedRight" align="center"
        :label="$t('action')"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            size="small"
            @click="onDelete(scope.row.sn)"
          >
            {{ $t('button.delete') }}
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
import { listHotelApply, addHotelApply, importHotelApply, onSaveHotelApply, onRemoveHotelApply } from './api'
import { fetchProvinces, fetchDistricts } from '@/api/province'
import { fetchSuggestionsHotels } from '@/api/hotels'

import UploadFile from '@/components/globals/UploadFile'
import { debounce, scrollToTop } from '@/utils/helpers'
import { repStatus } from '@/utils/const'

const timeDebounce = 500

export default {
  name: 'HotelDebtDetail',
  components: {
    saSection,
    UploadFile
  },
  data () {
    return {
      tableData: [],
      pagination: {},
      provinces: [],
      districts: [{ name: this.$t('page.collection.all'), sn: -1 }],
      filter: {
        limit: 10,
        page: 1,
        applyTarget: 1,
        provinceSn: -1,
        districtSn: -1,
        keyword: ''
      },
      ui: {
        isTableLoading: false,
        loadingProvince: false,
        loadingDistrict: false,
        isLoadingHotel: false,
        hotel: {},
        isCallAPI: false,
        appLyType: [
          { key: 'page.hotelDebt.apply_all_hotel', value: 1 },
          { key: 'page.hotelDebt.apply_all_hotel_except', value: 2 },
          { key: 'page.hotelDebt.only_apply', value: 3 }
        ]
      },
      isFixedRight: null,
      isFixedLeft: null
    }
  },
  computed: {
    ApplyType () {
      let applyType
      switch (localStorage.getItem('ApplyType')) {
        case '1':
          applyType = this.$t('page.hotelDebt.apply_all_hotel')
          break
        case '2':
          applyType = this.$t('page.hotelDebt.apply_all_hotel_except')
          break
        case '3':
          applyType = this.$t('page.hotelDebt.only_apply')
          break
        default:
          applyType = this.$t('page.hotelDebt.apply_all_hotel')
          break
      }
      return applyType
    },
    isDisabledExport () {
      if (this.filter.applyTarget === 1) {
        return true
      } else {
        return false
      }
    },
    dataList () {
      this.setFixedResponsive()
      scrollToTop('.el-table')
      return this.tableData
    }
  },
  created () {
    this.listProvinces()
    this.listHotelApply()
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
        this.$refs.hotelDebtApplyHotel.bodyWrapper.scrollTop = 0
      })
    },
    async listHotelApply () {
      try {
        this.ui.isTableLoading = true
        const { data } = await listHotelApply()
        if (data?.code === repStatus.sussess) {
          this.tableData = data.data.hotels
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isTableLoading = false
      }
    },
    async addHotelApply () {
      try {
        this.ui.isTableLoading = true
        const { data } = await addHotelApply(this.filter)
        if (data?.code === repStatus.sussess) {
          this.tableData = data.data.hotels
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
      this.ui.loadingProvince = true
      try {
        this.provinces = [{ name: this.$t('page.collection.all'), sn: -1 }]
        const { data } = await fetchProvinces({ limit: 100, status: 1 })
        if (data?.code === repStatus.sussess) {
          this.provinces = [...this.provinces, ...data.data.provinces]
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingProvince = false
      }
    },
    async listDistricts () {
      this.ui.loadingDistrict = true
      try {
        this.districts = [{ name: this.$t('page.collection.all'), sn: -1 }]
        if (this.filter.province !== -1) {
          const { data } = await fetchDistricts({ limit: 100, status: 1, provinceSn: this.filter.provinceSn })
          if (data?.code === repStatus.sussess) {
            this.districts = [...this.districts, ...data.data.districts]
          }
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingDistrict = false
      }
    },
    async handleExceed (file) {
      try {
        this.ui.isTableLoading = true
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await importHotelApply(this.filter.limit, this.filter.applyTarget, formData)
        if (data?.code === repStatus.sussess) {
          this.tableData = data.data.hotels
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isTableLoading = false
      }
    },
    async onGetBack () {
      try {
        this.ui.isCallAPI = true
        const { data } = await onSaveHotelApply({ applyTarget: this.filter.applyTarget })
        if (data?.code === repStatus.sussess) {
          this.$router.push({
            name: 'hotelDebtCreate',
            query: {
              createType: this.$route.query.typeHotelDebt
            }
          })
        }
        this.pagination = data.data.meta
      } catch (error) {
        return false
      } finally {
        this.ui.isCallAPI = false
      }
    },
    async onSave () {
      try {
        this.ui.isCallAPI = false
        const { data } = await onSaveHotelApply(this.filter)
        if (data?.code === repStatus.sussess) {
          localStorage.setItem('ApplyType', this.filter.applyTarget)
          this.$router.push({
            name: 'hotelDebtCreate',
            query: {
              createType: this.$route.query.typeHotelDebt
            }
          })
        }
        this.pagination = data.data.meta
      } catch (error) {
        return false
      } finally {
        this.ui.isCallAPI = false
      }
    },
    async onDelete (sn) {
      try {
        this.ui.isTableLoading = true
        const { data } = await onRemoveHotelApply({ hotelSn: sn, limit: this.filter.limit })
        if (data?.code === repStatus.sussess) {
          this.tableData = data.data.hotels
          this.pagination = data.data.meta
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isTableLoading = false
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
    getHotelStatus (status) {
      switch (status) {
        case 3:
          return this.$t('page.hotelDebt.contracted')
        case 5:
          return this.$t('page.hotelDebt.terminated')
        case 6:
          return this.$t('page.hotelDebt.suspended')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-debt-apply-hotel {
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
.custom-height {
  height: 61px;
  :deep(.upload-file__label) {
    padding: 12px 30px;
  }
  :deep(.upload-file) {
    display: unset;
  }
}
.el-select-dropdown__item {
  height: auto;
}
</style>
