<template>
  <sa-section
    class="referral"
    v-loading="ui.loading"
  >
    <template slot="header">
      <div class="float-right">
        <router-link
          class="el-button el-button--default is-plain"
          :to="{ name: 'referralReport' }"
        >
          <i class="el-icon-data-line" />
          {{ $t('button.report') }}
        </router-link>
        <router-link
          class="el-button el-button--danger is-plain"
          :to="{ name: 'createEditReferral' }"
        >
          <i class="el-icon-plus" />
          {{ $t('button.add') }}
        </router-link>
      </div>
    </template>
    <el-table
      :data="referral"
    >
      <el-table-column label="#" type="index" :index="indexMethod"/>
      <el-table-column
        :label="$t('page.referral.labelHeader.title')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'referralDetail', query: { sn: scope.row.sn } }"
          >
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.typeOfInvitation')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p>
            {{ scope.row.typeOfInvitation ? $t("page.referral.applyOption.checkedIn") : '' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.referrerAmount')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p>
            {{ formatMoney(scope.row.referrerAmount) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.refereeAmount')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p>
            {{ formatMoney(scope.row.refereeAmount) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.startEndDate')"
        :min-width="105"
      >
        <template slot-scope="scope">
          <p>
            {{ scope.row.startDate }} - {{ scope.row.endDate }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.createTime')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p> {{ scope.row.createdTime }} </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.lastUpdate')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p>
            {{ scope.row.lastUpdate }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('page.referral.labelHeader.status')"
        :min-width="85"
      >
        <template slot-scope="scope">
          <p>
            {{ getStatus(scope.row.status) }}
          </p>
        </template>
      </el-table-column>
       <el-table-column
          :label="$t('page.userMgt.operations')"
          :min-width="90"
        >
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.title && scope.row.status !== 2"
              class="el-button el-button--success white-color"
              :to="{ name: 'createEditReferral', query: { sn: scope.row.sn } }"
            >
              {{ $t('button.edit') }}
            </router-link>
          </template>
        </el-table-column>
    </el-table>
    <template slot="footer">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="filter.limit"
          :current-page="filter.page"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
    </template>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchReferral } from './api'
// import { debounce } from '@/utils/helpers'
// const timeDebounce = 500
export default {
  components: { SaSection },
  name: 'referral',
  data: (vm) => {
    return {
      ui: {
        loading: false
      },
      referral: [],
      pagination: {},
      filter: {
        page: 1,
        limit: 10
      }
    }
  },
  created () {
    this.fetchReferral()
  },
  methods: {
    async fetchReferral () {
      this.ui.loading = true
      try {
        const { data } = await fetchReferral(this.filter)
        this.referral = data.data.referralProgramList
        this.referral.unshift(data.data.statistics)
        this.pagination = data.data.meta
      } catch (error) {
        return false
      } finally {
        this.ui.loading = false
      }
    },
    handleSizeChange (value) {
      this.filter.limit = value
      this.fetchReferral()
    },
    handleCurrentChange (value) {
      this.filter.page = value
      this.fetchReferral()
    },
    getStatus (status) {
      switch (status) {
        case 0:
          return this.$t('option.status.draft')
        case 1:
          return this.$t('option.status.active')
        case 2:
          return this.$t('option.status.expired')
        default:
          break
      }
    },
    indexMethod (index) {
      if (index === 0) {
        return ''
      } else {
        return index
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
