const puppeteer = require('puppeteer');
const moment = require('moment');
const nodemailer = require('nodemailer');

const URL = 'urlofpagewhereyoucanfindavailability';
const EMAIL_LIST = [''];
const SMTP_CONFIG = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: ""
    }
};

const checkTitleExists = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await setupPage(page);

    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await closePopup(page);

    const error429 = await checkForError429(page);
    const titleExists = await checkForTitle(page);
    const currentDateTime = moment().format('DD-MM-YYYY HH:mm:ss');

    if (error429) {
        handleError429(currentDateTime, browser);
    } else if (titleExists) {
        console.log('Title exists on the page. ', currentDateTime);
        await browser.close();
    } else {
        console.log('Availability found on the website!! ', currentDateTime);
        await page.screenshot({ path: `screenshots/${Date.now()}.png` });
        await sendEmail();
        await browser.close();
    }
};

const setupPage = async (page) => {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1800, height: 768 });
};

const closePopup = async (page) => {
    const closeButton = await page.$('.popup-legal .popup-close');
    if (closeButton) {
        await closeButton.click();
    }
};

const checkForError429 = async (page) => {
    return await page.evaluate(() => {
        const errorElement = document.querySelector('body .wrapper .content');
        return errorElement && errorElement.textContent.includes('Errore 429 Too Many Requests!');
    });
};

const checkForTitle = async (page) => {
    return await page.evaluate(() => {
        const titleElement = document.querySelector('.noavail-head h2.content-title');
        return titleElement && titleElement.textContent.includes('In de gezochte tijdsperiode zijn er geen te reserveren oplossingen!');
    });
};

const handleError429 = async (currentDateTime, browser) => {
    console.log('Error 429: Too Many Requests detected. Stopping the script.', currentDateTime);
    await browser.close();
    process.exit(0);
};

const sendEmail = async () => {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    try {
        await transporter.sendMail({
            from: "",
            to: EMAIL_LIST,
            subject: `HOLIDAY ALERT: availability found on the website!`,
            html: `<p>Availability found on the website</p></br> Check here: <a href="${URL}">${URL}</a>`,
        });
        console.log("Email sent successfully.");
    } catch (error) {
        console.log("Email failed to send: ", error);
    }
};

const startCheck = async () => {
    console.log('Checking the page for the title...');
    await checkTitleExists();
    const randomDelay = Math.floor(Math.random() * 5 + 8);
    setTimeout(startCheck, randomDelay * 60 * 1000);
};

// Run the check immediately and schedule future checks with random intervals
startCheck();
