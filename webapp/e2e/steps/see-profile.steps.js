const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/see-profile.feature');

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
      .goto('http://localhost:3000/login', {
        waitUntil: 'networkidle0',
      })
      .catch(() => {});
  });

  test('The user is logged in', ({ given, when, then }) => {
    let username;
    let password;

    given('A logged user', async () => {
      username = 'testuser';
      password = 'testuserpassword';
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'submit' });
    });

    then('I press profile', async () => {
      await expect(page).toClick('a.nav-link', { text: 'profile' });
    });
    then('The profile of the user should be shown in the screen', async () => {
      await expect(page).toMatchElement('*', {
        text: 'profile',
      });
    });
  });

  afterAll(async () => {
    browser.close();
  });
});
