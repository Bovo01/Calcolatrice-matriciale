<template>
  <div class="container">
    <!-- Display -->
    <div class="row">
      <input class="display" v-model="text" readonly />
    </div>
    <!-- Bottoni -->
    <div>
      <div class="row no-wrap">
        <q-btn @click="backspace()" icon="fas fa-backspace" />
      </div>
      <!-- Prima riga (vars,ops,view mat,/) -->
      <div class="row no-wrap">
        <q-btn>VARS</q-btn>
        <q-btn>OPS</q-btn>
        <q-btn>VIEW MAT</q-btn>
        <q-btn @click="appendText('/')" icon="fas fa-divide" />
      </div>
      <!-- Seconda riga (7,8,9,*) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(7)">7</q-btn>
        <q-btn @click="appendText(8)">8</q-btn>
        <q-btn @click="appendText(9)">9</q-btn>
        <q-btn @click="appendText('*')" icon="fas fa-times" />
      </div>
      <!-- Terza riga (4,5,6,-) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(4)">4</q-btn>
        <q-btn @click="appendText(5)">5</q-btn>
        <q-btn @click="appendText(6)">6</q-btn>
        <q-btn @click="appendText('-')" icon="fas fa-minus" />
      </div>
      <!-- Quarta riga (1,2,3,+) -->
      <div class="row no-wrap">
        <q-btn @click="appendText(1)">1</q-btn>
        <q-btn @click="appendText(2)">2</q-btn>
        <q-btn @click="appendText(3)">3</q-btn>
        <q-btn @click="appendText('+')" icon="fas fa-plus" />
      </div>
      <!-- Quinta riga (c,0,<=,=) -->
      <div class="row no-wrap">
        <q-btn @click="clear()" icon="fas fa-trash" />
        <q-btn @click="appendText(0)">0</q-btn>
        <q-btn @click="backspace()" icon="fas fa-backspace" />
        <q-btn @click="solve()" icon="fas fa-equals" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { toRPN } from "src/model/calculator.js";

export default defineComponent({
  name: "Calculator",
  data() {
    return {
      operations: [],
    };
  },
  computed: {
    text: function () {
      return this.operations.join("");
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
      } else this.operations.push(text);
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
      console.log(toRPN(this.operations));
    },
  },
});
</script>

<style scoped>
.container {
  margin-top: 5vh;
  margin-left: 10vw;
  margin-right: 10vw;
  margin-bottom: 10vh;
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
  height: 11vh;
  width: 17vw;
  margin-right: 4vw;
  font-weight: bold;
  font-size: min(4vw, 4vh);
}
.row .q-btn:last-child {
  margin-right: 0vw;
}
</style>
