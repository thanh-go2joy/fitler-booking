<template>
  <sa-section
    class="create-edit"
  >
    <template slot="header">
      <div class="align-end">
        <router-link
          class="el-button el-button--info is-plain"
          :to="{ name: 'referral' }"
        >
          {{ $t('button.back') }}
        </router-link>
      </div>
    </template>
    <el-form
      v-loading="ui.loadingDetails"
      hide-required-asterisk
      label-width="250px"
      ref="referralForm"
      label-position="left"
      class="form"
      :model="formData"
    >
      <el-form-item
        :label="$t('page.referral.create.title')"
      >
        <p>{{ formData.title }}</p>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.referralCode')"
      >
        <p>{{ formData.code }} {{ $t('page.referral.create.referralCodeNote') }}</p>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.status')"
      >
        <p>{{ referralStatus }}</p>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.startEndDate')"
      >
        <p> {{ formData.startDate }} ~ {{ formData.endDate }} </p>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.applyForReferrer')"
      >
        <el-row>
          <el-col :sm="8" :md="4">
            <p>{{ $t('page.referral.create.registerTime') }}</p>
          </el-col>
          <el-col :sm="8" :md="6">
            <p>{{ formData.registerTimeFrom }} - {{ formData.registerTimeTo }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="8" :md="4">
            <p>{{ $t('page.referral.create.registerLocation') }}</p>
          </el-col>
          <el-col :sm="8" :md="6">
            <p class="bold">
              <span v-for="(prov, inx) in provincesResList" :key="inx" :class="inx+1 < provincesResList.length ? 'comma' : ''">
                {{ prov }}
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="8" :md="24">
            <p>{{ $t('page.referral.create.checkInInfo') }}</p>
            <el-row>
              <el-col :sm="8" :md="4">
                <p>{{ $t('page.referral.create.minimumTimes') }}</p>
              </el-col>
              <el-col :sm="8" :md="6">
                <p>{{ formData.checkinNum }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :md="4">
                <p>{{ $t('page.referral.create.periodTime') }}</p>
              </el-col>
              <el-col :sm="8" :md="6">
                <p>{{ formData.checkinTimeFrom }} - {{ formData.checkinTimeTo }}</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :md="4">
                <p>{{ $t('page.referral.create.lastCheckIn') }}</p>
              </el-col>
              <el-col :sm="8" :md="6">
                <p class="bold">
                  <span v-for="(prov, inx) in provincesLastList" :key="inx" :class="inx+1 < provincesLastList.length ? 'comma' : ''">
                    {{ prov }}
                  </span>
                </p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="flex">
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.applyForReferee')"
      >
        {{  }}
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.maxNumTimes')"
      >
        <p>{{ formData.referralProgramDetail.length }}</p>
        <div>
          <el-row
            v-for="(item, index) in formData.referralProgramDetail"
            :key="index"
          >
            <el-col :md="2">
                {{ $t('page.referral.times.time_'+(index+1)) }}
            </el-col>
            <el-col :md="22">
              <div class="flex">
                <div>
                  {{ $t('page.referral.create.referrerReward') }}:
                  {{ formatMoney(item.referrerReward) }}
                </div>
                <div>
                  {{ $t('page.referral.create.refereeReward') }}:
                  <span>
                    {{ formatMoney(item.refereeReward) }}
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.contentVn')"
      >
         <div v-html="formData.contentVi"> </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.contentEn')"
      >
        <div v-html="formData.contentEn"> </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.invitationContentVn')"
      >
        <div v-html="formData.invitationContentVi"> </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.invitationContentEn')"
      >
        <div v-html="formData.invitationContentEn"> </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.bannerImage')"
      >
       <div class="preview banner-preview">
          <img v-if="formData.bannerImage" :src="formatImage(formData.bannerImage)" />
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.floatingIcon')"
      >
        <div class="img-thumbnail img-box preview icon-preview" style="">
          <img
            v-if="formData.floatingIcon"
            :src="formatImage(formData.floatingIcon)"
          />
        </div>
      </el-form-item>
    </el-form>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchSuggestionProvinces } from '@/api/province'
import { fetchReferralProgram } from './api'
import { repStatus } from '@/utils/const'

export default {
  components: {
    SaSection
  },
  data (vm) {
    return {
      sn: this.$route.query.sn,
      formData: {
        title: '',
        code: '',
        startDate: vm.formatDate(new Date(), false),
        endDate: vm.formatDate(new Date(), false),
        registerTimeFrom: '',
        registerTimeTo: '',
        registerLocation: [],
        checkinNum: 0,
        checkinTimeFrom: '',
        checkinTimeTo: '',
        checkinLastLocation: [],
        lastCheckInSelected: [],
        maxNumberOfTimes: 1,
        conditionRefereesType: [{ type: 1, numOfCheckin: 0 }],
        conditionRefereesNumCheckin: 0,
        referralProgramDetail: [
          {
            referrerReward: '',
            refereeReward: ''
          }
        ],
        // guidelineImage: '',
        bannerImage: '',
        floatingIcon: '',
        contentVi: '',
        contentEn: '',
        invitationContentVi: '',
        invitationContentEn: '',
        status: 0
      },
      ui: {
        provinces: []
      }
    }
  },
  computed: {
    referralStatus () {
      let status
      switch (this.formData.status) {
        case 0:
          status = this.$t('option.status.draft')
          break
        case 1:
          status = this.$t('option.status.active')
          break
        case 2:
          status = this.$t('option.status.expired')
          break
        default:
          break
      }
      return status
    },
    provincesResList () {
      return this.ui.provinces.filter(element => this.formData.registerLocation.includes(element.value)).map(val => val.name)
    },
    provincesLastList () {
      return this.ui.provinces.filter(element => this.formData.checkinLastLocation.includes(element.value)).map(val => val.name)
    }
  },
  async created () {
    this.fetchReferralDetail()
  },
  methods: {
    async fetchReferralDetail () {
      this.ui.loadingDetails = true
      try {
        const { data } = await fetchReferralProgram({ referralProgramSn: this.sn })
        if (data?.code === repStatus.sussess) {
          this.formData = data.data
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingDetails = false
      }
    },
    async getProvince () {
      const { data } = await fetchSuggestionProvinces()
      if (data.data.length > 0) {
        data.data.map((currentValue, index, array) => {
          this.ui.provincesRes.push({
            name: currentValue.name,
            value: currentValue.sn,
            status: !this.sn
          })
          this.ui.provincesLast.push({
            name: currentValue.name,
            value: currentValue.sn,
            status: !this.sn
          })
          this.ui.provinces.push({
            name: currentValue.name,
            value: currentValue.sn
          })
        })
      } else {
        this.ui.provincesRes = [null]
        this.ui.provincesLast = [null]
        this.ui.provinces = [null]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-evenly;
}
.icon-preview{
  padding: 5px;
  width: 50px;
  height:50px;
  display: inline-block
}
.preview {
  padding: 5px;
  display: inline-block;
  border: 1px solid;
}
.preview img {
  width: 100%;
  max-height: 100%;
}
.guideline-preview {
  width: 343px;
  height: 370px;
}
.banner-preview {
  width: 343px;
  height: 144px;
}
.ml-24px {
  margin-left: 24px;
}
.comma {
  &:after {
    content: ","
  }
}
.align-end {
  text-align: end;
}
</style>
