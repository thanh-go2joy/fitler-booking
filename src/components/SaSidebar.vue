<template>
  <el-menu
    fixed
    :default-active="$route.path"
    class="el-menu-vertical my-side-bar"
    :unique-opened="true"
    :class="isExpend ? 'active' : ''"
    @select="handleSelect"
  >
    <!-- <div v-if="hasPermission(menu.permission)"> -->
      <component
        :is="menu.childrens ? 'ElSubmenu' : 'ElMenuItem'"
        v-for="menu in menus"
        :key="'top-menu-' + menu.title"
        :index="menu.path || menu.title"
        :default-active="menu.children ? $router.currentRoute.fullPath: null"
        :class="{ 'is-active': setActive(menu.actives), 'no-permission':checkPermissionMenu(menu.permission) }"
      >
        <template
          :slot="menu.childrens ? 'title': 'default'"
        >
          <i v-if="menu.icon" :class="menu.icon" />
          <img v-if="menu.image" :src="menu.image" class="menu-image">
          <span class="submenu-title" :class="isExpend ? 'active' : ''" slot="title">{{ $t(`breadcrumb.${menu.title}`) }}</span>
        </template>
        <el-menu-item
          v-for="sub in menu.childrens"
          :key="'sub-menu-'+ menu.title+'-'+sub.title"
          :index="sub.path || sub.title"
          :class="{'is-active' : setActive(sub.actives),'no-permission':checkPermissionMenu(sub.permission) }"
        >
          <span class="router-children" :class="isExpend ? 'active' : ''">{{ $t(`breadcrumb.${sub.title}`) }}</span>
        </el-menu-item>
      </component>
  </el-menu>
</template>

<script>

