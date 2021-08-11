<template>
  <div class="container">
    <q-select
      outlined
      label="Seleziona le matrici da eliminare"
      v-model="selected"
      use-chips
      multiple
      input-debounce="0"
      :options="matrixesNames"
    />
    <div class="row justify-center">
      <q-btn color="negative" class="buttons" @click="back()">Annulla</q-btn>
      <q-btn color="positive" class="buttons" @click="confirm()">
        Conferma
      </q-btn>
    </div>
    <!-- Modal nascosto -->
    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Sei sicuro di voler eliminare queste matrici (
            <span v-for="(matName, index) in selected" :key="index">
              <b>{{ matName }}</b
              >{{ index == selected.length - 1 ? "" : ", " }}
            </span>
            )?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annulla" color="primary" v-close-popup />
          <q-btn
            flat
            label="Elimina le matrici"
            color="primary"
            v-close-popup
            @click="remove()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { ref } from "vue";
import { errorDialog, successDialog } from "src/model/Utilities.js";

export default defineComponent({
  data() {
    return {
      selected: [],
      dialog: ref(false),
    };
  },
  computed: {
    matrixesNames: function () {
      let names = [];
      for (let mat of this.$store.getters.matrixes) {
        names.push(mat.name);
      }
      return names;
    },
  },
  methods: {
    back() {
      this.$router.push({ name: "calculator" });
    },
    confirm() {
      if (this.selected.length <= 0) {
        errorDialog(this, "Seleziona almeno una matrice da eliminare");
        return;
      }
      this.dialog = true;
    },
    remove() {
      this.$store.commit("removeMatrixesFromName", this.selected);
      this.$router.push({ name: "calculator" });
      successDialog(
        this,
        `Matrici '${this.selected.join(",")}' eliminate correttamente`
      );
    },
  },
});
</script>

<style scoped>
.buttons {
  margin-top: 5vh;
  margin-right: 5vw;
}
.buttons:last-child {
  margin-right: 0;
}
</style>
