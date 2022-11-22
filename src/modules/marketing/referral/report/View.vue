<template>
  <sa-section
    class="referral-report"
    v-loading="ui.loading"
  >
     <template slot="header">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          popper-class="custom-date-range"
          format="yyyy/MM/dd"
          value-format="yyyy-MM-dd"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="fetchReferralDetail"
        />
        <el-button
          class="float-right"
          type="info"
          size="large"
          @click="$router.go(-1)"
        >
          {{$t('button.back')}}
        </el-button>
    </template>
    <div>
        <el-row>
          <el-col :md="8">
            <p class="bold color-black">
              {{ $t('page.referral.report.reportingCategory') }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="bold color-black">
              {{ $t('page.referral.report.referrer') }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="bold color-black">
              {{ $t('page.referral.report.referee') }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="bold color-black">
              {{ $t('page.referral.report.total') }}
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="bold color-blue">
            <span>1. </span>{{ $t('page.referral.report.numOfParticipants') }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="color-blue"> {{ referral.totalReferrerUser }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-blue"> {{ referral.totalRefereeUser }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-blue"> {{ referral.totalUser }} </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="bold color-blue">
            &nbsp;&nbsp;<span>1.1 </span>{{ $t('page.referral.report.numOfSignIn') }}
            </p>
          </el-col>
          <el-col :md="4" class="disable-back">
            <p style="opacity: 0"> {{ referral.totalNewUserRegister }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-blue"> {{ referral.totalNewUserRegister }} </p>
          </el-col>
          <el-col :md="4">
              <p class="color-blue"> {{ referral.totalNewUserRegister }} </p>
          </el-col>
        </el-row>
        <el-row
          v-for="(val, inx) in referral.infoCheckinReferral"
          :key="'a'+inx"
        >
          <el-col :md="8">
            <p class="bold color-blue">
              &nbsp;&nbsp;<span>1.{{ inx+2 }} </span>{{ $t('page.referral.report.numOfChecked_' + (inx+1)) }}
            </p>
          </el-col>
          <el-col :md="4" class="disable-back">

          </el-col>
          <el-col :md="4">
              <p class="color-blue"> {{ val.totalNumberReferee }} </p>
          </el-col>
          <el-col :md="4">
              <p class="color-blue"> {{ val.totalNumberReferee }} </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="bold color-green">
              <span>2. </span>{{ $t('page.referral.report.totalPointInProgram') }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="color-green"> {{ formatMoney(referral.totalRewardPointReferrer) }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-green"> {{ formatMoney(referral.totalRewardPointReferee) }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-green"> {{ formatMoney(referral.totalRewardPoint) }} </p>
          </el-col>
        </el-row>
        <el-row
          v-for="(val, inx) in referral.infoCheckinReferral"
          :key="'b'+inx"
        >
          <el-col :md="8">
            <p class="bold color-green">
              &nbsp;&nbsp; <span>2.{{ inx+1 }} </span>{{ $t('table.referral.report.check_in_point_' + (inx+1)) }}
            </p>
          </el-col>
          <el-col :md="4">
            <p class="color-green"> {{ formatMoney(val.totalPointReferrer) }} </p>
          </el-col>
          <el-col :md="4">
              <p class="color-green"> {{ formatMoney(val.totalPointReferee) }} </p>
          </el-col>
          <el-col :md="4">
            <p class="color-green"> {{ formatMoney(val.totalPoint) }} </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="bold color-red">
              <span>3. </span>{{ $t('page.referral.report.totalPointUsed') }}
            </p>
          </el-col>
          <el-col :md="4">
              <p class="color-red"> {{ formatMoney(referral.totalUsedPointReferrer) }} </p>
          </el-col>
          <el-col :md="4">
              <p class="color-red"> {{ formatMoney(referral.totalUsedPointReferee) }} </p>
          </el-col>
          <el-col :md="4">
              <p class="color-red"> {{ formatMoney(referral.totalUsedPoint) }} </p>
          </el-col>
        </el-row>
    </div>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchReferralReport } from './api'

export default {
  components: { SaSection },
  name: 'referralReport',
  data: (vm) => {
    return {
      ui: {
        loading: false
      },
      filter: {
        startDate: '',
        endDate: ''
      },
      referral: {}
    }
  },
  computed: {
    dateRange: {
      get: function () {
        return [this.filter.startDate, this.filter.endDate]
      },
      set: function (val) {
        if (val) {
          this.filter.startDate = val[0]
          this.filter.endDate = val[1]
        } else {
          this.filter.startDate = this.filter.endDate = ''
        }
      }
    }
  },
  created () {
    this.fetchReferralDetail()
  },
  methods: {
    async fetchReferralDetail () {
      this.ui.loading = true
      const { data } = await fetchReferralReport({ referralProgramSn: this.sn })
      if (data.code === 1) {
        this.referral = data.data
        this.ui.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.disable-back {
  background: lightgrey;
}
.color-red {
  color: red;
}
.color-blue {
  color: blue;
}
.color-green {
  color: #67C23A;
}
.color-yellow {
  color: yellow;
}
</style>
