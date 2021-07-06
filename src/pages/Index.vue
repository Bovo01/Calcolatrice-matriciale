<template>
  <div>
    <calculator />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Calculator from "src/components/Calculator.vue";
import Fraction from "src/model/Fraction.js";

export default defineComponent({
  name: "PageIndex",
  components: {
    Calculator,
  },
  mounted() {
    let f1 = new Fraction(2,3);
    let f2 = new Fraction(3,2);
  }
});
</script>
