const errorDialog = function (self, message) {
  self.$q.notify({
    message,
    position: "top",
    type: "negative",
  });
}


export {
  errorDialog
};
