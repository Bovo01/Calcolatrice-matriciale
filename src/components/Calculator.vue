<template>
  <div class="container">
    <!-- Display -->
    <span class="row header"></span>
    <!-- Bottoni -->
    <div>
      <!-- Prima riga (vars,ops,view mat,/) -->
      <div class="row no-wrap">
        <q-btn>VARS</q-btn>
        <q-btn>OPS</q-btn>
        <q-btn>VIEW MAT</q-btn>
        <q-btn icon="fas fa-divide" />
      </div>
      <!-- Seconda riga (7,8,9,*) -->
      <div class="row no-wrap">
        <q-btn>7</q-btn>
        <q-btn>8</q-btn>
        <q-btn>9</q-btn>
        <q-btn icon="fas fa-times" />
      </div>
      <!-- Terza riga (4,5,6,-) -->
      <div class="row no-wrap">
        <q-btn>4</q-btn>
        <q-btn>5</q-btn>
        <q-btn>6</q-btn>
        <q-btn icon="fas fa-minus" />
      </div>
      <!-- Quarta riga (1,2,3,+) -->
      <div class="row no-wrap">
        <q-btn>1</q-btn>
        <q-btn>2</q-btn>
        <q-btn>3</q-btn>
        <q-btn icon="fas fa-plus" />
      </div>
      <!-- Quinta riga (c,0,<=,=) -->
      <div class="row no-wrap">
        <q-btn icon="fas fa-trash" />
        <q-btn>0</q-btn>
        <q-btn icon="fas fa-backspace" />
        <q-btn icon="fas fa-equals" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Calculator",
});
</script>

<style scoped>
.container {
  margin-top: 5vh;
  margin-left: 10vw;
  margin-right: 10vw;
  margin-bottom: 10vh;
}
.header {
  border: 2px solid black;
  border-radius: 7px;
  height: 15vh;
}
.row {
  margin-top: 3vh;
}
.row .q-btn {
  height: 11vh;
  width: 17vw;
  margin-right: 4vw;
  font-weight: bold;
  font-size: 4vw;
}
.row .q-btn:last-child {
  margin-right: 0vw;
}
</style>