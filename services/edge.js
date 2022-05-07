module.exports = (edge) => ({
  toShortDate: (date__) => {
    if (date__ && date__ != "" && date__ != "0000-00-00") {
      return new Date(date__).toLocaleDateString("en-US");
    }
    return "";
  },
  init() {
    edge.global("toShortDate", this.toShortDate);
  },
});
