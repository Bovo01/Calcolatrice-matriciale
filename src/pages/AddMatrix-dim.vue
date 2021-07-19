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
      if (parseInt(this.rows) > 0 && parseInt(this.cols) > 0) {
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
      } else
        errorDialog(
          this,
          "Righe e colonne devono essere numeri interi positivi"
        );
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
