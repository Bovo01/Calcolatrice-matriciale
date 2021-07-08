<template>
  <div>
    <calculator />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Calculator from "src/components/Calculator.vue";
import Fraction from "src/model/Fraction.js";
import Matrix from "src/model/Matrix.js";

export default defineComponent({
  name: "PageIndex",
  components: {
    Calculator,
  },
  mounted() {
    let m = new Matrix(3, 3, [
      [2, 4, -2],
      [1, 3, -2],
      [3, 8, -5],
    ]);

    let m2 = new Matrix(3, 3, [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, -1],
    ]);
    
    
  },
});
</script>
