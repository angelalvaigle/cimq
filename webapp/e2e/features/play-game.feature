Feature: User plays game

Scenario: The user is logged in
  Given a logged user
  When I press play
  Then A question should be shown in the screen