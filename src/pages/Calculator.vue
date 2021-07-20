<template>
  <div class="container">
    <!-- Display -->
    <div class="row">
      <input class="display" v-model="text" readonly />
    </div>
    <!-- Bottoni -->
    <div :class="{ bubah: theme == 1 }">
      <!-- Prima riga (vars,ops,view mat,^) -->
      <div class="row no-wrap">
        <q-btn-dropdown label="VARS">
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="(matrix, index) in matrixes"
              v-bind:key="index"
            >
              <q-item-section>
                <q-item-label @click="appendMatrix(matrix)">
                  {{ matrix.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label @click="addMatrix()">Add mat</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn>OPS</q-btn>
        <q-btn>VIEW MAT</q-btn>
        <q-btn @click="appendText('^')">^</q-btn>
      </div>
      <!-- Seconda riga (trash,BUBAH,backspace,/) -->
      <div class="row no-wrap">
        <q-btn @click="clear()" icon="fas fa-trash" />
        <q-btn @click="toggleTheme()">THEME</q-btn>
        <q-btn @click="backspace()" icon="fas fa-backspace" />
        <q-btn @click="appendText('/')" icon="fas fa-divide" />
      </div>
      <!-- Terza riga (7,8,9,*) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(7)">7</q-btn>
        <q-btn @click="appendText(8)">8</q-btn>
        <q-btn @click="appendText(9)">9</q-btn>
        <q-btn @click="appendText('*')" icon="fas fa-times" />
      </div>
      <!-- Quarta riga (4,5,6,-) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(4)">4</q-btn>
        <q-btn @click="appendText(5)">5</q-btn>
        <q-btn @click="appendText(6)">6</q-btn>
        <q-btn @click="appendText('-')" icon="fas fa-minus" />
      </div>
      <!-- Quinta riga (1,2,3,+) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(1)">1</q-btn>
        <q-btn @click="appendText(2)">2</q-btn>
        <q-btn @click="appendText(3)">3</q-btn>
        <q-btn @click="appendText('+')" icon="fas fa-plus" />
      </div>
      <!-- Sesta riga ((,0,),=) -->
      <div class="row no-wrap">
        <q-btn @click="appendText('(')">(</q-btn>
        <q-btn @click="appendText(0)">0</q-btn>
        <q-btn @click="appendText(')')">)</q-btn>
        <q-btn @click="solve()" icon="fas fa-equals" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  isFunction,
  isOperator,
  toRPN,
  resolveRPN,
} from "src/model/calculator.js";
import Fraction from "src/model/Fraction.js";

export default defineComponent({
  name: "Calculator",
  data() {
    return {
      operations: [],
      parenthesis: 0,
      theme: 0,
      qtyThemes: 2,
    };
  },
  computed: {
    text: function () {
      return this.operations.join("");
    },
    matrixes: function () {
      return this.$store.getters.matrixes;
    },
  },
  methods: {
    appendText(text) {
      text = String(text);
      let lastOperation = this.operations[this.operations.length - 1];
      if (!isNaN(text) && !isNaN(lastOperation)) {
        if (lastOperation.length < 16)
          this.operations[this.operations.length - 1] = String(
            parseInt(lastOperation + text)
          );
      } else if (isFunction(text)) {
        this.operations.push(text);
        this.operations.push("(");
        this.parenthesis++;
      } else if (isOperator(text)) {
        if (isOperator(lastOperation))
          this.operations[this.operations.length - 1] = text;
        else if (lastOperation != "(" && this.operations.length > 0)
          this.operations.push(text);
      } else if (text == "(") {
        this.operations.push(text);
        this.parenthesis++;
      } else if (text == ")") {
        if (this.parenthesis > 0 && lastOperation != "(") {
          this.operations.push(text);
          this.parenthesis--;
        }
      } else {
        this.operations.push(text);
      }
    },
    appendMatrix(matrix) {
      if (
        !(
          this.operations[this.operations.length - 1].matrix instanceof Matrix
        ) &&
        !isNaN(this.operations[this.operations.length - 1])
      ) {
        this.operations.push(matrix);
      }
    },
    clear() {
      this.operations = [];
    },
    backspace() {
      let lastOperation = this.operations[this.operations.length - 1];
      if (isNaN(lastOperation) || lastOperation.length <= 1)
        this.operations.pop();
      else {
        this.operations[this.operations.length - 1] = lastOperation.substring(
          0,
          lastOperation.length - 1
        );
      }
    },
    solve() {
      if (this.operations.length < 3) return;
      // Converto i numeri in frazioni
      let operations = [];
      for (let i = 0; i < this.operations.length; i++) {
        if (!isNaN(this.operations[i])) {
          operations.push(new Fraction(this.operations[i]));
        } else operations.push(this.operations[i]);
      }
      this.$q.notify({
        message: resolveRPN(toRPN(operations)).toString(),
        position: "top",
        color: "positive",
      });
    },
    addMatrix() {
      this.$router.push({ name: "Aggiungi dim matrice" });
    },
    toggleTheme() {
      this.theme = (this.theme + 1) % this.qtyThemes;
    },
  },
  mounted() {},
});
</script>

<style scoped>
.bubah {
  background-image: url("src/assets/Bubah.jpeg");
  background-size: cover;
}

.display {
  border: 2px solid black;
  border-radius: 7px;
  height: 15vh;
  width: 80vw;
  cursor: default;
  outline-width: 0;
  font-size: min(4vw, 4vh);
}
.row {
  margin-top: 3vh;
}
.row .q-btn {
  height: 8.6vh;
  width: 17vw;
  margin-right: 4vw;
  font-weight: bold;
  font-size: min(3vw, 3vh);
}
.row .q-btn:last-child {
  margin-right: 0vw;
}
.q-item {
  margin-top: 0;
  font-size: min(3vw, 3vh);
}
</style>
