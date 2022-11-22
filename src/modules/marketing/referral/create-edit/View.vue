<template>
  <sa-section
    class="create-edit"
  >
    <el-form
      v-loading="ui.loadingDetails"
      label-width="250px"
      ref="referralForm"
      label-position="left"
      class="form"
      :rules="rules"
      :model="formData"
      hide-required-asterisk
    >
      <el-form-item
        prop="title"
        :label="$t('page.referral.create.title')"
      >
        <el-input
          v-model="formData.title"
        />
      </el-form-item>
      <el-form-item
        prop="code"
        :label="$t('page.referral.create.referralCode')"
      >
        <el-input
          class="short-wd-input"
          v-model="formData.code"
        />
        {{ $t('page.referral.create.referralCodeNote') }}
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.startEndDate')"
      >
        <div v-if="!isActive" class="col-md-10">
          <el-date-picker
            v-model="dateStartEndRange"
            type="daterange"
            popper-class="custom-date-range"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </div>
      <div v-else class="col-md-10">
        <p style="display: inline">
            {{ formatDate(formData.startDate, false) }}
        </p>
        -
        <el-date-picker
            v-model="formData.endDate"
            :picker-options="dateEndPickerOptions"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            start-placeholder="Start date"
            end-placeholder="End date"
        />
      </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.applyForReferrer')"
      >
        <el-row>
          <el-col :sm="8" :md="4">
            <p>{{ $t('page.referral.create.registerTime') }}</p>
          </el-col>
          <el-col :sm="8" :md="6">
            <el-date-picker
              v-model="dateRegisterRange"
              type="daterange"
              popper-class="custom-date-range"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              start-placeholder="Start date"
              end-placeholder="End date"
              :disabled="true"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="8" :md="4">
            <p>{{ $t('page.referral.create.registerLocation') }}</p>
          </el-col>
          <el-col :sm="8" :md="6">
            <sa-select-check
              v-if="!sn || isActive === false"
              label="value"
              keyValue="name"
              :select="formData.registerLocation"
              :options="ui.provincesRes"
              @input="filterRegisterLocationSelect"
            />
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
                  <el-input-number v-model="formData.checkinNum" :min="0" :max="100" :disabled="true" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :md="4">
                <p>{{ $t('page.referral.create.periodTime') }}</p>
              </el-col>
              <el-col :sm="8" :md="6">
                <el-date-picker
                  v-model="datePeriodRange"
                  type="daterange"
                  popper-class="custom-date-range"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  :disabled="true"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :md="4">
                <p>{{ $t('page.referral.create.lastCheckIn') }}</p>
              </el-col>
              <el-col :sm="8" :md="6">
                <sa-select-check
                  v-if="!sn || isActive === false"
                  label="value"
                  keyValue="name"
                  :select="formData.registerLocation"
                  :options="ui.provincesRes"
                  @input="filterRegisterLocationSelect"
                />
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
        <div
          class="col-md-10"
          v-for="(item, index) in formData.conditionRefereesType"
          :key="index"
        >
          <el-select v-model="item.type" placeholder="Select" :disabled="isActive">
            <el-option
              v-for="item in applyOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="item.numOfCheckin" placeholder="Select" :disabled="isActive">
            <el-option
              v-for="item in applyTimeOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> time(s)
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.maxNumTimes')"
      >
        <el-select
          v-model="formData.maxNumberOfTimes"
          placeholder="Select"
          :disabled="isActive"
          @change="onAddMaxNum"
        >
          <el-option
            v-for="item in 5"
            :key="item.value"
            :label="item"
            :value="item"
          />
        </el-select>
        <div>
          <el-row
            v-for="(item, index) in formData.referralProgramDetail"
            :key="index"
          >
            <el-col :md="2">
                {{ $t('page.referral.times.time_'+(index+1)) }}
            </el-col>
            <el-col :md="22">
              <el-row>
                <el-col :md="6">
                  {{ $t('page.referral.create.referrerReward') }}:
                  <el-input
                    :placeholder="$t('page.referral.create.referrerReward')"
                    v-model="item.referrerReward"
                    style="width:200px"
                    :disabled="isActive"
                  />
                </el-col>
                <el-col :md="6">
                    {{ $t('page.referral.create.refereeReward') }}:
                    <el-input
                      :placeholder="$t('page.referral.create.refereeReward')"
                      v-model="item.refereeReward"
                      style="width:200px"
                      :disabled="isActive"
                    />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item
        prop="contentVi"
        :label="$t('page.referral.create.contentVn')"
      >
          <tinymce v-model="formData.contentVi" :name="'contentVn'" :height="500" />
      </el-form-item>
      <el-form-item
        prop="contentEn"
        :label="$t('page.referral.create.contentEn')"
      >
          <tinymce v-model="formData.contentEn" :name="'contentEn'" :height="500" />
      </el-form-item>
      <el-form-item
        prop="invitationContentVi"
        :label="$t('page.referral.create.invitationContentVn')"
      >
        <el-input
          type="textarea"
          v-model="formData.invitationContentVi"
        />
      </el-form-item>
      <el-form-item
        prop="invitationContentEn"
        :label="$t('page.referral.create.invitationContentEn')"
      >
        <el-input
          type="textarea"
          v-model="formData.invitationContentEn"
        />
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.bannerImage')"
      >
        <div class="preview banner-preview">
          <img v-if="bannerImage.file" :src="bannerImage.src" />
          <img v-else-if="bannerImage.src" :src="this.formatImage(bannerImage.src)" />
        </div>
        <div style="float:right">
          <label class="custom-file-upload">
            <i class="fa fa-upload"></i>
            {{ $t('button.chooseFile') }}
            <input type="file" accept="image/png, image/jpeg" id="file" ref="file" v-on:change="handleImageUpload('bannerImage',$event)">
          </label>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('page.referral.create.floatingIcon')"
      >
        <div class="img-thumbnail img-box preview icon-preview" style="">
          <img v-if="floatingIcon.file" :src="floatingIcon.src" />
          <img v-else-if="floatingIcon.src" :src="this.formatImage(floatingIcon.src)" />
        </div>
        <div style="float:right">
          <label class="custom-file-upload">
            <i class="fa fa-upload"></i>
            {{ $t('button.chooseFile') }}
            <input type="file" accept="image/png, image/jpeg" id="file" ref="file" v-on:change="handleImageUpload('floatingIcon',$event)">
          </label>
        </div>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="info"
          size="large"
          @click="$router.go(-1)"
        >
          {{$t('button.back')}}
        </el-button>
        <el-button
          v-if="$route.query.sn"
          type="success"
          size="large"
          @click="onSubmit"
        >
          {{ $t('button.edit') }}
        </el-button>
        <el-button
          v-else
          type="primary"
          size="large"
          @click="onSubmit"
        >
          {{ $t('button.create') }}
        </el-button>
      </el-form-item>
    </el-form>
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchSuggestionProvinces } from '@/api/province'
import { fetchReferralProgram, editReferral, createReferral } from './api'
import { repStatus } from '@/utils/const'
import Tinymce from '@/components/globals/Tinymce'
import SaSelectCheck from '@/components/globals/SaSelectCheck.vue'

