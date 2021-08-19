<template>
  <div class="container">
    <!-- Display con la grid -->
    <!-- TODO Migliorare la visualizzazione delle frazioni (come frazioni vere e non in riga) -->
    <div class="display-grid">
      <div class="row no-wrap" v-for="(row, index) in matrix" :key="index">
        <div
          v-for="(fraction, jndex) in row"
          :key="jndex"
          style="position: relative"
        >
          <input
            readonly
            :value="
              index == currentRow && jndex == currentCol
                ? currentNumber.join('')
                : fraction.toString()
            "
            class="matrix-element"
            :class="{ selected: jndex == currentCol && index == currentRow }"
            :style="{
              transform: `translate(${
                cols > 3 && currentCol >= 2 ? 137.5 - 112.5 * currentCol : 0
              }%, ${
                rows > 3 && currentRow >= 1 ? -10 - 130 * (currentRow - 1) : 0
              }%)`,
            }"
          />
          <!-- DIV non visibile per l'onclick -->
          <div
            @click="switchRow(index, jndex)"
            class="hidden-div"
            :style="{
              transform: `translate(${
                cols > 3 && currentCol >= 2 ? 137.5 - 112.5 * currentCol : 0
              }%, ${
                rows > 3 && currentRow >= 1 ? -10 - 130 * (currentRow - 1) : 0
              }%)`,
            }"
          />
        </div>
      </div>
    </div>
    <!-- Tastierino numerico -->
    <div>
      <!-- Prima riga (7,8,9) -->
      <div class="row no-wrap">
        <q-btn @click="appendText('7')">7</q-btn>
        <q-btn @click="appendText('8')">8</q-btn>
        <q-btn @click="appendText('9')">9</q-btn>
        <q-btn @click="backspace()" icon="fas fa-backspace" />
      </div>
      <!-- Seconda riga (4,5,6,/) -->
      <div class="row no-wrap">
        <q-btn @click="appendText('4')">4</q-btn>
        <q-btn @click="appendText('5')">5</q-btn>
        <q-btn @click="appendText('6')">6</q-btn>
        <q-btn @click="setFraction()">/</q-btn>
      </div>
      <!-- Terza riga (1,2,3) -->
      <div class="row no-wrap">
        <q-btn @click="appendText('1')">1</q-btn>
        <q-btn @click="appendText('2')">2</q-btn>
        <q-btn @click="appendText('3')">3</q-btn>
      </div>
      <!-- Quarta riga (PREV,0,NEXT) -->
      <div class="row no-wrap">
        <q-btn @click="prev()" :disable="currentRow == 0 && currentCol == 0">
          PREV
        </q-btn>
        <q-btn @click="appendText(0)">0</q-btn>
        <q-btn
          @click="next()"
          :disable="currentRow == rows - 1 && currentCol == cols - 1"
          v-if="currentRow != rows - 1 || currentCol != cols - 1"
        >
          NEXT
        </q-btn>
        <q-btn v-else-if="!viewMat" color="positive" @click="conferma()">
          CONFERMA
        </q-btn>
        <q-btn v-else color="positive" @click="modifica()"> MODIFICA </q-btn>
        <q-btn color="negative" @click="back()">ANNULLA</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { isMatrix, getMatrixFromName } from "src/model/calculator.js";
import {
  errorDialog,
  successDialog,
  convertProxyToMatrix,
} from "src/model/Utilities.js";
import Fraction from "src/model/Fraction.js";

