<template>
  <div class="container">
    <!-- Display -->
    <div class="row" style="position: relative">
      <input class="display" v-model="text" readonly />
      <span class="result" :class="{ hide: !displayResult }">
        ={{ result.toString() }}
      </span>
    </div>
    <!-- Bottoni -->
    <div :class="{ bubah: theme == 1 }">
      <!-- Prima riga (vars,ops,view mat,^) -->
      <div class="row no-wrap">
        <!-- Dropdown VARS -->
        <q-btn-dropdown label="VARS">
          <q-list>
            <!-- Ans -->
            <q-item
              clickable
              v-close-popup
              v-if="ans != null"
              style="color: cyan"
              :disable="state == 1 || state >= 5"
            >
              <q-item-section>
                <q-item-label @click="appendText('Ans')"> Ans </q-item-label>
              </q-item-section>
            </q-item>
            <!-- MatAns -->
            <q-item
              clickable
              v-close-popup
              v-if="matAns != null"
              style="color: cyan"
              :disable="state == 1 || state >= 5"
            >
              <q-item-section>
                <q-item-label @click="appendText('MatAns')">
                  MatAns
                </q-item-label>
              </q-item-section>
            </q-item>
            <!-- Matrici salvate -->
            <q-item
              clickable
              v-close-popup
              v-for="(matrix, index) in matrixes"
              v-bind:key="index"
              :disable="state == 1 || state >= 5"
            >
              <q-item-section>
                <q-item-label @click="appendText(matrix.name)">
                  {{ matrix.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <!-- Bottone aggiunta matrice -->
            <q-item clickable v-close-popup style="color: lime">
              <q-item-section>
                <q-item-label @click="addMatrix()">Add mat</q-item-label>
              </q-item-section>
            </q-item>
            <!-- Bottone rimozione matrice -->
            <q-item clickable v-close-popup style="color: red">
              <q-item-section>
                <q-item-label @click="removeMatrix()">Delete mat</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- Dropdown OPS -->
        <q-btn-dropdown label="OPS">
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="(operation, index) in ops"
              v-bind:key="index"
              :disable="state == 1"
            >
              <q-item-section>
                <q-item-label @click="appendText(operation.funcName)">
                  {{ operation.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- Dropdown VIEW MAT -->
        <q-btn-dropdown label="VIEW MAT">
          <q-list>
            <!-- MatAns -->
            <q-item
              clickable
              v-close-popup
              v-if="matAns != null"
              style="color: cyan"
            >
              <q-item-section>
                <q-item-label @click="viewMat('MatAns')"> MatAns </q-item-label>
              </q-item-section>
            </q-item>
            <!-- Matrici salvate -->
            <q-item
              clickable
              v-close-popup
              v-for="(matrix, index) in matrixes"
              v-bind:key="index"
              :disable="state == 1 || state >= 5"
            >
              <q-item-section>
                <q-item-label @click="viewMat(matrix.name)">
                  {{ matrix.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          @click="appendText('^')"
          :disable="state == 0 || state == 2 || state == 6"
        >
          ^
        </q-btn>
      </div>
      <!-- Seconda riga (trash,theme,backspace,/) -->
      <div class="row no-wrap">
        <q-btn
          @click="clear()"
          icon="fas fa-trash"
          :disable="operations.length == 0"
        />
        <q-btn @click="toggleTheme()">THEME</q-btn>
        <q-btn
          @click="backspace()"
          icon="fas fa-backspace"
          :disable="operations.length == 0"
        />
        <q-btn
          @click="appendText('/')"
          icon="fas fa-divide"
          :disable="state == 0 || state == 2 || state == 6"
        />
      </div>
      <!-- Terza riga (7,8,9,*) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(7)" :disable="state >= 5">7</q-btn>
        <q-btn @click="appendText(8)" :disable="state >= 5">8</q-btn>
        <q-btn @click="appendText(9)" :disable="state >= 5">9</q-btn>
        <q-btn
          @click="appendText('*')"
          icon="fas fa-times"
          :disable="state == 0 || state == 2 || state == 6"
        />
      </div>
      <!-- Quarta riga (4,5,6,-) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(4)" :disable="state >= 5">4</q-btn>
        <q-btn @click="appendText(5)" :disable="state >= 5">5</q-btn>
        <q-btn @click="appendText(6)" :disable="state >= 5">6</q-btn>
        <q-btn
          @click="appendText('-')"
          icon="fas fa-minus"
          :disable="state == 2 || state == 6"
        />
      </div>
      <!-- Quinta riga (1,2,3,+) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(1)" :disable="state >= 5">1</q-btn>
        <q-btn @click="appendText(2)" :disable="state >= 5">2</q-btn>
        <q-btn @click="appendText(3)" :disable="state >= 5">3</q-btn>
        <q-btn
          @click="appendText('+')"
          icon="fas fa-plus"
          :disable="state == 0 || state == 2 || state == 6"
        />
      </div>
      <!-- Sesta riga ((,0,),=) -->
      <div class="row no-wrap">
        <q-btn @click="appendText('(')">(</q-btn>
        <q-btn @click="appendText(0)" :disable="state >= 5">0</q-btn>
        <q-btn
          @click="appendText(')')"
          :disable="
            parenthesis <= 0 ||
            state == 0 ||
            state == 2 ||
            state == 3 ||
            state == 6
          "
        >
          )
        </q-btn>
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
  isMatrix,
  solve,
  functions,
} from "src/model/calculator.js";
import Fraction from "src/model/Fraction.js";
import Matrix from "src/model/Matrix.js";
import { errorDialog } from "src/model/Utilities";

export default defineComponent({
  name: "Calculator",
  data() {
    return {
      operations: [],
      parenthesis: 0,
      theme: 0,
      qtyThemes: 2,
      result: "",
      displayResult: false,
      state: 0,
    };
  },
  computed: {
    text: function () {
      return this.operations.join("");
    },
    matrixes: function () {
      return this.$store.getters.matrixes;
    },
    ops: function () {
      return functions;
    },
    matAns: function () {
      return this.$store.getters.MatAns;
    },
    ans: function () {
      return this.$store.getters.Ans;
    },
  },
  methods: {
    appendChecks() {
      if (this.displayResult) {
        this.operations = [];
        this.displayResult = false;
      }
    },
    appendText(text) {
      this.appendChecks();
      let lastOperation = this.operations[this.operations.length - 1];
      if (!isNaN(text)) {
        if (this.state == 4) this.operations.push("*");
        this.state = 1;
        if (lastOperation && !isNaN(lastOperation) && lastOperation.length < 16)
          this.operations[this.operations.length - 1] = String(
            parseInt(lastOperation + text)
          );
        else this.operations.push(String(text));
      } else if (isMatrix(text, this)) {
        if (this.state == 1 || this.state == 5) return;
        this.operations.push(text);
        this.state = 5;
      } else if (text.includes("Ans")) {
        if (this.state == 1 || this.state == 5) return;
        this.operations.push(text);
        this.state = 5;
      } else if (isOperator(text)) {
        if (this.state == 3) this.operations[this.operations.length - 1] = text;
        else if (this.state != 0 && this.state != 2) {
          this.operations.push(text);
          this.state = 3;
        }
        if (text == "-" && this.state == 0) {
          this.state = 2;
          this.operations.push(text);
        }
      } else if (text == "(") {
        if (this.state == 1 || this.state == 4 || this.state == 5)
          this.operations.push("*");
        this.state = 0;
        this.parenthesis++;
        this.operations.push(text);
      } else if (text == ")") {
        this.state = 4;
        this.operations.push(text);
        this.parenthesis--;
      } else if (isFunction(text)) {
        if (this.state == 4 || this.state == 1) this.operations.push("*");
        this.state = 0;
        this.operations.push(text);
        this.operations.push("(");
        this.parenthesis++;
      }
    },
    backspace() {
      let removedOperation = this.operations.pop();
      let lastOperation = this.operations[this.operations.length - 1];
      // Condizione iniziale per numeri
      if (!isNaN(removedOperation)) {
        removedOperation = String(removedOperation);
        if (removedOperation.length > 1) {
          this.operations.push(
            removedOperation.substring(0, removedOperation.length - 1)
          );
          lastOperation = this.operations[this.operations.length - 1];
        }
      }
      if (removedOperation == "(") {
        this.parenthesis--;
      } else if (removedOperation == ")") {
        this.parenthesis++;
      }
      if (lastOperation == undefined) {
        this.state = 0;
        return;
      }
      if (!isNaN(lastOperation)) {
        this.state = 1;
      } else if (isOperator(lastOperation)) {
        this.state = 3;
        if (lastOperation == "-") {
          if (this.operations.length > 1) {
            if (this.operations[this.operations.length - 2] == "(") {
              this.state = 2;
            }
          } else this.state = 2;
        }
      } else if (
        lastOperation.includes("Ans") ||
        isMatrix(lastOperation, this)
      ) {
        this.state = 5;
      } else if (lastOperation == "(") {
        this.state = 0;
      } else if (lastOperation == ")") {
        this.state = 4;
      } else if (isFunction(lastOperation)) {
        this.state = 6;
      }
    },
    clear() {
      this.displayResult = false;
      this.operations = [];
      this.state = 0;
    },
    solve() {
      if (this.operations.length < 1) return;
      // Converto i numeri in frazioni
      let operations = [];
      for (let i = 0; i < this.operations.length; i++) {
        if (!isNaN(this.operations[i])) {
          operations.push(new Fraction(this.operations[i]));
        } else operations.push(this.operations[i]);
      }
      try {
        let result = solve(operations, this);
        if (result instanceof Matrix) {
          this.result = "MatAns";
          this.$store.commit("setMatAns", result);
        } else {
          this.result = result;
          this.$store.commit("setAns", result);
        }
        this.displayResult = true;
        this.state = 0;
      } catch (e) {
        if (typeof e == "string") errorDialog(this, e);
        else {
          errorDialog(this, "Errore mio, scusa non so programmare");
          console.error(e);
        }
      }
    },
    addMatrix() {
      this.$router.push({ name: "Aggiungi dim matrice" });
    },
    removeMatrix() {
      this.$router.push({ name: "Rimuovi matrice" });
    },
    toggleTheme() {
      this.theme = (this.theme + 1) % this.qtyThemes;
    },
    viewMat(matName) {
      this.$router.push({
        name: "Visualizza matrice",
        params: {
          name: matName,
          viewMat: true,
        },
      });
    },
  },
  mounted() {},
});
</script>

<style scoped>
/* Themes */
.bubah {
  background-image: url("src/assets/Bubah.jpeg");
  background-size: cover;
}
/* Display */
.display {
  border: 2px solid black;
  border-radius: 7px;
  height: 15vh;
  width: 80vw;
  cursor: default;
  outline-width: 0;
  font-size: min(5.5vw, 5.5vh);
}
.result {
  position: absolute;
  left: 1vw;
  bottom: 1vh;
  font-size: min(3vh, 3vw);
  cursor: default;
  color: rgba(128, 128, 128, 0.5);
}
.hide {
  display: none;
}
/* Tastierino */
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
