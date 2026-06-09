const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const urls = [
  '',
  '/pricing',
  '/k-12-online-tutoring',
  '/ib-online-tutoring',
  '/a-level-online-tutoring',
  '/gcse-online-tutoring',
  '/igcse-online-tutoring',
  '/singapore-jc-guide',
  '/subjects',
  '/about',
  '/contact',
  '/search',
  '/careers',
  '/us/sat-prep',
  '/us/act-prep',
  '/us/ap-tutoring',
  '/us/american-curriculum',
  '/australia',
  '/singapore',
  '/uae',
  '/uae/physics-maths-tutor',
  '/uae/online-tutors-abu-dhabi',
  '/uae/moe-uae-curriculum-tutors',
  '/uae/online-tutors-dubai',
  '/saudi/saudi-ministry-curriculum-tutors',
  '/saudi/online-tutors-riyadh',
  '/online-tutoring-uk'
];

const targetHost = 'http://localhost:3000';

console.log('Starting automated Lighthouse audit for all landing pages...');
console.log(`Auditing against local host: ${targetHost}\n`);

let reportMarkdown = `# Lighthouse Performance Audit Report\n\n`;
reportMarkdown += `*Audited on: ${new Date().toLocaleString()}*\n\n`;
reportMarkdown += `| Page Path | Performance Score | Status |\n`;
reportMarkdown += `| :--- | :---: | :--- |\n`;

for (const route of urls) {
  const pathLabel = route === '' ? '/' : route;
  const fullUrl = `${targetHost}${route}`;
  console.log(`Auditing ${pathLabel}...`);
  try {
    // Run mobile Lighthouse audit by default
    const cmd = `npx lighthouse ${fullUrl} --chrome-flags="--headless" --only-categories=performance --output=json --quiet`;
    const resultJson = execSync(cmd, { maxBuffer: 10 * 1024 * 1024 }).toString();
    const result = JSON.parse(resultJson);
    const score = Math.round(result.categories.performance.score * 100);
    
    let status = '🟢 Good (>= 90)';
    if (score < 50) {
      status = '🔴 Poor (< 50)';
    } else if (score < 90) {
      status = '🟡 Needs Improvement (50-89)';
    }
    
    reportMarkdown += `| \`${pathLabel}\` | **${score}** | ${status} |\n`;
    console.log(`  Score: ${score} - ${status}`);
  } catch (error) {
    reportMarkdown += `| \`${pathLabel}\` | *Failed* | ❌ Audit Error |\n`;
    console.error(`  Failed to audit ${pathLabel}:`, error.message);
  }
}

const reportPath = path.join(__dirname, '../lighthouse_report.md');
fs.writeFileSync(reportPath, reportMarkdown);
console.log(`\nLighthouse audit complete! Report saved to ${reportPath}`);
