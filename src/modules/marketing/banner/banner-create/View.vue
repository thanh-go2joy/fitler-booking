<template>
  <sa-section class="banner">
    <el-form :model="form" :rules="rules" ref="form">
      <div class="banner__form">
        <el-form-item :label="$t('page.banner.choose_display_in_app_web')" prop="type" required>
          <el-radio v-model="form.type" @change="changeHotelAdmin" :label="1">App</el-radio>
          <el-radio v-model="form.type" @change="changeHotelAdmin" :label="2">Website</el-radio>
          <el-radio v-model="form.type" @change="changeHotelAdmin" :label="3">Hotel Admin</el-radio>
        </el-form-item>
      </div>
      <div v-if="form.type !== 3">
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.title')" prop="title" required>
            <el-input :placeholder="$t('page.banner.title')" v-model="form.title" type="text"></el-input>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.linkItem')" required>
            <div class="banner__row">
              <div class="banner__row--margin">
                <el-form-item>
                  <el-select
                  v-model="form.targetType"
                  >
                    <el-option
                      v-for="(item, index) in ui.linkItemOptions"
                      :key="index"
                      :label="$t(`${item.key}`)"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="banner__row--margin">
                <el-form-item v-show="form.targetType === 1" prop="targetSn">
                  <el-select
                  :placeholder="$t('option.targetType.promotion')"
                  :loading="ui.isLoadingPromotions"
                  v-model="targetSnSelected"
                  filterable
                  remote
                  :remote-method="reloadPromotions"
                  value-key="sn"
                  >
                    <el-option
                      v-for="(item, index) in promotions"
                      :key="index"
                      :label="item.title"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.targetType === 2" prop="targetSn">
                  <el-select
                  :placeholder="$t('option.targetType.hotel')"
                  :loading="ui.isLoadingHotels"
                  v-model="targetSnSelected"
                  filterable
                  remote
                  :remote-method="reloadSuggestionsHotels"
                  value-key="sn"
                  >
                    <el-option
                      v-for="(item, index) in hotels"
                      :key="index"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.targetType === 3" prop="targetSn">
                  <el-select
                  :placeholder="$t('option.targetType.notice')"
                  :loading="ui.isLoadingNotices"
                  v-model="targetSnSelected"
                  filterable
                  remote
                  :remote-method="reloadNotices"
                  value-key="sn"
                  >
                    <el-option
                      v-for="(item, index) in notices"
                      :key="index"
                      :label="item.title"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.targetType === 4 || form.targetType === 61" prop="targetInfo">
                  <el-input :placeholder="$t('option.targetType.link')" v-model="form.targetInfo" type="text" />
                </el-form-item>
                <el-form-item v-show="form.targetType === 5" prop="provinceSelected">
                  <el-select
                  :placeholder="$t('page.banner.chooseProvince')"
                  :loading="ui.loadingProvinces"
                  v-model="provinceSelected"
                  filterable
                  >
                    <el-option
                      v-for="(item, index) in provinces"
                      :key="index"
                      :label="item.name"
                      :value="item.sn"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.targetType === 10" prop="targetSn">
                  <el-select
                  :placeholder="$t('option.targetType.promotionGroup')"
                  :loading="ui.isLoadingPromotionGroups"
                  v-model="targetSnSelected"
                  filterable
                  remote
                  :remote-method="reloadPromotionGroups"
                  value-key="sn"
                  >
                    <el-option
                      v-for="(item, index) in promotionGroups"
                      :key="index"
                      :label="item.title"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="banner__row--margin">
                <el-form-item v-show="form.targetType === 5" prop="targetSn">
                  <el-select
                  :placeholder="$t('page.banner.chooseDistrict')"
                  :loading="ui.loadingDistricts"
                  v-model="form.targetSn"
                  filterable
                  >
                    <el-option
                      v-for="(item, index) in districts"
                      :key="index"
                      :label="item.name"
                      :value="item.sn"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.display')" required>
            <el-checkbox :true-label="1" :false-label="0" v-model="form.display"></el-checkbox>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.stopAt')">
            <el-form-item>
              <el-date-picker class="datetime" type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :placeholder="$t('page.banner.stopAt')"
              v-model="form.endDate"
              :clearable="false"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.listProvince')" prop="listProvinceSn">
            <SaSelectCheck
              class="select-check"
              v-model="form.listProvinceSn"
              :indeterminate="checkBox.isIndeterminateProvinces"
              :model-check-all="checkBox.checkAllProvinces"
              :isCheckAll="true"
              label="sn"
              keyValue="name"
              :options="provinces"
              @changeCheckAll="handleCheckAllChangeProvinces"
              @input="checkBoxFilterProvinces"
              :loadingButton="ui.loadingProvinces"
            />
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.image')" required>
            <div class="banner__row">
                <img
                  v-if="srcImage"
                  :src="srcImage"
                  class="image">
                <image-uploader
                  class="image-uploader"
                  :preview="false"
                  :className="['fileinput', { 'fileinput--loaded': hasImage }]"
                  capture="environment"
                  :debug="1"
                  doNotResize="gif"
                  :autoRotate="true"
                  outputFormat="verbose"
                  @input="setImage"
                >
                  <i v-show="form.type === 1">(1000x690)</i>
                  <i v-show="form.type === 2">(570x265)</i>
              </image-uploader>

              <ThumbnailDialog
                :width="setRatioThumbnail.width"
                :height="setRatioThumbnail.height"
                :propsRatio="{
                  width: form.type === 1 ? 500 : 285,
                  height: form.type === 1 ? 345 : 133,
                }"
                ref="thumbnailDialog"
                :visible="ui.thumbnailDialogVisible"
                @result="resultThumbnail"
                @close="ui.thumbnailDialogVisible = false"
              />
              <p v-if="hasImage === false && isCheckShow === true" style="color: #F56C6C;font-size: 12px;">{{ $t('page.banner.requiredImagePath') }}</p>
            </div>
          </el-form-item>
        </div>
      </div>
      <div v-else>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.title')" prop="title" required>
            <el-input :placeholder="$t('page.banner.title')" v-model="form.title" type="text"></el-input>
          </el-form-item>
        </div>
        <div class="banner__form" >
          <el-form-item :label="$t('page.banner.linkItem')" required prop="fileNameImageAds">
            <div class="banner__row" style="align-items: flex-start;">
              <div class="banner__row--margin">
                <el-form-item>
                  <el-select
                  v-model="form.targetType"
                  >
                    <el-option
                      label="H??nh ???nh"
                      :value="107"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="padding-top:3px">
                <div v-if="!srcImageBanner" class="demo-image__load-image-mro">
                  <el-image >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
                <img v-else
                  :src="srcImageBanner"
                  class="image-mro">
                <image-uploader
                  class="image-uploader"
                  :preview="false"
                  :className="['fileinput', { 'fileinput--loaded': hasImageBanner }]"
                  capture="environment"
                  :debug="1"
                  doNotResize="gif"
                  :autoRotate="true"
                  outputFormat="verbose"
                  @input="setImageBanner"
                >
                  <i>(400x300)</i>
              </image-uploader>

              <ThumbnailDialog
                :width="500"
                :height="345"
                :propsRatio="{
                  width: 400,
                  height: 300
                }"
                ref="thumbnailDialogBanner"
                :visible="ui.thumbnailDialogVisibleBanner"
                @result="resultThumbnailBanner"
                @close="ui.thumbnailDialogVisibleBanner = false"
              />
              <p v-if="hasImageBanner === false && isCheckShowBanner === true" style="color: #F56C6C; font-size: 12px;">{{ $t('page.banner.requiredImageBanner') }}</p>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.display')" >
            <el-checkbox :true-label="1" :false-label="0" v-model="form.display"></el-checkbox>
          </el-form-item>
        </div>
        <div class="banner__form">
          <el-form-item :label="$t('page.banner.image')" required prop="fileName">
            <div class="banner__row">

                <div v-if="!srcImage" class="demo-image-banner-mro">
                  <el-image >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
                <img v-else
                  :src="srcImage"
                  class="image-banner-mro" />
                <image-uploader
                  style="padding-top:12px"
                  class="image-uploader"
                  :preview="false"
                  :className="['fileinput', { 'fileinput--loaded': hasImage }]"
                  capture="environment"
                  :debug="1"
                  doNotResize="gif"
                  :autoRotate="true"
                  outputFormat="verbose"
                  @input="setImage"
                >
                  <i>(750x80)</i>
              </image-uploader>

              <ThumbnailDialog
                :width="500"
                :height="345"
                :propsRatio="{
                  width: 750,
                  height: 80
                }"
                ref="thumbnailDialog"
                :visible="ui.thumbnailDialogVisible"
                @result="resultThumbnail"
                @close="ui.thumbnailDialogVisible = false"
              />
            </div>
            <p v-if="hasImage === false && isCheckShow === true" style="color: #F56C6C;font-size: 12px;">{{ $t('page.banner.requiredImagePath') }}</p>
          </el-form-item>
        </div>
      </div>
      <div class="banner__button">
        <el-button type="info" size="large" @click="$router.go(-1)">
            {{ $t('button.back')}}
        </el-button>
        <el-button type="success" :loading="ui.isSubmiting" size="large" @click="preHandleBeforeSubmit">
            {{ $t('button.create')}}
        </el-button>
      </div>
    </el-form>
  </sa-section>
