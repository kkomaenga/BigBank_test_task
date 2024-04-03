/* 
  Running the Automated Tests:

  1. Install Dependencies: Before running the tests, make sure to install the necessary dependencies by running:
     ```
     npm install
     ```

  2. Open Cypress Test Runner: To open the Cypress test runner, use the following command:
     ```
     npx cypress open
     ```
     This will open the Cypress UI, where you can select and run individual test cases or the entire test suite.

  3. Run Tests in Headless Mode: To run the tests in headless mode and generate a Mochawesome report, use the following command:
     ```
     npx cypress run
     ```
     This will run all the tests in the terminal without opening the Cypress UI and generate a Mochawesome HTML report in the `mochawesome-report` directory.

  4. View Test Report: After running the tests, you can view the Mochawesome HTML report by opening the `mochawesome-report/index.html` file in a web browser.
*/

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('https://taotlus.bigbank.ee/?amount=5000&interestRate=13.8&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS&bbmedium=small_loan&bbmedium=cpc&bbchannel=sem&bbsource=google&bbcampaign=brand22');
  });
  
  const LoanAmountField = () => cy.get('input[name="header-calculator-amount"]');
  const LoanPeriodField = () => cy.get('input[name="header-calculator-period"]');
  const MonthlyPayment = () => cy.get('.bb-labeled-value__value');
  const LoanAmountBadge = () => cy.get('.bb-edit-amount__amount'); 

  it('CM001-Loan Amount and Period Fields Display and Editability Verification', () => {
    
    checkCalculatorModalVisibility();
    
    // Verify that the loan amount field is displayed and editable
    LoanAmountField()
      .should('be.visible')
      .clear()
      .type('7200')
      .should('have.value', '7200');  
    
      // Verify that the loan period field is displayed and editable
    LoanPeriodField()
      .should('be.visible')
      .clear()
      .type('72')
      .should('have.value', '72');  
    // Click anywhere in the calculator window to apply the changes
    clickAnywhereInCalculatorWindow();
    // Verify that the new monthly payment is automatically calculated
    MonthlyPayment().should('contain', '€152.12');

  });
  
  it('CM002 - Loan Amount and Period Adjustment Verification', () => {
    checkCalculatorModalVisibility();
    
    const loanAmountSlider = '.bb-calculator__amount-slider';
    const loanPeriodSlider = '.bb-calculator__period-slider';

    // Verify that the loan amount slider is displayed and functional
    cy.get(loanAmountSlider).should('be.visible');

    // Verify that the loan period slider is displayed and functional
    cy.get(loanPeriodSlider).should('be.visible');

    const adjustSlider = (sliderSelector, value) => {
        cy.get(sliderSelector).then(($slider) => {
            const $input = $slider.find('input');

            cy.wrap($input).clear().type(value).trigger('change');
        });
    };

    // Adjust the loan amount slider to 7200
    adjustSlider(loanAmountSlider, '7200');

    // Adjust the loan period slider to 72 months
    adjustSlider(loanPeriodSlider, '72');

    // Click anywhere in the calculator window to apply the changes
    clickAnywhereInCalculatorWindow();

    // Verify that the new monthly payment is automatically calculated
    MonthlyPayment().should('contain', '€152.12'); 
  });

  it('CM003 - Validation of Calculation Accuracy', () => {
    checkCalculatorModalVisibility();
    
    // Verify default loan amount and period
    LoanAmountField().should('have.value', '5,000');
    LoanPeriodField().should('have.value', '60');

    // Calculate expected monthly payment and APRC
    const loanAmount = 5000; 
    const loanPeriod = 60; 
    const interestRate = 13.8; 

    // Monthly Payment Calculation
    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -loanPeriod));
    const monthlyPaymentFormatted = monthlyPayment.toFixed(2); // Format to two decimal places

    // Verify that the calculated monthly payment matches the displayed value
    MonthlyPayment().should('contain', monthlyPaymentFormatted);
  });

    //here
  it('CM004 - Verify Loan Amount Field Restrictions', () => {
    checkCalculatorModalVisibility();
    LoanAmountField()
      .click()
      .type('AbcDsa')
      .should('not.contain', 'AbcDsa')
      .type('!#%&/&(/)=-')
      .should('not.contain', '!#%&/&(/)=-');
    
    clickAnywhereInCalculatorWindow();
    LoanAmountField()  
      .clear()
      .type('AbcDsa')
      .should('not.contain', 'AbcDsa')
      .type('!#%&/&(/)=-')
      .should('not.contain', '!#%&/&(/)=-')
      .type('-10')
      .should('not.contain', '-10');

    clickAnywhereInCalculatorWindow();
    LoanAmountField().should('have.value', '500');
  });

  it('CM005 - Verify Loan Period Field Restrictions', () => {
    checkCalculatorModalVisibility();
    LoanPeriodField()
      .click()
      .type('AbcDsa')
      .should('not.contain', 'AbcDsa')
      .type('!#%&/&(/)=-')
      .should('not.contain', '!#%&/&(/)=-');
    
    clickAnywhereInCalculatorWindow();
    LoanPeriodField()  
      .clear()
      .type('AbcDsa')
      .should('not.contain', 'AbcDsa')
      .type('!#%&/&(/)=-')
      .should('not.contain', '!#%&/&(/)=-')
      .type('-10')
      .should('not.contain', '-10');

    clickAnywhereInCalculatorWindow();
    LoanPeriodField().should('have.value', '10')
  });

  it('CM006 - Verify Loan Amount Field Boundary Conditions', () => {
    checkCalculatorModalVisibility();
    //Attempt to enter a loan amount less than the minimum allowable amount
    LoanAmountField()
      .clear()
      .type('399')
      .should('not.contain', '399');
    
    clickAnywhereInCalculatorWindow();
    //Attempt to enter a loan amount greater than the maximum allowable amount
    LoanAmountField()
      .should('have.value', '500')
      .clear()
      .type('35000')
      .should('not.contain', '35000');
    clickAnywhereInCalculatorWindow();
    LoanAmountField()
      .should('have.value', '30,000')
      .clear()
      .type('5000'); //Verify if the system accepts the input within allowable range

    clickAnywhereInCalculatorWindow();
    LoanAmountField().should('have.value', '5,000')
  });

  it('CM007 - Verify Loan Period Field Boundary Conditions', () => {
    checkCalculatorModalVisibility();
    //Attempt to enter a loan period less than the minimum allowable period 
    LoanPeriodField()
      .clear()
      .type('5')
      .should('not.contain', '5');
    
    clickAnywhereInCalculatorWindow();
    //Attempt to enter a loan period greater than the maximum allowable period
    LoanPeriodField()
      .should('have.value', '6')
      .clear()
      .type('121')
      .should('not.contain', '121');
    
    clickAnywhereInCalculatorWindow();
    LoanPeriodField()
      .should('have.value', '120')
      .clear()
      .type('60'); //Verify if the system accepts the input within allowable range

    clickAnywhereInCalculatorWindow();
    LoanPeriodField().should('have.value', '60')
  });

  it('CM008 - Verify Saving Changes in Loan Calculator', () => {
    checkCalculatorModalVisibility();
    LoanAmountField()
      .clear()
      .type('8000');

    LoanPeriodField()
      .clear()
      .type('82');

    clickAnywhereInCalculatorWindow();
    //Verify if the changes are reflected in the calculator interface immediately without saving
    LoanAmountField().should('have.value', '8,000');
    LoanPeriodField().should('have.value', '82');

    clickSaveButton();
    LoanAmountBadge()
      .should('contain', '8000')
      .click(); 
    checkCalculatorModalVisibility();
    
    //Check if the previously saved loan parameters are still retained.
    LoanAmountField().should('have.value', '8,000');
    LoanPeriodField().should('have.value', '82')
  });

  it('CM009 - Verify Loan Period Field Boundary Conditions', () => {
    checkCalculatorModalVisibility();
    LoanAmountField()
      .clear()
      .type('8000');

    LoanPeriodField()
      .clear()
      .type('82');

    clickAnywhereInCalculatorWindow();
    //Verify if the changes are reflected in the calculator interface immediately without saving
    LoanAmountField().should('have.value', '8,000');
    LoanPeriodField().should('have.value', '82');

    clickCloseButton();
    //Check that changes are not visible on the upper right corner of the page
    LoanAmountBadge()
      .should('contain', '5000')
      .click(); 
    checkCalculatorModalVisibility();
    
    //Check if the changes made previously are discarded and the initial loan parameters are restored
    LoanAmountField().should('have.value', '5,000');
    LoanPeriodField().should('have.value', '60')
  });
  
});

function clickAnywhereInCalculatorWindow() {
  cy.get('.bb-labeled-value__label').click();
}

function checkCalculatorModalVisibility() {
  cy.get('.bb-modal__body').should('be.visible');
}

function clickSaveButton() {
  cy.contains('JÄTKA').click();
}

function clickCloseButton() {
  cy.get('button.bb-modal__close').click();
}
