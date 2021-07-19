const errorDialog = function (self, message) {
  self.$q.notify({
    message,
    position: "top",
    type: "negative",
  });
}

const successDialog = function (self, message) {
  self.$q.notify({
    message,
    position: "top",
    type: "positive",
  });
}


export {
  errorDialog,
  successDialog
};
