<template>
  <sa-section>
    <Form page="paid" />
  </sa-section>
</template>
<script>
import SaSection from '@/components/globals/SaSection.vue'
import Form from '../common/form.vue'
export default {
  name: 'hotelDebtCreatePaid',
  components: {
    Form,
    SaSection
  }
}
</script>
