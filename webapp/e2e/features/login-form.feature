Feature: User login

Scenario: The user is registered in the site
  Given An registered user
  When I fill the data in the form and press submit
  Then A confirmation message should be shown in the screen