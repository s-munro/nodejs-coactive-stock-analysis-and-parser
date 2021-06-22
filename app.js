'use strict';

const fs = require('fs');
const open = require('open');

// re: What day was there the largest variance between the high and low?
let highestVariance = 0;
let highestVarianceDate;

// re: What was the average volume for the month of July 2012?
let julyCount = 0;
let julyTotal = 0;

// re: Max profit potential per share, and what days needed to buy low and sell high to get max profit
let maxProfit;
let potentialSell;
let potentialSellDate;
let buy;
let sell;
let buyDate;
let sellDate;




const parseFile = (file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) { throw err; };

    const dataArray = data.split("\r\n");
    dataArray.map((item, index) => {
      if (index !== 0) {
        const [parsedRow, parsedDate] = parseRowValues(item);

        assessVariance(parsedRow[2], parsedRow[3], parsedRow[0]);
        calculateJulyVolume(parsedRow[5], parsedDate[1], parsedDate[2]);
        assessBuyAndSellDates(parseFloat(parsedRow[2]), parseFloat(parsedRow[3]), parseFloat(parsedRow[1]), parseFloat(parsedRow[4]), parsedRow[0]);
      }
    });

    fs.writeFile(
      `${file}_analyzed.txt`,
      `
        July average: ${julyTotal / julyCount}.  
        Highest variance: ${highestVariance}, date: ${highestVarianceDate}.
        Max share profit: ${maxProfit}, buy date: ${buyDate} for ${buy}, sell date: ${sellDate} for ${sell}
      `, (err) => {
      if (err) throw err;
    });
    open(`${file}_analyzed.txt`);
  });

  const parseRowValues = (item) => {
    const splitRow = item.split('\t'); /*  format: ['18-Jun-12', '133.59', '134.73', '133.28', '134.43', '29353246' ] */
    const date = splitRow[0];
    const splitDate = date.split('-'); /* e.g. format: [13, aug, 12] */

    return [splitRow, splitDate];
  };

  // re: "What day was there the largest variance btw/ high and low?"
  const assessVariance = (floatOne, floatTwo, date) => {
    const variance = Math.abs(parseFloat(floatOne) - parseFloat(floatTwo));

    if (variance > highestVariance) {
      highestVariance = variance;
      highestVarianceDate = date;
    };
  };

  // re: What was the average volume for the month of July 2012?
  const calculateJulyVolume = (volume, month, year) => {
    if (month === "Jul" && year === "12") {
      julyTotal += parseInt(volume);
      julyCount += 1;
    }
  };

  const assessBuyAndSellDates = (high, low, open, close, date) => {
    if (!buy && !sell) {
      // The difference between low and close should never be _greater_ than 0 -- low should always be less than or equal to close, so we can initialize our values this way
      buy = low;
      buyDate = date;
      sell = close;
      sellDate = date;

    } else {
      // since we move in descending order by date, we check if the current date has a lower buy, and we know we can easily adjust our buy date accordingly
      if (low < buy) {
        buy = low;
        buyDate = date;
        maxProfit = sell - buy;
      };
      // if potential sell - daily low > maxProfit, we can set our sell to the potential sell and change our buy to the daily low
      if (potentialSell - low > maxProfit) {
        buy = low;
        buyDate = date;
        sell = potentialSell;
        sellDate = potentialSellDate;
        maxProfit = potentialSell - buy;
      };
      // since we move in descending by date, we have to set a higher sell to "potential sell" until we find an earlier "buy" date, unless the higher sell is close.
      if (high > sell || close > sell) {
        if (high > sell) {
          potentialSell = high;
          potentialSellDate = date;
        } else {
          sell = close;
          sellDate = date;
          maxProfit = sell - buy;
        };
      };
    };

  };
};

const argArray = process.argv.slice(2);
const arg = argArray[0];
parseFile(arg);