export default {
  name: 'SaSidebar',
  props: {
    isExpend: Boolean
  },
  computed: {
    menus () {
      return [
        {
          title: 'activities',
          path: '/hotel/sadmin/activities',
          image: require('@/assets/images/svg/collapse.svg'),
          actives: ['activities_detail'],
          permission: 'saactivity'
        },
        {
          title: 'home',
          path: '/hotel/sadmin/dashboard',
          image: require('@/assets/images/svg/dashboard.svg'),
          actives: ['categoryEdit', 'collection', 'collectionDetails', 'collectionEdit', 'categoryDetails', 'selectApplyHotel'],
          permission: 'sahome'
        },
        {
          title: 'hotels',
          image: require('@/assets/images/svg/advanced.svg'),
          actives: [
            'hotels',
            'hotel_staff_mgt',
            'hotel_staff_detail',
            'hotel_staff_edit',
            'hotel_staff_create',
            'product_type_create',
            'product_type_edit',
            'hotel_group_create',
            'hotel_group_detail',
            'hotel_group_edit',
            'product_detail',
            'product-mgt',
            'hotel-facility-mgt',
            'facility_create',
            'facility_edit',
            'hotel_facility_mgt',
            'notice_to_hotel',
            'notice_to_hotel_detail',
            'notice_to_hotel_create',
            'notice_edit',
            'create_apply_for_hotel',
            'reply_to_hotel',
            'list_apply_for_hotel',
            'notice_to_hotel_reply',
            'send_notice_to_hotel',
            'hotelDisplayCreate',
            'hotelDisplayEdit',
            'hotelDisplayDetails',
            'detailRoomType',
            'settingFs',
            'room_type',
            'editRoomType',
            'createRoomType',
            'stampCreate',
            'stampDetailTotalUser',
            'stampDetails',
            'stampEdit',
            'reviewDetail',
            'review'

          ],
          childrens: [
            {
              title: 'product_type_mgt',
              path: '/hotel/sadmin/product-type-mgt',
              actives: ['product-type-mgt', 'product_type_create', 'product_type_edit'],
              permission: 'saproducttype'
            },
            {
              title: 'product_mgt',
              path: '/hotel/sadmin/product-mgt',
              actives: ['product-mgt', 'product_detail'],
              permission: 'saproducttype'
            },
            {
              title: 'hotel_group_mgt',
              path: '/hotel/sadmin/hotel-group-mgt',
              actives: ['hotel-group-mgt', 'hotel_group_create', 'hotel_group_detail', 'hotel_group_edit'],
              permission: 'sahotelgroup'
            },
            {
              title: 'hotelDisplay',
              path: '/hotel/sadmin/hotel-display',
              actives: [
                'hotelDisplayCreate',
                'hotelDisplayEdit',
                'hotelDisplayDetails'
              ],
              permission: 'sahotel'
            },
            {
              title: 'roomType',
              path: '/hotel/sadmin/room-type',
              actives: [
                'detailRoomType',
                'settingFs',
                'roomType',
                'editRoomType',
                'createRoomType'
              ],
              permission: 'saroomtype'
            },
            {
              title: 'hotel_staff_mgt',
              path: '/hotel/sadmin/hotel-staff-mgt',
              actives: ['hotel_staff_mgt', 'hotel_staff_detail', 'hotel_staff_edit', 'hotel_staff_create'],
              permission: 'sastaff'
            },
            {
              title: 'hotel_facility_mgt',
              path: '/hotel/sadmin/hotel-facility-mgt',
              actives: ['facility_create', 'facility_edit', 'hotel_facility_mgt'],
              permission: 'safacility'
            },
            {
              title: 'notice_to_hotel',
              path: '/hotel/sadmin/notice-to-hotel',
              actives: ['notice_to_hotel', 'notice_to_hotel_detail', 'notice_to_hotel_create', 'notice_edit', 'create_apply_for_hotel', 'reply_to_hotel', 'list_apply_for_hotel', 'notice_to_hotel_reply', 'send_notice_to_hotel'],
              permission: 'safaq'
            },
            {
              title: 'stamp',
              path: '/hotel/sadmin/stamp',
              actives: [
                'stampCreate',
                'stampDetailTotalUser',
                'stampDetails',
                'stampEdit'
              ],
              permission: 'sastamp'
            },
            {
              title: 'review',
              path: '/hotel/sadmin/review',
              permission: 'sareview',
              actives: [
                'reviewDetail',
                'review'
              ]
            }
          ]
        },
        {
          title: 'user',
          image: require('@/assets/images/svg/user.svg'),
          actives: ['userDetails', 'userEdit', 'pointListMgt'],
          childrens: [
            {
              title: 'deviceMgt',
              path: '/hotel/sadmin/device',
              permission: 'sauser'
            },
            {
              title: 'userMgt',
              path: '/hotel/sadmin/users',
              actives: ['userDetails', 'userEdit', 'pointListMgt'],
              permission: 'sauser'
            },
            {
              title: 'counselingMgt',
              path: '/hotel/sadmin/counseling',
              permission: 'sacounseling'
            },
            {
              title: 'firstBooking',
              path: '/hotel/sadmin/first-booking',
              actives: [],
              permission: 'sauser'
            }
          ]
        },
        {
          title: 'booking',
          image: require('@/assets/images/svg/basic.svg'),
          actives: [
            'bookingReportHotels',
            'searchByBookingNo',
            'cashFlowReportDetail',
            'sendMail',
            'revenueReportDetails',
            'sendingMailCreate',
            'sendingMailDetails',
            'bookingAdhoc',
            'firstBookingDetails',
            'bookingReportTransfer',
            'hotelDebtDetailList', 'hotelDebtEdit', 'hotelDebtDetail', 'hotelDebtReview', 'hotelDebtCreate', 'ApplyForHotel', 'hotelDebtCreatePaid'
          ],
          childrens: [
            {
              title: 'bookingReport',
              path: '/hotel/sadmin/booking-report',
              actives: ['bookingReportHotels', 'searchByBookingNo', 'firstBookingDetails', 'bookingReportTransfer'],
              permission: 'sabooking'
            },
            {
              title: 'cashFlowReport',
              path: '/hotel/sadmin/cash-flow-report',
              actives: ['cashFlowReportDetail', 'sendMail'],
              permission: 'sabooking'
            },
            {
              title: 'hotelDebt',
              path: '/hotel/sadmin/hotel-debt',
              actives: ['hotelDebtDetailList', 'hotelDebtEdit', 'hotelDebtDetail', 'hotelDebtReview', 'hotelDebtCreate', 'ApplyForHotel', 'hotelDebtCreatePaid'],
              permission: 'sahoteldebt'
            },
            {
              title: 'sendingMail',
              path: '/hotel/sadmin/sending-mail',
              actives: [
                'sendingMailCreate',
                'sendingMailDetails'
              ],
              permission: 'sahoteldebt'
            },
            {
              title: 'revenueReport',
              path: '/hotel/sadmin/revenue-report',
              actives: ['revenueReportDetails'],
              permission: 'sahoteldebt'
            }
            // {
            //   title: 'bookingAdhoc',
            //   path: '/hotel/sadmin/booking-adhoc',
            //   actives: ['bookingAdhoc'],
            //   permission: 'sabooking'
            // }
          ]
        },
        {
          title: 'marketing',
          icon: 'el-icon-data-line',
          actives: [
            'createEditReferral',
            'referralReport',
            'referral',
            'createEditLuckyWheel',
            'luckyWheel',
            'articleCreate',
            'articleEdit',
            'articleSetup',
            'Pin article',
            'Article with title',
            'Article with image',
            'Article with summary',
            'Article collection',
            'articleCategoryEdit',
            'articleCategoryCreate',
            'smsCreate',
            'promotion',
            'createPromotion',
            'editPromotion',
            'promotionDetails',
            'couponCondition',
            'hotelApply',
            'userApply',
            'applyForUser',
            'applyForHotel',
            'applyForHotelRoom',
            'chooseWinner',
            'hotelApply',
            'userApply',
            'groupPromotion',
            'editGroupPromotion',
            'createGroupPromotion',
            'applyForPromotion',
            'settingGroupPromotion',
            'crm',
            'crmDetail',
            'crmCreate',
            'inviteFriendCreate',
            'inviteFriendEdit',
            'inviteFriendDetails',
            'inviteFriendDetailsList',
            'inviteeList',
            'noticeCreate',
            'noticeEdit',
            'noticeDetails',
            'notificationCreate',
            'notificationEdit',
            'notificationDetails',
            'bannerCreate',
            'bannerEdit',
            'bannerDetails',
            'bannerSetting',
            'popupCreate',
            'popupEdit',
            'popupDetails',
            'popupSetting',
            'popup',
            'pgpbCreate',
            'pgpbEdit',
            'pgpb',
            'pgpbTotalOfIntroduction'
          ],
          childrens: [
            {
              title: 'promotion',
              path: '/hotel/sadmin/promotion',
              actives: [
                'createPromotion',
                'editPromotion',
                'promotionDetails',
                'couponCondition',
                'hotelApply',
                'userApply',
                'applyForUser',
                'applyForHotel',
                'applyForHotelRoom',
                'chooseWinner',
                'hotelApply',
                'userApply',
                'groupPromotion',
                'editGroupPromotion',
                'createGroupPromotion',
                'applyForPromotion',
                'settingGroupPromotion'
              ],
              permission: 'sapromotion'
            },
            {
              title: 'inviteFriend',
              path: '/hotel/sadmin/invite-friend',
              actives: [
                'inviteFriendCreate',
                'inviteFriendEdit',
                'inviteFriendDetails',
                'inviteFriendDetailsList',
                'inviteeList'
              ],
              permission: 'sainvitefriend'
            },
            {
              title: 'notice',
              path: '/hotel/sadmin/notice',
              actives: [
                'noticeCreate',
                'noticeEdit',
                'noticeDetails'
              ],
              permission: 'saappnotice'
            },
            {
              title: 'notification',
              path: '/hotel/sadmin/notification',
              actives: [
                'notificationCreate',
                'notificationEdit',
                'notificationDetails'
              ],
              permission: 'sanotification'
            },
            {
              title: 'banner',
              path: '/hotel/sadmin/banner',
              actives: [
                'bannerCreate',
                'bannerEdit',
                'bannerDetails',
                'bannerSetting',
                'banner'
              ],
              permission: 'sabanner'
            },
            {
              title: 'popup',
              path: '/hotel/sadmin/popup',
              actives: [
                'popupCreate',
                'popupEdit',
                'popupDetails',
                'popupSetting',
                'popup'
              ],
              permission: 'sapopup'
            },
            {
              title: 'sms',
              path: '/hotel/sadmin/sms',
              actives: ['smsCreate'],
              permission: 'sasms'
            },
            {
              title: 'crm',
              path: '/hotel/sadmin/crm',
              actives: [
                'crmDetail',
                'crmCreate'
              ],
              permission: 'sacrm'
            },
            {
              title: 'pgpb',
              path: '/hotel/sadmin/pgpb',
              actives: [
                'pgpbCreate',
                'pgpbEdit',
                'pgpb',
                'pgpbTotalOfIntroduction'
              ],
              permission: 'sasale'
            },
            // {
            //   title: 'articleHome',
            //   path: '/hotel/sadmin/article-home',
            //   actives: [
            //     'articleSetup',
            //     'Pin article',
            //     'Article with title',
            //     'Article with image',
            //     'Article with summary',
            //     'Article collection'
            //   ],
            //   permission: 'saarticle'
            // },
            {
              title: 'article',
              path: '/hotel/sadmin/article',
              actives: ['articleCreate', 'articleEdit'],
              permission: 'saarticle'
            },
            // {
            //   title: 'articleCategory',
            //   path: '/hotel/sadmin/article-category',
            //   actives: ['articleCategoryEdit', 'articleCategoryCreate'],
            //   permission: 'saarticle'
            // },
            {
              title: 'luckyWheel',
              path: '/hotel/sadmin/lucky-wheel',
              actives: ['createEditLuckyWheel']
            },
            {
              title: 'referral',
              path: '/hotel/sadmin/referral',
              actives: [
                'createEditReferral',
                'referralReport'
              ]
            }
          ]
        },
        {
          title: 'saAccountMgt',
          icon: 'el-icon-user',
          actives: ['go2joyStaffDetails', 'go2joyStaffCreate', 'go2joyStaffEdit', 'SaleIncentiveHistoryDetails', 'SaleIncentiveHistoryCreate', 'DetailsOfStaff', 'AccountSaleIncentiveDetail'],
          childrens: [
            {
              title: 'SaleIncentiveHistory',
              path: '/hotel/sadmin/sale-incentive-history',
              actives: ['SaleIncentiveHistoryDetails', 'SaleIncentiveHistoryCreate', 'DetailsOfStaff', 'AccountSaleIncentiveDetail'],
              permission: 'sasaleincentive'
            },
            {
              title: 'go2joyStaffs',
              path: '/hotel/sadmin/staffs-management',
              actives: ['go2joyStaffDetails', 'go2joyStaffCreate', 'go2joyStaffEdit'],
              permission: 'sasuperstaff'
            },
            {
              title: 'permission',
              path: '/hotel/sadmin/permission',
              actives: ['permissionDetails'],
              permission: 'sapermission'
            },
            {
              title: 'go2joyConfirmGroup',
              path: '/hotel/sadmin/confirm-group-mgt',
              actives: ['go2joyConfirmGroup'],
              permission: 'saconfirmgroup'
            }
          ]
        },
        {
          title: 'service_agreement_mgt',
          path: '/hotel/sadmin/service-agreement',
          icon: 'el-icon-collection',
          actives: ['serviceAgreementMgt', 'updateServiceAgreementMgt']

        },
        {
          title: 'mileagePointMgt',
          image: require('@/assets/images/svg/dollar.svg'),
          actives: ['mpUserMgt', 'pointListMgt', 'mpBoostingDetails', 'mpBoostingCreate', 'mpBoostingEdit'],
          permission: 'samp',
          childrens: [
            {
              title: 'mpBoostingMgt',
              path: '/hotel/sadmin/mp-boosting-mgt',
              actives: ['mpBoostingDetails', 'mpBoostingCreate', 'mpBoostingEdit'],
              permission: 'samp'

            },
            {
              title: 'mpUserMgt',
              path: '/hotel/sadmin/mp-user-mgt',
              actives: ['mpUserMgt'],
              permission: 'samp'
            }
          ]
        },
        {
          title: 'trackingMgt',
          image: require('@/assets/images/svg/basic.svg'),
          actives: ['trackingMgt', 'bookingTrackingMgt', 'hotelStatusTrackingMgt', 'hotelIntroduceSignup', 'hotelIntroduceSignup', 'numberOfSignup', 'checkinByRegister'],
          permission: 'satracking',
          childrens: [
            {
              title: 'bookingTrackingMgt',
              path: '/hotel/sadmin/booking-tracking-mgt',
              actives: ['bookingTrackingMgt'],
              permission: 'satracking'

            },
            {
              title: 'hotelStatusTrackingMgt',
              path: '/hotel/sadmin/hotel-status-tracking-mgt',
              actives: ['hotelStatusTrackingMgt'],
              permission: 'satracking'
            },
            {
              title: 'hotelIntroduceSignup',
              path: '/hotel/sadmin/hotel-introduce-signup',
              actives: ['hotelIntroduceSignup', 'numberOfSignup', 'checkinByRegister'],
              permission: 'satracking'
            }
          ]
        },
        {
          title: 'settings',
          icon: 'el-icon-s-tools',
          actives: ['openSecondSplashEdit', 'openSecondSplashCreate', 'hotelOnTopEdit', 'hotelOnTopCreate'],
          childrens: [
            {
              title: 'generalSetting',
              path: '/hotel/sadmin/general-setting',
              permission: 'sasetting'
            },
            {
              title: 'openSecondSplash',
              path: '/hotel/sadmin/open-second-splash',
              actives: ['openSecondSplashEdit', 'openSecondSplashCreate'],
              permission: 'sasplash2nd'
            },
            {
              title: 'hotelOntop',
              path: '/hotel/sadmin/hotel-on-top-management',
              actives: ['hotelOnTopEdit', 'hotelOnTopCreate'],
              permission: 'sahotelontop'
            }
          ]
        }
      ]
    }
  },
  watch: {
    isExpend: function () {
      const submenu = Array.from(this.$el.querySelectorAll('.el-submenu')) || []
      submenu.forEach(menu => {
        menu.classList.remove('is-opened')
      })
    }
  },
  methods: {
    setActive (actives = []) {
      if (actives && actives.length === 0) {
        return false
      }
      const result = actives.find(item => item === this.$router.currentRoute.name)
      return !!result
    },
    // handleSelect (key) {
    //   if (key !== this.$router.currentRoute.fullPath) {
    //     this.$router.push(key)
    //   }
    // },
    handleSelect (key) {
      const dataAccountDirectToV1 = `?sa-infor-direct${localStorage.getItem('directToSaV1UserId')}password${localStorage.getItem('directToSaV1Password')}otpCode${localStorage.getItem('otpCode')}`
      if (key !== this.$router.currentRoute.fullPath) {
        // this.$router.push(key)
        if (key === '/hotel/sadmin/activities') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/activities${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/dashboard') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/dashboard`)
        else if (key === '/hotel/sadmin/product-type-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/product-type-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/product-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/product-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-group-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-group-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-staff-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-staff-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-facility-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/facility-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/notice-to-hotel') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/notice-to-hotel${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-display') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-display-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/room-type') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-room-type${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/stamp') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/stamp${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/review') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/review-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/users') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/users${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/device') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/devices${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/counseling') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/counselings${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/first-booking') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/first-booking${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/booking-report') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/booking-report${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/cash-flow-report') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/cash-flow-report${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-debt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-debt-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/sending-mail') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/sending-mail-mgt${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/revenue-report') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/revenue-report${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/booking-adhoc') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/booking-adhoc${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/promotion') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/promotion${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/invite-friend') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/invite-friend${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/notice') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/notice${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/notification') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/notification${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/banner') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/banner${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/popup') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/popup${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/sms') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/sms${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/crm') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/crm${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/pgpb') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/pgpb${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/article-home') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/article-home${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/referral') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/referral${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/article') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/article${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/article-category') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/article-category${dataAccountDirectToV1}`)
        // else if (key === '/hotel/sadmin/lucky-weel') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/lucky-weel${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/service-agreement') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/service-agreement-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/sale-incentive-history') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/account-sale-incentive-management${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/staffs-management') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/staff-management${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/confirm-group-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/confirm-group-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/permission') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/permission${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/mp-boosting-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/mp-boosting-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/mp-user-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/mp-user-mgt${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/booking-tracking-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/booking-tracking${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-status-tracking-mgt') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-status-tracking${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-introduce-signup') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-introduce-signup${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/general-setting') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/general-setting${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/open-second-splash') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/open-second-splash${dataAccountDirectToV1}`)
        else if (key === '/hotel/sadmin/hotel-on-top-management') return window.location.replace(`${process.env.VUE_APP_DOMAIN_V1}/hotel-on-top${dataAccountDirectToV1}`)
        else this.$router.push(key)
      }
    }
  }
}
</script>
<style lang="scss">