export default {
  components: {
    SaSection,
    SaSelectCheck,
    Tinymce
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
      guidelineFile: '',
      bannerFile: '',
      iconFile: '',
      ui: {
        loadingDetails: false,
        disabledCreate: false,
        provincesRes: [],
        provincesLast: [],
        provinces: []
      },
      dateEndPickerOptions: { disabledDate: this.disabledDueDate }
    }
  },
  computed: {
    dateStartEndRange: {
      get: function () {
        return [this.formData.startDate, this.formData.endDate]
      },
      set: function (val) {
        if (val) {
          this.formData.startDate = val[0]
          this.formData.endDate = val[1]
        } else {
          this.formData.startDate = this.formData.endDate = ''
        }
      }
    }, // set and return date array to startDate and endDate
    dateRegisterRange: {
      get: function () {
        return [this.formData.registerTimeFrom ?? '', this.formData.registerTimeTo ?? '']
      },
      set: function (val) {
        if (val) {
          this.formData.registerTimeFrom = val[0]
          this.formData.registerTimeTo = val[1]
        } else {
          this.formData.registerTimeFrom = this.formData.registerTimeTo = ''
        }
      }
    },
    datePeriodRange: {
      get: function () {
        return [this.formData.checkinTimeFrom ?? '', this.formData.checkinTimeTo ?? '']
      },
      set: function (val) {
        if (val) {
          this.formData.checkinTimeFrom = val[0]
          this.formData.checkinTimeTo = val[1]
        } else {
          this.formData.checkinTimeFrom = this.formData.checkinTimeTo = ''
        }
      }
    },
    bannerImage: {
      get: function () {
        return {
          file: this.bannerFile,
          src: this.formData.bannerImage,
          name: ''
        }
      },
      set: function (val) {
        this.formData.bannerImage = val.src
        this.bannerFile = val.file
      }
    },
    floatingIcon: {
      get: function () {
        return {
          file: this.iconFile,
          src: this.formData.floatingIcon,
          name: ''
        }
      },
      set: function (val) {
        this.formData.floatingIcon = val.src
        this.iconFile = val.file
      }
    },
    isActive () {
      return this.formData.status === 1
    },
    // ----------
    applyOption () {
      return [
        {
          name: this.$t('page.referral.applyOption.checkedIn'),
          value: 1
        }
      ]
    },
    applyTimeOption () {
      return [
        {
          name: this.$t('none'),
          value: 0
        }
      ]
    },
    // option of select
    rules () {
      return {
        title: [
          {
            required: true,
            message: this.$t('page.referral.validate.titleRequired'),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('page.referral.validate.codeRequired'),
            trigger: 'blur'
          }
        ],
        contentVi: [
          {
            required: true,
            message: this.$t('page.referral.validate.contentRequired'),
            trigger: 'blur'
          }
        ],
        contentEn: [
          {
            required: true,
            message: this.$t('page.referral.validate.contentRequired'),
            trigger: 'blur'
          }
        ],
        invitationContentVi: [
          {
            required: true,
            message: this.$t('page.referral.validate.invitationContentRequired'),
            trigger: 'blur'
          }
        ],
        invitationContentEn: [
          {
            required: true,
            message: this.$t('page.referral.validate.invitationContentRequired'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getProvince()
    this.sn && this.fetchReferralDetail()
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
    },
    async onSubmit () {
      this.ui.loadingDetails = true
      this.$refs.referralForm.validate(async (valid) => {
        if (valid) {
          const formData = Object.keys(this.formData).reduce((formData, key) => {
            this.formData[key] === null || formData.append(key, this.formData[key])
            return formData
          }, new FormData())
          formData.append('bannerImage', this.bannerFile)
          formData.append('floatingIcon', this.iconFile)
          formData.append('conditionRefereesType', 1) // not use yet, it will be array in future version
          formData.append('conditionRefereesNumCheckin', 0) // not use yet, it will be array in future version
          this.formData.referralProgramDetail.forEach((val, inx) => {
            if (inx < 4) {
              formData.append(`referralProgramDetails[${inx}][referrerReward]`, val.referrerReward)
              formData.append(`referralProgramDetails[${inx}][refereeReward]`, val.refereeReward)
            }
          })
          let data
          if (this.$route.query.sn) {
            formData.append('referralProgramSn', this.sn)
            data = await editReferral(formData)
          } else {
            data = await createReferral(formData)
          }
          if (data.data.code === repStatus.sussess) {
            this.$router.push(
              {
                name: 'referral'
              })
            this.$message({
              type: 'success',
              message: this.$t('message.success')
            })
          } else {
            this.ui.loadingDetails = false
          }
        } else {
          this.ui.loadingDetails = false
        }
      })
    },
    onAddMaxNum () {
      if (this.formData.referralProgramDetail.length > 0) this.formData.referralProgramDetail.splice(0, this.formData.referralProgramDetail.length)
      for (let i = 0; i < this.formData.maxNumberOfTimes; i++) {
        this.formData.referralProgramDetail.push(
          {
            referrerReward: '',
            refereeReward: ''
          }
        )
      }
    },
    handleFileUpload (file) {
      this.formData.file = file
    },
    handleImageUpload (fileImg, e) {
      const obj = {
        file: e.target.files[0],
        name: e.target.files[0].name,
        src: URL.createObjectURL(e.target.files[0])
      }
      this[fileImg] = obj
    },
    filterRegisterLocationSelect (val) {
      this.formData.registerLocation = val.map(val => val.value)
    },
    filterLastCheckInLocationSelect (val) {
      this.formData.checkinLastLocation = val.map(val => val.value)
    },
    disabledDueDate (date) {
      return date < this.getPassDate(new Date(this.formData.startDate), false)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-preview{
    width: 50px;
    height:50px;
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
</style>
