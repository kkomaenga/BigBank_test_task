**Automated Tests**

Running the Automated Tests
Install Dependencies: Before running the tests, make sure to install the necessary dependencies by running:

```npm install```

Open Cypress Test Runner: To open the Cypress test runner, use the following command:


```npx cypress open```

This will open the Cypress UI, where you can select and run individual test cases or the entire test suite.

Run Tests in Headless Mode: To run the tests in headless mode and generate a Mochawesome report, use the following command:


```npx cypress run```

This will run all the tests in the terminal without opening the Cypress UI and generate a Mochawesome HTML report in the mochawesome-report directory.

View Test Report: After running the tests, you can view the Mochawesome HTML report by opening the mochawesome-report/index.html file in a web browser.
