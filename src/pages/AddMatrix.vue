<template>
  <div class="container">
    <div v-if="!buildMatrix">
      <!-- Dimensioni -->
      <q-input outlined v-model="rows" label="Righe" type="number" />
      <q-input outlined v-model="cols" label="Colonne" type="number" />
      <div class="row justify-center">
        <q-btn color="positive" class="confirm" @click="confirmDimensions()">
          Conferma
        </q-btn>
      </div>
    </div>
    <div v-else>
      <!-- Tastierino numerico -->
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
        <q-btn @click="switchRow(currentRow - 1)" :disable="currentRow == 0">PREV</q-btn>
        <q-btn @click="appendText(0)">0</q-btn>
        <q-btn @click="switchRow(currentRow + 1)" :disable="currentRow == rows - 1">NEXT</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  data() {
    return {
      rows: "",
      cols: "",
      buildMatrix: false,
      currentRow: 0,
      currentCol: 0,
      matrix: [],
    };
  },
  methods: {
    confirmDimensions() {
      if (parseInt(this.rows) > 0 && parseInt(this.cols) > 0) {
        this.rows = parseInt(this.rows);
        this.cols = parseInt(this.cols);
        this.buildMatrix = true;
        this.initializeMatrix();
      }
    },
    initializeMatrix() {
      this.matrix = [];
      for (let i = 0; i < this.rows; i++) this.matrix[i] = [];
    },
    switchRow(row) {
      this.currentRow = row;
    }
  },
});
</script>

<style scoped>
.confirm {
  margin-top: 5vh;
}
.q-input {
  margin-bottom: 1vh;
}
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
