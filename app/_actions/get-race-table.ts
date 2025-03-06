'use server'

import { load } from 'cheerio';
import { decode } from 'iconv-lite'
// import puppeteer from 'puppeteer'

type raceTable = { [key: string]: string; }

export async function getRaceTableById(_prevState: raceTable[], formData: FormData) {
  const raceId = formData.get('raceId') as string;
  const response = await fetch(`https://race.netkeiba.com/race/shutuba.html?race_id=${raceId}`);
  const buffer = await response.arrayBuffer();
  const html = decode(Buffer.from(buffer), 'euc-jp')
  const $ = load(html)
  const rawTable = $('table').first();

  const excludedKeys = new Set(['お気に入り馬', 'マスターレース別馬メモ切替', 'グループ', '印', '登録', '馬メモ切替', '更新']);
  // Extract headers
  const headers: string[] = rawTable.find('th')
    .map((_, th) => $(th).text().trim())
    .get();

  // Extract rows
  const table = rawTable.find('tr').slice(2).toArray().map(tr => {
    const cells = $(tr).find('td').toArray().map(td => $(td).text().trim());
    const rowObject: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      if (!excludedKeys.has(header)) {
        rowObject[header] = cells[index] || '';
      }
    });
    return rowObject;
  });


  return table;
}

