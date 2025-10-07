Feature: User see his profile

Scenario: The user is logged in
  Given a logged user
  When I press profile
  Then The profile of the user should be shown in the screen