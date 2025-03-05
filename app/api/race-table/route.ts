import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import { decode } from 'iconv-lite';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raceId = searchParams.get('raceId');

  if (!raceId) {
    return NextResponse.json({ error: 'Missing raceId' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://race.netkeiba.com/race/shutuba.html?race_id=${raceId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const html = decode(Buffer.from(buffer), 'euc-jp');
    const $ = load(html);
    const rawTable = $('table').first();

    const headers = rawTable.find('th').map((_, th) => $(th).text().trim()).get();
    const table = rawTable.find('tr').slice(1).toArray().map(tr => {
      const cells = $(tr).find('td').toArray().map(td => $(td).text().trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = cells[index] || '';
        return obj;
      }, {} as Record<string, string>);
    });

    return NextResponse.json({ data: table });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// import { load } from 'cheerio';
// import { decode } from 'iconv-lite'
// // import puppeteer from 'puppeteer'

// export async function getRaceTableById (raceId: string) {
//   console.log('+++++++++++++', raceId);
//   const response = await fetch(`https://race.netkeiba.com/race/shutuba.html?race_id=${raceId}`);
//   const buffer = await response.arrayBuffer();
//   const html = decode(Buffer.from(buffer), 'euc-jp')
//   const $ = load(html)
//   const rawTable = $('table').first();
  
//   // Extract headers
//   const headers: string[] = rawTable.find('th').map((_, th) => $(th).text().trim()).get();
  
//   // Extract rows
//   const table = rawTable.find('tr').slice(1).toArray().map(tr => {
//     const cells = $(tr).find('td').toArray().map(td => $(td).text().trim());
//     const rowObject: { [key: string]: string } = {};
//     headers.forEach((header, index) => {
//       rowObject[header] = cells[index] || '';
//     });
//     return rowObject;
//   });

//   console.log(table, 'from server');
//   return table;
// }


// /* playwrightじゃないと無理かもな */
// // async function getRaceTableFromJra() {
// //   const browser = await puppeteer.launch();
// //   const page = await browser.newPage();
  
// //   // 指定されたURLにアクセス
// //   await page.goto(`https://www.jra.go.jp/JRADB/accessS.html?CNAME=${cname}`, { waitUntil: 'networkidle2' });

// //   // 仮想的にクリックする例
// //   // 例えば、特定のボタンをクリックする場合
// //   // await page.click('button#yourButtonId');

// //   // ページのHTMLを取得
// //   const html = await page.content();

// //   // Cheerioを使ってHTMLを解析
// //   const $ = load(html);
// //   const rawTable = $('table').first();
  
// //   // ヘッダーを抽出
// //   const headers = rawTable.find('th').map((i, th) => $(th).text().trim()).get();
  
// //   // 行を抽出
// //   const table = rawTable.find('tr').slice(1).map((_, tr) => {
// //     const cells = $(tr).find('td').map((_, td) => $(td).text().trim()).get();
// //     const rowObject = {};
// //     headers.forEach((header, index) => {
// //       rowObject[header] = cells[index] || '';
// //     });
// //     return rowObject;
// //   }).get();

// //   console.log(table, 'from server');

// //   await browser.close();
// //   return table;
// // }

// // // 使用例
// // getRaceResultFromJraByCname('exampleCname');