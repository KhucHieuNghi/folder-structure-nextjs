/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const util = require('util');

const exec = util.promisify(require('child_process').exec);
const parse = util.promisify(require('csv-parse'));

const LOCALES = {
  VN: 'vi-VN',
  EN: 'en-US',
};

const languages = Object.keys(LOCALES);

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/';

const params = {
  format: 'csv',
  gid: 1438841273,
};

const sp = new URLSearchParams(Object.entries(params));

const convertBrackets = (str) => str.replace(/\{/g, '{{').replace(/\}/g, '}}');

(async () => {
  const { stdout: csvContent } = await exec(
    `curl -L '${ SPREADSHEET_URL }/export?${ sp }'`,
  );

  const rows = await parse(csvContent, { columns: true });

  for (const lng of languages) {
    const values = {};
    for (const row of rows) {
      if (row[ lng ]) {values[ row.Key ] = convertBrackets(row[ lng ]);}
    }
    await fs.writeFile(
      path.resolve(__dirname, '../src/locales', 'vi.json'),
      JSON.stringify(values, null, 2),
    );
  }
})();
