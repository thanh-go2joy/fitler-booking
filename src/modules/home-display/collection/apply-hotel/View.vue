<template>
  <sa-section class="apply-hotel">
    <template slot="header">
      <div class="apply-hotel__header">
        <div class="apply-hotel__header--search">
          <div class="mb-1em">
            <el-select
              class="w-100"
              v-model="filter.provinceSn"
              @change="fetchSuggestionsHotels"
              v-loading="ui.loadingProvince"
              element-loading-spinner="el-icon-loading"
              :placeholder="$t('page.collection.province')"
              clearable
            >
              <el-option
                v-for="(item, index) in listProvinces"
                :key="index"
                :label="item.name"
                :value="item.sn"
              />
            </el-select>
          </div>

          <div class="mb-1em">
            <el-select
              class="w-100"
              v-model="filter.suggestionsHotel"
              v-loading="ui.loadingSuggestionsHotel"
              element-loading-spinner="el-icon-loading"
              :placeholder="$t('page.collection.hotelSuggestion')"
              remote
              filterable
              :remote-method="searchSuggestionsHotels"
              style="min-width: 350px;"
              prefix-icon="el-icon-search"
              clearable
              @change="addApplyHotel"
              :disabled="ui.isAddingHotels"
            >
              <ElOption
                v-for="(item, index) in listSuggestionsHotels"
                :key="index"
                :label="`${item.name} - ${item.address}`"
                :value="item.sn"
                style="font-size: 13px; color: #4a5d6e;"
              />
            </el-select>
          </div>
        </div>

        <div class="apply-hotel__header--add">
          <el-button
            @click="$router.go(-1)"
            type="info"
            plain
          >
            {{ $t('page.collection.back') }}
          </el-button>

          <el-button
            type="warning"
            plain
            icon="el-icon-plus"
            :loading="ui.isSubmitting"
            @click="onSaveApplyHotel"
          >
            {{ $t('page.collection.save') }}
          </el-button>
        </div>
      </div>
    </template>
    <!-- table -->

    <el-table
      row-key="sn"
      v-loading="ui.loadingSuggestionsHotel"
      :data="listApplyHotels"
    >
      <el-table-column
        label="#"
        type="index"
      />
      <el-table-column
        :label="$t('page.collection.hotelName')"
        min-width="150"
      >
        <template slot-scope="scope">
          <router-link :to="{ name: 'detail_hotel_display', params: { sn: scope.row.sn } }">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.status')"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ setStatus(scope.row.hotelStatus) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.phone')"
        min-width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.province')"
        min-width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.provinceName }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.address')"
        min-width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.createTime')"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.lastUpdate')"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.lastUpdate }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('page.collection.operations')"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            size="small"
            @click="deleteApplyHotel(scope.row.sn)"
          >
            {{ $t('button.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </sa-section>
</template>
<script>
import { fetchProvinces } from '@/api/province'
import { fetchSuggestionsHotels } from '@/api/hotels'
import { addApplyHotel, fetchApplyHotels, resetApplyHotels, deleteApplyHotel, saveApplyHotels, sortApplyHotels } from './api'
import { debounce } from '@/utils/helpers'
import SaSection from '@/components/globals/SaSection.vue'
import { repStatus } from '@/utils/const'

const timeDebounce = 500
export default {
  name: 'SelectApplyHotel',
  components: {
    SaSection
  },
  data: () => {
    return {
      ui: {
        loadingProvince: false,
        loadingSuggestionsHotel: false,
        isAddingHotels: false,
        isSubmitting: false
      },
      filter: {
        provinceSn: '',
        suggestionsHotel: '',
        limit: 10,
        justHotel: 1
      },
      listProvinces: [],
      listSuggestionsHotels: [],
      listApplyHotels: []
    }
  },
  created () {
    this.filter.provinceSn = Number(this.$route.query.provinceSn) || ''
    this.fetchProvinces()
    this.fetchSuggestionsHotels()
    this.fetchApplyHotels()
  },
  methods: {
    searchSuggestionsHotels: debounce(function (keySearch) {
      this.filter = {
        limit: 10,
        justHotel: 1,
        keyword: keySearch
      }
      this.fetchSuggestionsHotels()
    }, timeDebounce),
    async fetchApplyHotels () {
      this.ui.loadingApplyHotels = true
      try {
        this.resetApplyHotels()
        const { data } = await fetchApplyHotels(this.$route.params.sn, { provinceSn: this.filter.provinceSn })
        if (data.code === repStatus.sussess) {
          this.listApplyHotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingApplyHotels = false
      }
    },
    async fetchSuggestionsHotels (provinceSn) {
      if (provinceSn) {
        this.filter.provinceSn = provinceSn
      }
      this.ui.loadingSuggestionsHotel = true
      try {
        const { data } = await fetchSuggestionsHotels(this.filter)
        if (data.code === repStatus.sussess) {
          this.listSuggestionsHotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingSuggestionsHotel = false
      }
    },
    async fetchProvinces () {
      this.ui.loadingProvince = true
      try {
        const { data } = await fetchProvinces({ limit: 100, status: 1 })
        if (data.code === repStatus.sussess) {
          this.listProvinces = [{ name: this.$t('page.collection.all'), sn: '' }, ...data.data?.provinces]
        }
      } catch (error) {
        return false
      } finally {
        this.ui.loadingProvince = false
      }
    },
    async resetApplyHotels () {
      try {
        await resetApplyHotels(this.$route.params.sn)
      } catch (error) {
        return false
      } finally {
        this.ui.loadingProvince = false
      }
    },
    // events
    async deleteApplyHotel (sn) {
      try {
        const { data } = await deleteApplyHotel(this.$route.params.sn, { hotelSn: sn })
        if (data.code === repStatus.sussess) {
          this.listApplyHotels = data.data.hotels
          const message = this.$t('page.collection.removeSuccess')
          this.$message({
            type: 'success',
            message: message
          })
        }
      } catch (error) {
        return false
      }
    },
    async onSaveApplyHotel () {
      this.ui.isSubmitting = true
      try {
        const { data } = await saveApplyHotels(this.$route.params.sn)
        if (data.code === repStatus.sussess) {
          this.$router.push({ name: 'collection' })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSubmitting = false
      }
    },
    async changePosition (e) {
      if (!e.moved) {
        return false
      }
      const query = `positionBefore=${e.moved.oldIndex}&positionAfter=${e.moved.newIndex}`
      try {
        await sortApplyHotels(this.$route.params.sn, query)
      } catch (error) {
        return false
      } finally {
        this.ui.loading = false
      }
    },
    setStatus (hotelStatus) {
      if (!hotelStatus) {
        return ''
      }
      switch (hotelStatus) {
        case 1: return this.$t('page.collection.waiting')
        case 2: return this.$t('page.collection.displayed')
        case 3: return this.$t('page.collection.contracted')
        case 4: return this.$t('page.collection.trial')
        case 5: return this.$t('page.collection.terminated')
        case 6: return this.$t('page.collection.suspended')
        default: return ''
      }
    },
    async addApplyHotel (suggestionsHotel) {
      this.ui.isAddingHotels = true
      try {
        if (!suggestionsHotel) {
          return
        }
        const { data } = await addApplyHotel(this.$route.params.sn, { hotelSn: suggestionsHotel })
        if (data.code === repStatus.sussess) {
          this.listApplyHotels = data.data.hotels
          const message = this.$t('page.collection.addSuccess')
          this.$message({
            type: 'success',
            message: message
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isAddingHotels = false
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.apply-hotel {
  &__header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1em;
    &--search {
      display: flex;
      gap: 1em;

      @media (max-width: 768px) {
        display: inline-block;
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    .mb-1em {
      margin-bottom: 1em;
    }
    .w-100 {
      width: 100%;
    }
  }
}
</style>
