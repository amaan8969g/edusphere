const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