.no-permission {
  display: none !important;
}
.my-side-bar {
  .el-submenu {
    &__icon-arrow{
      display: none;
    }
  }
  &.active {
    .el-submenu {
      &__icon-arrow{
        display: unset;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 64px;
  transition: width 0.5s;
  &.active {
    width: 226px;
  }
}
.el-image {
  height: 100%;
  width: 170px;
  padding-top: 10px;
  padding-left: 10px;
}
.el-submenu .el-menu-item {
  min-width: auto;
}
.el-menu {
  height: auto;
  min-height: 100vh;
  .menu-image {
    display: inline-block;
    width: 20px;
    vertical-align: middle;
    margin-right: 10px;
    filter: invert(0.6) sepia(1) saturate(1) hue-rotate(185deg);
  }
  .el-menu-item {
    padding: 0;
    .el-tooltip {
      padding: 14px 20px !important;
    }
    a {
      width: 100%;
      height: 100%;
      display: block;
      color: #263a5b;
    }
  }
}
.el-submenu.is-active,
.el-menu-item.is-active {
  .submenu-title,
  .router-link-active {
    color: #ff6400;
  }
  .menu-image {
    filter: invert(40%) sepia(67%) saturate(3335%) hue-rotate(5deg) brightness(95%) contrast(102%) !important;
  }
}
.submenu-title,
.router-children {
  width: 0px;
  opacity: 0;
  transition: width 0.01s 0s, opacity 0.1s 0.2s;
  &.active{
    width: 226px;
    opacity: 1;
  }
}
.el-menu-item.is-active {
  .router-children {
    color: #ff6400;
  }
}
.el-submenu:hover, .el-menu-item:hover {
  .submenu-title {
    color: #ff6400;
  }
  .menu-image {
    filter: invert(40%) sepia(67%) saturate(3335%) hue-rotate(5deg) brightness(95%) contrast(102%) !important;
  }
}
.el-menu-item:hover {
  .router-children {
    color: #ff6400;
  }
}
</style>
