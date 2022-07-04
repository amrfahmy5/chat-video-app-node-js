module.exports = (edge) => ({
  toShortDate: (date__) => {
    if (date__ && date__ != "" && date__ != "0000-00-00") {
      return new Date(date__).toLocaleDateString("en-US");
    }
    return "";
  },
  toTime: (time) => {
      return `${new Date(time).getHours()}:${new Date(time).getMinutes()}`
  },
  init() {
    edge.global("toShortDate", this.toShortDate);
    edge.global("toTime", this.toTime);

  },
});
