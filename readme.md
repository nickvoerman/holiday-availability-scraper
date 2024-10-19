## Description

Holiday camping scraper is a Node.js application that monitors a specified webpage for availability. It uses Puppeteer to scrape the webpage, checks for specific titles, and sends email notifications when availability is detected.

## Features

- Scrapes a webpage for availability using Puppeteer.
- Checks for specific error messages (e.g., "Error 429: Too Many Requests").
- Sends email notifications using Nodemailer when availability is found.
- Runs checks at random intervals to avoid being blocked.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nickvoerman/holiday-availability-scraper.git
   cd holiday-availability-scraper
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure your email settings in `checkTitle.js`:

   - Update the `SMTP_CONFIG` object with your email credentials.
   - Add the email addresses to the `EMAIL_LIST` array.

4. Set the URL of the page you want to monitor:
   - Update the `URL` constant in `checkTitle.js` with the website URL you want to scrape.
   - Modify the query selectors in `checkTitle.js` to match the elements you want to check for availability.

## Usage

To start the application, run:

```bash
node checkTitle.js
```

The application will begin checking the specified webpage for availability and will log the results to the console. If availability is found, an email notification will be sent.

## Dependencies

- [Puppeteer](https://github.com/puppeteer/puppeteer): For web scraping.
- [Moment.js](https://momentjs.com/): For date and time formatting.
- [Nodemailer](https://nodemailer.com/): For sending emails.

## License

This project is licensed under the ISC License.
