<template>
  <sa-section>
    <Form page="debt" />
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import Form from '../common/form.vue'
export default {
  name: 'createHotelDebt',
  components: {
    Form,
    SaSection
  }
}
</script>
