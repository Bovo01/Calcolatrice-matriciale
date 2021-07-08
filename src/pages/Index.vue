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
    let f1 = new Fraction(2, 3);
    let f2 = new Fraction(3, 2);
    let mat = [];
    let m = new Matrix(1, 2, [[f1, f2]]);
    console.log(m.multPerScalare(new Fraction(3, 5)));
    console.log(m.multPerScalare(new Fraction(3, 5)).transposition());
    console.log(m.sub(m));
  },
});
</script>
