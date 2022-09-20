const puppeteer = require('puppeteer');

(async () => {

  try {
    // Create an instance of the chrome browser
    // But disable headless mode !
    const browser = await puppeteer.launch({ headless: false });
    // Create a new page
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://randomtodolistgenerator.herokuapp.com/library');
    await page.screenshot({ path: 'example.png' });

    await page.waitForSelector('.card-body')

    const tasks = await page.evaluate(() => {
      const cards = document.querySelectorAll('.card-body')

      const elements = []

      for (let i = 0; i < 5; i++) {
        const task = {}
        task.title = cards[i].childNodes[0].childNodes[0].innerHTML
        task.description = cards[i].childNodes[1].innerHTML
        elements.push(task)
      }

      return elements
    })

    await page.goto('https://todoist.com/app');

    await page.waitForSelector('#element-0')
    await page.type('#element-0', 'hroberto.soporte@gmail.com')
    await page.waitForSelector('#element-3')
    await page.type('#element-3', 'todoisthrct')
    await page.waitForSelector('[data-gtm-id="start-email-login"]')
    await page.click('[data-gtm-id="start-email-login"]')
    await page.waitForNavigation();

    await page.waitForSelector('.plus_add_button')
    await page.waitForTimeout(2000)

    await page.waitForSelector('.plus_add_button')
    await page.click('.plus_add_button')

    let totalTasks = 0
    tasks.map(async (task, index) => {
      await page.waitForTimeout(3000 * index)

      await page.waitForSelector('div.DraftEditor-editorContainer > div > div > div > div > span')
      await page.type('div.DraftEditor-editorContainer > div > div > div > div > span', task.title)

      await page.waitForSelector('div.task_editor__input_fields > div > textarea')
      await page.type('div.task_editor__input_fields > div > textarea', task.description)

      await page.waitForSelector('[data-testid="task-editor-submit-button"]')
      await page.click('[data-testid="task-editor-submit-button"]')

      totalTasks += 1

      if (totalTasks == 5) {
        await browser.close();
      }

    });
  } catch (err) {
    console.error(`Error: ${err}`);
  }

})();