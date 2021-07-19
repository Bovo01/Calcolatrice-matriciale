<template>
  <div class="container">
    <!-- Dimensioni -->
    <q-input outlined v-model="rows" label="Righe" type="number" />
    <q-input outlined v-model="cols" label="Colonne" type="number" />
    <div class="row justify-center">
      <q-btn color="positive" class="confirm" @click="confirmDimensions()">
        Conferma
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { errorDialog } from "src/model/Utilities.js";

export default defineComponent({
  data() {
    return {
      rows: "",
      cols: "",
    };
  },
  methods: {
    confirmDimensions() {
      if (parseInt(this.rows) > 0 && parseInt(this.cols) > 0) {
        this.rows = parseInt(this.rows);
        this.cols = parseInt(this.cols);
        this.$router.push({
          name: "Aggiungi matrice righe",
          rows: this.rows,
          cols: this.cols,
        });
      } else
        errorDialog(this, "Righe e colonne devono essere numeri interi positivi");
    },
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
</style>
