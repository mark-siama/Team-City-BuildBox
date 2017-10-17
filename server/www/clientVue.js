const app = new Vue({
  el: "#app",
  data: {
    relayState: "",
    buildState: [],
    connectionState: [],
    isActive: false,
    dateTimeOfCheck: ''
  },
  created: function() {
    webSocket.on('relay state', (state) => {
      this.isActive = this.relayState === "on" ? true : false;
    });

    webSocket.on('build array', (buildArray) => {
      this.buildState = buildArray[0];
      this.connectionState = buildArray[1];
      this.dateTimeOfCheck = new Date(Date.now()).toLocaleString();
    });
  },
  methods: {

  }
});