</template>
<script>
import { debounce } from '@/utils/helpers'
import SaSection from '@/components/globals/SaSection.vue'
import SaSelectCheck from '@/components/globals/SaSelectCheck.vue'
import { createBanner } from './api'
import { targetTypeV2, repStatus } from '@/utils/const'
import { fetchPromotions, fetchPromotionGroups } from '@/api/promotion'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { fetchNotices } from '@/api/notices'
import { fetchProvinces, fetchDistricts } from '@/api/province'
import ThumbnailDialog from '@/components/globals/thumbnail-dialog'
import { uploadFileZip } from '@/api/uploadFileZip'
import ImageUploader from '@/components/globals/ImageUploader.vue'

const timeDebounce = 500
const today = new Date()
const currentTime = Date.now()
export default {
  name: 'BannerCreate',
  components: {
    SaSection,
    SaSelectCheck,
    ThumbnailDialog,
    ImageUploader
  },
  data () {
    return {
      form: {
        type: 1,
        title: '',
        targetType: 1,
        targetSn: '',
        targetName: '',
        targetInfo: '',
        display: 1,
        listProvinceSn: [],
        endDate: this.formatDate(today, false),
        fileName: '',
        fileNameImageAds: ''
      },
      image: '',
      imageBanner: '',
      rules: {
        title: [
          { required: true, pattern: '[a-zA-Z0-9]+', message: this.$t('page.banner.requiredTitle'), trigger: 'blur' }
        ],
        listProvinceSn: [
          { required: true, message: this.$t('page.banner.requiredDisplayArea'), trigger: 'change' }
        ]
      },
      ui: {
        isSubmiting: false,
        isLoadingPromotions: false,
        isLoadingHotels: false,
        isLoadingNotices: false,
        isLoadingPromotionGroups: false,
        loadingProvinces: false,
        loadingDistricts: false,
        provinceOptions: [],
        linkItemOptions: targetTypeV2.filter(item => item.value !== 7),
        thumbnailDialogVisible: false,
        thumbnailDialogVisibleBanner: false
      },
      checkBox: {
        checkAllProvinces: false,
        isIndeterminateProvinces: true
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      promotions: [],
      hotels: [],
      notices: [],
      provinces: [],
      districts: [],
      promotionGroups: [],
      provinceSelected: '',
      targetSnSelected: null,
      srcImage: '',
      hasImage: false,
      srcImageBanner: '',
      hasImageBanner: false,
      isCheckShowBanner: false,
      isCheckShow: false
    }
  },
  created () {
    this.fetchPromotions()
    this.fetchProvinces()
  },
  computed: {
    setRatioThumbnail () {
      if (this.form.type === 2) {
        return {
          width: 570,
          height: 265
        }
      } else {
        return {
          width: 500, // 1000
          height: 345 // 690
        }
      }
    }
  },
  watch: {
    'form.targetType' (targetType) {
      this.form.targetSn = ''
      this.form.targetName = ''
      switch (targetType) {
        case 2:
          this.fetchSuggestionsHotels()
          break
        case 3:
          this.fetchNotices()
          break
        case 10:
          this.fetchPromotionGroups()
          break
      }
    },
    targetSnSelected (value) {
      this.form.targetName = value.title ? value.title : value.name
      this.form.targetSn = value.sn
    },
    provinceSelected () {
      this.form.targetSn = ''
      this.fetchDistricts()
    }
  },
  methods: {
    setImage (file) {
      this.hasImage = true
      this.$refs.thumbnailDialog.setup({ file: file })
      this.ui.thumbnailDialogVisible = true
    },
    resultThumbnail (result) {
      this.form.fileName = result.name
      this.image = result
      this.srcImage = URL.createObjectURL(result)
    },

    setImageBanner (file) {
      this.hasImageBanner = true
      this.$refs.thumbnailDialogBanner.setup({ file: file })
      this.ui.thumbnailDialogVisibleBanner = true
    },
    resultThumbnailBanner (result) {
      this.form.fileNameImageAds = result.name
      this.imageBanner = result
      this.srcImageBanner = URL.createObjectURL(result)
    },
    async uploadFileZip (preSigned, filePath) {
      try {
        await uploadFileZip(preSigned, filePath)
      } catch (error) {
        return false
      } finally {}
    },

    disabledDate (time) {
      return time.getTime() < currentTime - 8.64e7
    },
    handleCheckAllChangeProvinces (val) {
      this.form.listProvinceSn = val ? this.ui.provinceOptions : []
      this.checkBox.isIndeterminateProvinces = false
      this.checkBox.checkAllProvinces = !!val
    },
    checkBoxFilterProvinces () {
      this.checkBox.checkAllProvinces = this.form.listProvinceSn.length === this.provinces.length
      this.checkBox.isIndeterminateProvinces = this.form.listProvinceSn.length > 0 && this.form.listProvinceSn.length < this.provinces.length
    },
    async fetchPromotions (keyword) {
      this.ui.isLoadingPromotions = true
      try {
        const params = { keyword: keyword, limit: 10 }
        const { data } = await fetchPromotions(params)
        if (data?.code === repStatus.sussess) {
          this.promotions = data.data.suggestionPromotion
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingPromotions = false
      }
    },
    reloadPromotions: debounce(function (keyword) {
      this.fetchPromotions(keyword)
    }, timeDebounce),
    async fetchSuggestionsHotels (keyword) {
      this.ui.isLoadingHotels = true
      try {
        const params = { keyword: keyword, limit: 10, justHotel: 1, hotelSn: '' }
        const { data } = await fetchSuggestionsHotels(params)
        if (data?.code === repStatus.sussess) {
          this.hotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingHotels = false
      }
    },
    reloadSuggestionsHotels: debounce(function (keyword) {
      this.fetchSuggestionsHotels(keyword)
    }, timeDebounce),
    async fetchNotices (keyword) {
      this.ui.isLoadingNotices = true
      try {
        const params = { keyword: keyword, limit: 10 }
        const { data } = await fetchNotices(params)
        if (data?.code === repStatus.sussess) {
          this.notices = data.data.appNotices
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingNotices = false
      }
    },
    reloadNotices: debounce(function (keyword) {
      this.fetchNotices(keyword)
    }, timeDebounce),
    async fetchPromotionGroups (keyword) {
      this.ui.isLoadingPromotionGroups = true
      try {
        const params = { keyword: keyword, limit: 10 }
        const { data } = await fetchPromotionGroups(params)
        if (data?.code === repStatus.sussess) {
          this.promotionGroups = data.data.promotionGroups
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingPromotionGroups = false
      }
    },
    reloadPromotionGroups: debounce(function (keyword) {
      this.fetchPromotionGroups(keyword)
    }, timeDebounce),
    async fetchProvinces () {
      this.ui.loadingProvinces = true
      try {
        const params = { limit: 100 }
        const { data } = await fetchProvinces(params)
        if (data?.code === repStatus.sussess) {
          this.provinces = data.data.provinces
          this.ui.provinceOptions = await data.data.provinces.reduce(function async (preValue, curValue) {
            return preValue.concat(curValue.sn)
          }, [])
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingProvinces = false
      }
    },
    async fetchDistricts () {
      this.ui.loadingDistricts = true
      try {
        const params = { limit: 100, provinceSn: this.provinceSelected }
        const { data } = await fetchDistricts(params)
        if (data?.code === repStatus.sussess) {
          this.districts = data.data.districts
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingDistricts = false
      }
    },
    preHandleBeforeSubmit () {
      this.$refs.form.validate((valid) => {
        if (this.hasImage === false) {
          this.isCheckShow = true
        }
        if (this.hasImageBanner === false) {
          this.isCheckShowBanner = true
        }
        if (!valid || (this.form.type === 3 && (!this.hasImage || !this.hasImageBanner))) {
          // scrollToTop('.el-form-item__error')
          return false
        }
        this.submit()
      })
    },
    async submit () {
      const self = this
      this.ui.isSubmiting = true
      try {
        const formData = Object.keys(this.form).reduce((formData, key) => {
          if (key === 'listProvinceSn') {
            formData.append(key, `[${this.form[key]}]`)
          } else {
            formData.append(key, this.form[key])
          }
          return formData
        }, new FormData())

        const { data } = await createBanner(formData)
        if (data?.code === repStatus.sussess) {
          if (this.imageBanner) {
            await this.uploadFileZip(data.data.preSignedImageAdsUrl.pre_signed, this.imageBanner)
          }
          if (this.image) {
            await this.uploadFileZip(data.data.preSignedUrl.pre_signed, this.image)
          }
          const message = this.$t('message.createSuccess')
          this.$message({
            type: 'success',
            message: message
          })
          this.$router.go(-1)
        }
      } catch (error) {
        this.ui.isSubmiting = false
        self.$message({
          type: 'error',
          message: error.response ? error.response.data.message[0].message : error
        })
        return false
      } finally {
        this.ui.isSubmiting = false
      }
    },
    changeHotelAdmin (value) {
      if (!value) {
        return
      }
      if (value === 3) {
        this.form.targetType = 107
      } else {
        this.form.targetType = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .banner {
    :deep(.banner__form) {
      margin: 1em 0;
      .el-form-item {
        display: grid;
        grid-template-columns: 1fr;
        margin-bottom: 1em;
        @media (min-width: 640px) {
          display: flex;
          flex-wrap: wrap;
        }
      }
      .el-form-item__label {
        text-align: left;
        @media (min-width: 640px) {
          flex: 1;
        }
      }
      .el-form-item__content {
        @media (min-width: 640px) {
          flex: 3;
        }
      }
      .el-form-item__error {
        margin-top: 0.5em;
        position: unset;
      }
      .datetime {
        width: 100%;
        @media (min-width: 640px) {
          width: 16em;
        }
      }
    }
    &__row {
      @media (min-width: 640px) {
        display: flex;
        align-items: center;
        gap: 0 2em;
        flex-wrap: wrap;
      }
      img {
        width: 16em;
        height: 100px;
        object-fit: contain;
        border: 1px solid #DCDFE6;
        width: 100%;
        @media (min-width: 640px) {
          width: auto;
        }
      }
      .image-uploader {
        text-align: center;
      }
      &--margin {
        margin: 1em 0;
        @media (min-width: 640px) {
          margin: unset;
        }
      }
    }
    &__button {
      display: flex;;
      justify-content: flex-end;
      margin-top: 2em;
    }
    .image-mro {
      width: 400px;
      height: 300px;
      @media (max-width: 640px) {
        width: 200px;
        height: 150px;
      }
    }
    .image-banner-mro {
      width: 750px;
      height: 80px;
      object-fit: cover;
      @media (max-width: 640px) {
        width: 300px;
        height: 64px;
      }
    }
    .demo-image__load-image-mro:deep(.image-slot) {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f7fa;
        color: #909399;
        font-size: 14px;
        width: 400px;
        height: 300px;
        @media (max-width: 640px) {
          width: 200px;
          height: 150px;
        }
    }
    .demo-image-banner-mro:deep(.image-slot) {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f7fa;
        color: #909399;
        font-size: 14px;
        width: 750px;
        height: 80px;
        object-fit: cover;
        @media (max-width: 640px) {
          width: 300px;
          height: 64px;
        }
    }
  }
  :deep(.select-check) {
    button {
      width: 100%;
      @media (min-width: 640px) {
        width: 16em;
      }
    }
  }
  .el-select {
    width: 100%;
  }
</style>
