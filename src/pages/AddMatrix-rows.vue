<template>
  <div class="container">
    <!-- Display con la matrice -->
    <div></div>
    <!-- Tastierino numerico -->
    <div>
      <div class="row no-wrap">
        <q-btn @click="appendText(7)">7</q-btn>
        <q-btn @click="appendText(8)">8</q-btn>
        <q-btn @click="appendText(9)">9</q-btn>
      </div>
      <!-- Quarta riga (4,5,6,-) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(4)">4</q-btn>
        <q-btn @click="appendText(5)">5</q-btn>
        <q-btn @click="appendText(6)">6</q-btn>
      </div>
      <!-- Quinta riga (1,2,3,+) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(1)">1</q-btn>
        <q-btn @click="appendText(2)">2</q-btn>
        <q-btn @click="appendText(3)">3</q-btn>
      </div>
      <!-- Sesta riga ((,0,),=) -->
      <div class="row no-wrap">
        <q-btn @click="prev()" :disable="currentRow == 0 && currentCol == 0">
          PREV
        </q-btn>
        <q-btn @click="appendText(0)">0</q-btn>
        <q-btn
          @click="next()"
          :disable="currentRow == rows - 1 && currentCol == cols - 1"
        >
          NEXT
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  data() {
    return {
      rows: Number,
      cols: Number,
      currentRow: 0,
      currentCol: 0,
      matrix: [],
    };
  },
  methods: {
    initializeMatrix() {
      this.matrix = [];
      for (let i = 0; i < this.rows; i++) this.matrix[i] = [];
    },
    prev() {
      this.currentCol = Math.abs(this.currentCol - 1) % this.cols;
      if (this.currentCol == this.cols - 1) this.currentRow--;
    },
    next() {
      this.currentCol = (this.currentCol + 1) % this.cols;
      if (this.currentCol == 0) this.currentRow++;
    },
  },
  created() {
    this.rows = this.$route.params.rows;
    this.cols = this.$route.params.cols;
    if (this.rows < 0 || this.cols < 0) {
      this.router.push({ name: "Aggiungi dim matrice" });
      return;
    }
    this.initializeMatrix();
  },
});
</script>

<style scoped>
.row.no-wrap {
  margin-top: 3vh;
}
.row.no-wrap .q-btn {
  height: 8.6vh;
  width: 17vw;
  margin-right: 4vw;
  font-weight: bold;
  font-size: min(3vw, 3vh);
}
.row.row.no-wrap .q-btn:last-child {
  margin-right: 0vw;
}
</style>