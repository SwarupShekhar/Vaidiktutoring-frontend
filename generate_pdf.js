const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Get absolute path
  const filePath = path.resolve(__dirname, 'public/Edexcel-A-Level-Pure1-2026-Worked-Solutions.html');
  const url = `file://${filePath}`;
  
  console.log(`Loading ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  const pdfPath = path.resolve(__dirname, 'public/Edexcel-A-Level-Pure1-2026-Worked-Solutions.pdf');
  console.log(`Generating PDF at ${pdfPath}...`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px'
    }
  });

  console.log('PDF generated successfully!');
  await browser.close();
})();