export default defineComponent({
  data() {
    return {
      rows: Number,
      cols: Number,
      currentRow: 0,
      currentCol: 0,
      currentNumber: [0],
      matrix: Array,
      viewMat: false,
    };
  },
  methods: {
    switchRow(i, j) {
      this.pushInMatrix();
      this.currentRow = i;
      this.currentCol = j;
      this.getFromMatrix();
    },
    back() {
      this.$router.push({ name: "calculator" });
    },
    initializeMatrix() {
      let matrix = [];
      for (let i = 0; i < this.rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < this.cols; j++) {
          matrix[i][j] = new Fraction(0);
        }
      }
      this.matrix = matrix;
    },
    prev() {
      try {
        this.pushInMatrix();
        this.currentCol = (this.cols + this.currentCol - 1) % this.cols;
        if (this.currentCol == this.cols - 1) this.currentRow--;
        this.getFromMatrix();
      } catch (e) {
        errorDialog(this, e);
      }
    },
    next() {
      try {
        this.pushInMatrix();
        this.currentCol = (this.currentCol + 1) % this.cols;
        if (this.currentCol == 0) this.currentRow++;
        this.getFromMatrix();
      } catch (e) {
        errorDialog(this, e);
      }
    },
    pushInMatrix() {
      if (this.currentNumber.length == 1) {
        this.matrix[this.currentRow][this.currentCol] = new Fraction(
          this.currentNumber[0]
        );
      } else if (this.currentNumber.length == 3) {
        this.matrix[this.currentRow][this.currentCol] = new Fraction(
          this.currentNumber[0],
          this.currentNumber[2]
        );
      } else throw "Il numero inserito non è valido";
    },
    getFromMatrix() {
      this.currentNumber = [];
      let fraction = this.matrix[this.currentRow][this.currentCol];
      if (fraction instanceof Fraction) {
        this.currentNumber.push(String(fraction.num));
        if (fraction.den != 1) {
          this.currentNumber.push("/");
          this.currentNumber.push(String(fraction.den));
        }
      }
    },
    backspace() {
      if (this.currentNumber.length > 0) {
        let riduzione = this.currentNumber[
          this.currentNumber.length - 1
        ].substring(
          0,
          this.currentNumber[this.currentNumber.length - 1].length - 1
        );
        if (riduzione.length == 0) this.currentNumber.pop();
        else this.currentNumber[this.currentNumber.length - 1] = riduzione;
      }
    },
    appendText(n) {
      if (isNaN(this.currentNumber[this.currentNumber.length - 1]))
        this.currentNumber.push(n);
      else if (parseInt(this.currentNumber[this.currentNumber.length - 1]) == 0)
        this.currentNumber[this.currentNumber.length - 1] = n;
      else if (this.currentNumber[this.currentNumber.length - 1].length < 16)
        this.currentNumber[this.currentNumber.length - 1] += n;
    },
    setFraction() {
      if (
        this.currentNumber.length > 1 ||
        isNaN(this.currentNumber[this.currentNumber.length - 1])
      )
        return;
      this.currentNumber.push("/");
    },
    conferma() {
      this.pushInMatrix();
      this.$store.commit("addMatrix", {
        name: this.$route.params.name,
        rows: this.rows,
        cols: this.cols,
        matrix: convertProxyToMatrix(this.matrix),
      });
      successDialog(
        this,
        `Matrice salvata con nome '${this.$route.params.name}'`
      );
      this.$router.push({ name: "calculator" });
    },
    modifica() {
      this.pushInMatrix();
      this.$store.commit("editMatrix", {
        name: this.$route.params.name,
        matrix: convertProxyToMatrix(this.matrix),
      });
      successDialog(
        this,
        `La matrice '${this.$route.params.name}' è stata aggiornata`
      );
      this.$router.push({ name: "calculator" });
    },
  },
  mounted() {
    this.viewMat = this.$route.params.viewMat;
    if (this.viewMat) {
      if (
        !isMatrix(this.$route.params.name, this) &&
        this.$route.params.name != "MatAns"
      ) {
        this.$router.push({ name: "calculator" });
        return;
      }
      let mat;
      if (this.$route.params.name == "MatAns") mat = this.$store.getters.MatAns;
      else mat = getMatrixFromName(this.$route.params.name, this);
      this.rows = mat.rows;
      this.cols = mat.cols;
      this.matrix = mat.matrix;
      let firstElem = mat.matrix[0][0];
      this.currentNumber = [String(firstElem.num)];
      if (firstElem.den != 1) {
        this.setFraction();
        this.currentNumber.push(String(firstElem.den));
      }
    } else {
      this.rows = this.$route.params.rows;
      this.cols = this.$route.params.cols;
      if (
        this.rows == undefined ||
        this.cols == undefined ||
        this.rows <= 0 ||
        this.cols <= 0
      ) {
        this.$router.push({ name: "Aggiungi dim matrice" });
        return;
      }
      this.initializeMatrix();
    }
  },
});
</script>

<style scoped>
.row.no-wrap {
  margin-top: 3vh;
}
.row.no-wrap .q-btn {
  height: 8.6vh;
  width: 16vw;
  margin-right: 4vw;
  font-weight: bold;
  font-size: min(3vw, 3vh);
}
.row.row.no-wrap .q-btn:last-child {
  margin-right: 0vw;
}
.display-row {
  border: 1px solid rgb(173, 173, 173);
  height: 15vh;
  margin-top: 5vh;
  margin-bottom: 5vh;
  padding-top: 2.5vh;
  padding-bottom: 2.5vh;
  border-radius: 7px;
  overflow: hidden;
  flex-flow: column wrap;
}
.matrix-element {
  outline-width: 0 !important;
  border: 2px solid black;
  border-radius: 7px;
  height: 10vh;
  margin-left: 2.5vw;
  width: 20vw;
  font-size: min(3vw, 3vh);
  text-align: center;
  z-index: -1;
  transition-duration: 600ms;
}
.selected {
  background-color: yellow;
}
.container {
  display: block;
}
.display-grid {
  border: 1px solid rgb(173, 173, 173);
  height: 40vh;
  margin-bottom: 5vh;
  border-radius: 7px;
  overflow: hidden;
  flex-flow: column wrap;
}
.hidden-div {
  opacity: 0;
  width: 20vw;
  height: 100%;
  position: absolute;
  top: 0;
  margin-left: 2.5vw;
  z-index: 1;
  border-radius: 7px;
  cursor: pointer;
}
</style>
