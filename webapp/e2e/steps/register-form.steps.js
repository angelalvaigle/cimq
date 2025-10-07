const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox'],
        })
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto('http://localhost:3000', {
        waitUntil: 'networkidle0',
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({ given, when, then }) => {
    let name;
    let lastName;
    let email;
    let username;
    let password;

    given('An unregistered user', async () => {
      name = 'test';
      lastName = 'user';
      email = 'user@fakemail.com';
      username = 'testuser';
      password = 'testuserpassword';
      await expect(page).toClick('a.register-link', { text: 'Register' });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="name"]', name);
      await expect(page).toFill('input[name="lastName"]', lastName);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'submit' });
    });

    then('A confirmation message should be shown in the screen', async () => {
      await expect(page).toMatchElement('*', {
        text: 'User added successfully',
      });
    });
  });

  afterAll(async () => {
    browser.close();
  });
});
