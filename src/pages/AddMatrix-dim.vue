<template>
  <div class="container">
    <!-- Dimensioni -->
    <q-input outlined v-model="rows" label="Righe" type="number" />
    <q-input outlined v-model="cols" label="Colonne" type="number" />
    <q-input outlined v-model="name" label="Nome matrice" type="text" />
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
import { isFunction, isOperator } from "src/model/calculator.js";

export default defineComponent({
  data() {
    return {
      rows: "",
      cols: "",
      name: "",
    };
  },
  methods: {
    confirmDimensions() {
      if (
        !this.rows ||
        !this.cols ||
        parseInt(this.rows) <= 0 ||
        parseInt(this.cols) <= 0
      ) {
        errorDialog(
          this,
          "Righe e colonne devono essere numeri interi positivi"
        );
        return;
      }
      if (this.name == "") {
        errorDialog(this, "Devi inserire il nome della matrice");
        return;
      }
      if (
        this.$store.getters.matrixes.filter((mat) => mat.name == this.name)
          .length > 0
      ) {
        errorDialog(this, "Il nome della matrice è già salvato in memoria");
        return;
      }
      if (isFunction(this.name)) {
        errorDialog(
          this,
          "Il nome della matrice non può corrispondere con una funzione"
        );
        return;
      }
      if (isOperator(this.name)) {
        errorDialog(
          this,
          "Il nome della matrice non può corrispondere con un operatore"
        );
        return;
      }
      this.rows = parseInt(this.rows);
      this.cols = parseInt(this.cols);
      this.$router.push({
        name: "Aggiungi matrice righe",
        params: {
          rows: parseInt(this.rows),
          cols: parseInt(this.cols),
          name: this.name,
        },
      });
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
