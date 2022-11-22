<template>
  <sa-section class="transfer">
    <el-form :model="form" :rules="rules" ref="form" v-loading="ui.isLoadingTable">
      <div class="transfer__row">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.hotelName')" prop="hotelSn">
              <el-select
                :placeholder="$t('page.bookingReport.hotelName')"
                class="w-100"
                :loading="ui.isLoadingHotel"
                v-model="form.hotelSn"
                remote
                filterable
                @change="reloadRoomTypeHotel"
                :remote-method="searchSuggestionsHotels"
              >
                <el-option
                  v-for="(item, index) in hotels"
                  :key="index"
                  :label="`${item.name} - ${item.address}`"
                  :value="item.sn"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.status')" prop="bookingStatus">
              <el-select
                :placeholder="$t('page.bookingReport.status')"
                class="w-100"
                v-model="form.bookingStatus"
              >
                <el-option
                  v-for="(item, index) in ui.statusOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.roomType')" prop="roomTypeSn">
              <el-select
                :placeholder="$t('page.bookingReport.roomType')"
                class="w-100"
                :loading="ui.isLoadingRoomType"
                v-model="form.roomTypeSn"
              >
                <el-option
                  v-for="(item, index) in roomTypes"
                  :key="index"
                  :label="item.name"
                  :value="item.sn"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.confirmedBy')" prop="viaObject">
              <el-select
                class="w-100"
                :placeholder="$t('page.bookingReport.confirmedBy')"
                v-model="form.viaObject"
              >
                <el-option
                  v-for="(item, index) in ui.confirmOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                  :disabled="item.value == 7"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.bookingType')" prop="type">
              <el-select
                @change="onChangeType"
                :placeholder="$t('page.bookingReport.bookingType')"
                class="w-100"
                v-model="form.type"
              >
                <el-option
                  v-for="(item, index) in ui.bookingTypeOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.removeCoupon')">
              <el-select
                :disabled="form.roomTypeMode === 2 || form.bookingStatus === 3 || form.couponIssuedSn === null"
                :placeholder="$t('page.bookingReport.removeCoupon')"
                class="w-100"
                :loading="ui.isLoadingHotel"
                v-model="form.removeCouponIssuedSn"
              >
                <el-option
                  v-for="(item, index) in ui.couponOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 1" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.stayAtHotelTime')">
              <el-date-picker
                :placeholder="$t('page.bookingReport.stayAtHotelTime')"
                class="w-100"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="form.checkInDatePlan"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 2 || form.type === 3" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.dateFrom')">
              <el-date-picker
                class="w-100"
                v-model="dateRange"
                type="daterange"
                popper-class="custom-date-range"
                :range-separator="$t('page.bookingReport.to')"
                :start-placeholder="$t('page.bookingReport.dateFrom')"
                :end-placeholder="$t('page.bookingReport.dateTo')"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === 1" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.timeFrom')">
              <el-time-picker
                class="w-100"
                is-range
                v-model="form.timeFromTo"
                format="HH:mm"
                value-format="HH:mm:ss"
                :range-separator="$t('page.bookingReport.to')"
                :start-placeholder="$t('page.bookingReport.startTime')"
                :end-placeholder="$t('page.bookingReport.endTime')">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.paymentMethod')" prop="paymentMethod">
              <el-select
                :placeholder="$t('page.bookingReport.paymentMethod')"
                class="w-100"
                v-model="form.paymentMethod"
              >
                <el-option
                  v-for="(item, index) in ui.paymentMethodOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$t('page.bookingReport.commission')" prop="hotelCommission">
              <el-select
                :placeholder="$t('page.bookingReport.commission')"
                class="w-100"
                v-model="form.hotelCommission"
              >
                <el-option
                  v-for="(item, index) in ui.commissionOptions"
                  :key="index"
                  :label="`${$t(item.key)}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- -------------------------------- -->
        </el-row>
      </div>

      <div class="transfer__descripton">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item :label="$t('page.bookingReport.reasonTransfer')" prop="reasonTransfer">
                <tinymce v-model="form.reasonTransfer" :height="500" />
            </el-form-item>
            </el-col>
        </el-row>
      </div>
      <!-- --------------------- -->
      <el-row :gutter="50" style="margin-top: 16px; margin-bottom: 16px">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-radio v-model="typeCalculate" :label="1" class="bold">{{ $t('page.bookingReport.automaticallyUpdate') }}</el-radio>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="5">
            <el-radio v-model="typeCalculate" :label="2" class="bold">{{ $t('page.bookingReport.manuallyUpdate') }}</el-radio>
          </el-col>
      </el-row>
      <!-- ------------------------- -->
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="4" :lg="3" :xl="3">
          <el-form-item :label="$t('page.bookingReport.roomRate')">
            <el-currency-input
                :disabled="typeCalculate === 1"
                :min="0"
                :fixed="0"
                @onBlur="form.roomTypeAmount = formatEvenPrice(form.roomTypeAmount)"
                v-model="form.roomTypeAmount"
                clearable
              >
              </el-currency-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="3" :xl="3">
          <el-form-item :label="$t('page.bookingReport.productAmount')">
            <el-currency-input
                :disabled="typeCalculate === 1"
                :min="0"
                :fixed="0"
                @onBlur="form.productValue = formatEvenPrice(form.productValue)"
                v-model="form.productValue"
                clearable
              >
              </el-currency-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="4" :xl="4">
          <el-form-item :label="$t('page.bookingReport.totalPayment')">
            <el-currency-input
                :disabled="typeCalculate === 1"
                :min="0"
                :fixed="0"
                @onBlur="form.totalAmount = formatEvenPrice(form.totalAmount)"
                v-model="form.totalAmount"
                clearable
              >
              </el-currency-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="4" :xl="4">
          <el-form-item :label="$t('page.bookingReport.go2joyDiscount')">
            <el-popover
              placement="bottom"
              trigger="click"
              >
              <el-button :class="typeCalculate === 1 ? 'is-disable' : ''" class="w-100" slot="reference">{{ formatMoney(form.totalGo2JoyDiscount) }} <i class="el-icon-info" style="float:right"></i></el-button>
                <div class="popover-row">
                  <el-row v-if="typeCalculate === 1" :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.coupon') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.go2joyDiscount) }}
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.mileagePoint') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.mileagePoint) }}
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.otherDiscount') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.promotionDiscount) }}
                    </el-col>
                  </el-row>
                  <!-- -------------- input data ---------------- -->
                  <el-row v-else :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.coupon') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumG2JDiscount"
                        v-model="form.go2joyDiscount"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.mileagePoint') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumG2JDiscount"
                        v-model="form.mileagePoint"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.otherDiscount') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumG2JDiscount"
                        v-model="form.promotionDiscount"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                  </el-row>
                </div>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="4" :xl="4">
          <el-form-item :label="$t('page.bookingReport.hotelDiscount')">
            <el-popover
              placement="bottom"
              trigger="click"
              >
              <el-button :class="typeCalculate === 1 ? 'is-disable' : ''" class="w-100" slot="reference">{{ formatMoney(form.totalHotelDiscount) }} <i class="el-icon-info" style="float:right"></i></el-button>
                <div class="popover-row">
                  <el-row v-if="typeCalculate === 1" :gutter="10">
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.coupon') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.hotelDiscount) }}
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.flaseSale') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.fsHotelDiscount) }}
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.redeemStamp') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.redeemValue) }}
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                      {{ $t('page.bookingReport.directDiscount') }}
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                      {{ formatMoney(form.directDiscount) }}
                    </el-col>
                  </el-row>
                  <!-- -------------- input data ---------------- -->
                  <el-row v-else :gutter="10">
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.coupon') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumHotelDiscount"
                        v-model="form.hotelDiscount"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.flaseSale') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumHotelDiscount"
                        v-model="form.fsHotelDiscount"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.redeemStamp') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumHotelDiscount"
                        v-model="form.redeemValue"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                    <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                      {{ $t('page.bookingReport.directDiscount') }}
                    </el-col>
                    <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                      <el-currency-input
                        :min="0"
                        :fixed="0"
                        @onBlur="onSumHotelDiscount"
                        v-model="form.directDiscount"
                        clearable
                      >
                      </el-currency-input>
                    </el-col>
                  </el-row>
                </div>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="3" :xl="3">
          <el-form-item :label="$t('page.bookingReport.usersPay')">
            <el-currency-input
                :disabled="typeCalculate === 1"
                :min="0"
                :fixed="0"
                @onBlur="form.amountFromUser = formatEvenPrice(form.amountFromUser)"
                v-model="form.amountFromUser"
                clearable
              >
              </el-currency-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="5" :lg="3" :xl="3">
          <el-form-item :label="$t('page.bookingReport.paidInAdvance')">
            <el-currency-input
                :disabled="typeCalculate === 1"
                :min="0"
                :fixed="0"
                @onBlur="form.prepayAmount = formatEvenPrice(form.prepayAmount)"
                v-model="form.prepayAmount"
                clearable
              >
              </el-currency-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="custom-button">
          <div class="transfer__button">
            <el-button :loading="ui.isSubmiting" type="primary" @click="preHandleBeforeSubmit">{{ $t('button.transfer') }}</el-button>
            <el-button :disabled="ui.isDisabled" :loading="ui.isSaving" type="success" @click="onSave">{{ $t('button.sent') }}</el-button>
            <el-button type="info" @click="onBack">{{ $t('button.back') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- --------------- table ------------------ -->
    <el-table
      v-loading="ui.isLoadingTable"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        width="80">
        <template slot-scope="scope">
          <p class="bold">{{ scope.$index === 0 ? $t('page.bookingReport.new') : $t('page.bookingReport.old')  }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="hotelName"
        width="200"
        :label="$t('page.bookingReport.hotelName')">
      </el-table-column>
      <el-table-column
        prop="code"
        width="160"
        :label="$t('page.bookingReport.code')">
      </el-table-column>
      <el-table-column
        width="160"
        :label="$t('page.bookingReport.bookingNo')">
        <template slot-scope="scope">
          <router-link :to="{ name: 'firstBookingDetails', params: { sn: scope.row.sn}}">
            {{ scope.row.bookingNo }}
          </router-link>
          <p>{{ formatDateUI(scope.row.createTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        :label="$t('page.bookingReport.deviceType')">
        <template slot-scope="scope">
          <p>{{ setDeviceType(scope.row.deviceType) }}</p>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        :label="$t('page.bookingReport.userInfo')">
        <template slot-scope="scope">
          <router-link :to="{ name: 'userDetails', params: { sn: scope.row.appUserSn } }">
            {{ scope.row.appUserNickName }}
          </router-link>
          <p>{{ scope.row.mobile }}</p>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.roomtype')">
        <template slot-scope="scope">
          <router-link :to="{ name: 'detailRoomType', params: { sn: scope.row.roomTypeSn } }">
            {{ scope.row.roomTypeName }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.coupon')">
        <template slot-scope="scope">
          <div v-if="scope.row.couponName">
            <router-link v-if="scope.row.couponPromotionSn" :to="{name: 'detailPromotion', query: { sn: scope.row.couponPromotionSn }}">
              {{ `${scope.row.couponName} (${formatMoney(scope.row.discount)} + ${scope.row.discountType})` }}
            </router-link>
            <p>{{ `${scope.row.couponName} (${formatMoney(scope.row.discount)} + ${scope.row.discountType})` }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.bookingType')">
        <template slot-scope="scope">
          {{ setBookingType(scope.row.type) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.stayAtHotelTime')">
        <template slot-scope="scope">
          <p>{{ formatDateUI(scope.row.checkInDatePlan, false) }}</p>
          <p v-if="scope.row.type === 1">
            {{ `${formatTime(scope.row.startTime)} ~ ${formatTime(scope.row.endTime)}` }}
          </p>
          <p v-if="scope.row.type === 3">
            {{ formatDateUI(scope.row.endDate, false) }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        width="180"
        :label="$t('page.bookingReport.bookingStatus')">
        <template slot-scope="scope">
          <span class="dot" :class="setClassBookingStatus(scope.row)"></span>
          <span>{{ setBookingStatus(scope.row) }}</span>
          <el-tooltip v-if="setReasonBookingStatus(scope.row)" class="ml-4" effect="light" :content="setReasonBookingStatus(scope.row)" placement="bottom">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
          <p v-if="setTextCancellation(scope.row)" class="text-danger">{{ setTextCancellation(scope.row) }} </p>
          <p class="text-grey">{{ formatDateUI(scope.row.lastUpdate) }}</p>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.roomRate')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.roomTypeAmount) }}
          <i v-if="scope.row.extraFee > 0" style="font-weight: bold" class='el-icon-top text-danger'></i>
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.productAmount')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.productValue) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.totalPayment')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.totalAmount) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.g2jDiscount')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.totalGo2joyDiscount) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.hotelDiscount')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.totalHotelDiscount) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.userPay')">
        <template slot-scope="scope">
          {{ formatMoney(scope.row.amountFromUser) }}
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        :label="$t('page.bookingReport.paidInAdvance')">
        <template slot-scope="scope">
          <div v-if="scope.row.refunded > 0">
            <div v-if="scope.row.prepayAmount > 0">
              <p class="text-danger">
                <del>{{ formatMoney(scope.row.prepayAmount) }}</del>
              </p>
              <p>{{ setPaymentProvider(scope.row.paymentProvider) }}</p>
            </div>
            <p v-else>0</p>
          </div>
          <div v-else-if="scope.row.refunded === 0">
            <div v-if="scope.row.prepayAmount > 0">
              <p>{{ formatMoney(scope.row.prepayAmount) }}</p>
              <p>{{ setPaymentProvider(scope.row.paymentProvider) }}</p>
            </div>
            <p v-else>0</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </sa-section>
</template>

<script>
import SaSection from '@/components/globals/SaSection.vue'
import { fetchSuggestionsHotels, listHotels } from '@/api/hotels'
import { listRoomTypeHotel } from '@/api/roomType'
import { transferBooking, saveTransferBooking } from './api'
import { fetchUserBookingDetails } from '../details/api'
import { debounce, scrollToTop } from '@/utils/helpers'
import { STATUS_REPORT, TYPE_REPORT, PAYMENT_METHOD, CONFIRM_BY, repStatus, BOOKING_STATUS } from '@/utils/const'
import ElCurrencyInput from '@/components/globals/elCurrencyInput'
import Tinymce from '@/components/globals/Tinymce/index.vue'

const timeDebounce = 500
const today = new Date()

export default {
  components: {
    SaSection,
    ElCurrencyInput,
    Tinymce
  },
  name: 'BookingReport',
  data: (vm) => {
    return {
      hotels: [],
      roomTypes: [],
      tableData: [],
      transferData: [],
      typeCalculate: 1,
      filter: {
        dateFrom: today,
        dateTo: today
      },
      form: {
        hotelSn: null,
        roomTypeSn: null,
        reasonTransfer: '',
        totalGo2JoyDiscount: 0,
        totalHotelDiscount: 0,
        removeCouponIssuedSn: 0
      },
      ui: {
        isLoadingHotel: false,
        isLoadingTable: false,
        isLoadingRoomType: false,
        isSubmiting: false,
        isSaving: false,
        isDisabled: true,
        statusOptions: STATUS_REPORT,
        bookingTypeOptions: TYPE_REPORT,
        paymentMethodOptions: PAYMENT_METHOD,
        confirmOptions: CONFIRM_BY,
        couponOptions: [
          { value: 1, key: 'option.yes' },
          { value: 0, key: 'option.no' }
        ],
        commissionOptions: [
          { value: 0, key: '0%' },
          { value: 5, key: '5%' },
          { value: 10, key: '10%' },
          { value: 12, key: '12%' },
          { value: 13, key: '13%' },
          { value: 15, key: '15%' },
          { value: 20, key: '20%' }
        ]
      },
      rules: {
        hotelSn: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        bookingStatus: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        roomTypeSn: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        type: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        hotelCommission: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        reasonTransfer: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ],
        viaObject: [
          { required: true, message: vm.$t('validation.required'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.fetchUserBookingDetails()
  },
  computed: {
    dateRange: {
      get () {
        return [this.filter.dateFrom, this.filter.dateTo]
      },
      set (val) {
        this.filter.dateFrom = val[0]
        this.filter.dateTo = val[1]
        if (this.form.type === 2) {
          this.filter.dateTo = this.formatDatePlusOne(val[0])
        }
      }
    }
  },
  watch: {
    dateRange (value) {
      if (!value) {
        delete this.filter.dateFrom
        delete this.filter.dateTo
      } else {
        this.filter.dateFrom = value[0]
        this.filter.dateTo = value[1]
      }
    }
  },
  methods: {
    onChangeType () {
      if (this.form.type === 2) {
        this.filter.dateTo = this.formatDatePlusOne(this.filter.dateFrom)
      }
    },
    async fetchUserBookingDetails () {
      this.ui.isLoadingTable = true
      try {
        const { data } = await fetchUserBookingDetails(this.$route.params.sn)
        if (data?.code === repStatus.sussess) {
          this.tableData = [data.data, data.data]
          this.form = data.data

          const paymentMethod = data.data?.paymentProvider !== 0 ? 1 : 0

          this.ui.statusOptions = STATUS_REPORT.filter(item => item.value !== BOOKING_STATUS.awaitingPay && item.value !== BOOKING_STATUS.awaitingConfirm && item.value !== BOOKING_STATUS.waitForGo2Joy)
          if (data.data?.bookingStatus === 0) {
            this.form.bookingStatus = 3
          }
          this.form.timeFromTo = [data.data?.startTime || '', data.data?.endTime || '']
          this.form.removeCouponIssuedSn = 2
          this.form.viaObject = data.data?.viaObject || null
          this.form.removeCouponIssuedSn = 0
          this.filter.dateFrom = data.data?.checkInDatePlan || ''
          this.filter.dateTo = data.data?.endDate || this.formatDatePlusOne(this.filter.dateFrom)

          this.form = { ...this.form, paymentMethod }
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingTable = false
        this.getHotels()
        this.getRoomTypeHotel(this.form.hotelSn)
      }
    },
    async getSuggestionsHotels (params) {
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
    searchSuggestionsHotels: debounce(function (keyword) {
      this.getSuggestionsHotels({
        limit: 10,
        justHotel: 1,
        keyword: keyword
      })
    }, timeDebounce),
    async getHotels () {
      this.ui.isLoadingHotel = true
      try {
        const params = {
          hotelStatus: 3,
          hotelSn: this.form.hotelSn
        }
        const { data } = await listHotels(params)
        if (data?.code === repStatus.sussess) {
          this.hotels = data.data.hotels
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingHotel = false
      }
    },
    async getRoomTypeHotel (hotelSn) {
      this.ui.isLoadingRoomType = true
      try {
        const { data } = await listRoomTypeHotel(hotelSn)
        if (data?.code === repStatus.sussess) {
          this.roomTypes = data.data
          if (!this.form.roomTypeSn) {
            this.form.roomTypeSn = data.data[0].sn // auto choose first room
          }
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isLoadingRoomType = false
      }
    },
    reloadRoomTypeHotel (hotelSn) {
      this.form.roomTypeSn = ''
      this.getRoomTypeHotel(hotelSn)
    },
    onSumG2JDiscount () {
      this.form.go2joyDiscount = this.formatEvenPrice(this.form.go2joyDiscount)
      this.form.mileagePoint = this.formatEvenPrice(this.form.mileagePoint)
      this.form.promotionDiscount = this.formatEvenPrice(this.form.promotionDiscount)

      this.form.totalGo2JoyDiscount = this.form.go2joyDiscount + this.form.mileagePoint + this.form.promotionDiscount
      return true
    },
    onSumHotelDiscount () {
      this.form.hotelDiscount = this.formatEvenPrice(this.form.hotelDiscount)
      this.form.fsHotelDiscount = this.formatEvenPrice(this.form.fsHotelDiscount)
      this.form.redeemValue = this.formatEvenPrice(this.form.redeemValue)
      this.form.directDiscount = this.formatEvenPrice(this.form.directDiscount)

      this.form.totalHotelDiscount = this.form.hotelDiscount + this.form.fsHotelDiscount + this.form.redeemValue + this.form.directDiscount
      return true
    },
    preHandleBeforeSubmit () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          scrollToTop('.el-form-item__error')
          return false
        }
        this.submit()
      })
    },
    async submit () {
      this.ui.isSubmiting = true
      try {
        this.form.userBookingSn = this.$route.params.sn
        this.form.typeCalculate = this.typeCalculate
        this.form.endDate = this.filter.dateTo ? this.formatDate(this.filter.dateTo, false) : ''
        this.form.paymentProvider = this.form.paymentMethod
        if (this.form.type !== 1) {
          this.form.checkInDatePlan = this.filter.dateFrom
        }
        this.form.startTime = this.form.timeFromTo[0]
        this.form.endTime = this.form.timeFromTo[1]

        const formData = Object.keys(this.form).reduce((formData, key) => {
          formData[key] = this.form[key]
          return formData
        }, {})

        const { data } = await transferBooking(formData)
        if (data?.code === repStatus.sussess) {
          this.ui.isDisabled = false
          this.transferData = data.data

          this.tableData = [data.data?.userBookingNew, data.data?.userBookingOld]
          this.tableData[0].reasonForCancellation = null
          this.tableData[0].reasonForNoShow = null

          this.$message({
            type: 'success',
            message: this.$t('message.transferSuccess')
          })
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSubmiting = false
      }
    },
    async onSave () {
      this.ui.isSaving = true
      try {
        const { data } = await saveTransferBooking(this.transferData)
        if (data?.code === repStatus.sussess) {
          this.onBack()
        }
      } catch (error) {
        return false
      } finally {
        this.ui.isSaving = false
      }
    },
    onBack () {
      return this.$router.push({ name: 'searchByBookingNo', query: { type: Number(this.$route.query.type ?? 0), bookingNo: this.form.bookingNo ?? '' } })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer {
  &__row {
    :deep(.el-form-item) {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 12px;
      @media (max-width: 768px) {
        display: block;
      }
    }
    :deep(.el-form-item__label) {
      text-align: left;
      flex: 1;
    }
    :deep(.el-form-item__content) {
      flex: 2;
    }
    :deep(.el-form-item__error) {
      position: unset;
    }
  }
  &__descripton {
    :deep(.el-form-item) {
      display: flex;
      flex-flow: row wrap;
      flex-wrap: wrap;
      margin-bottom: 12px;
      @media (max-width: 768px) {
        display: block;
      }
    }
    :deep(.el-form-item__label) {
      text-align: left;
      padding: unset;
      flex: 1;
    }
    :deep(.el-form-item__content) {
      flex: 5;
      display: inline-block;
      width: 100%;
    }
    :deep(.el-form-item__error) {
      position: unset;
    }
  }
  &__button {
    z-index: 100;
    display: flex;
    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    right: 0;
    background: white;
    width: 100%;
    padding-bottom: 1vh;
    padding-right: 2vh;

    button {
      margin-top: 1vh;
    }
  }
  :deep(.el-range-separator) {
    width: 12%;
  }
}
.popover-row {
  padding: 16px;
  max-width: 375px
}
.el-popover {
  .el-row {
    margin: unset !important;
  }
  .el-col {
    padding: 4px 10px;;
  }
}
.el-col {
  padding: unset;
}
.w-100 {
  width: 100% !important;
}
.custom-button {
  text-align: right;
  margin-top: 4px;
  margin-bottom: 2vh;
}

.is-disable {
  background-color: #F5F7FA;
  border-color: #E4E7ED;
  color: #C0C4CC;
}
</style>
