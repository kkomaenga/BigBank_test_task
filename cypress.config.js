const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/e2e/test.cy.js', 
  },
  component: {
    setupNodeEvents(on, config) {
    },
  },
  reporter: "mochawesome",
  reporterOptions: {
   
    reportFilename: "mochawesome-report",
  },
});

