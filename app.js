'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {

    // 配列に格納
    const columns = lineString.split(',');

    // 年を取得
    const year = parseInt(columns[0]);

    // 都道府県を取得
    const prefecture = columns[2];

    // 人口を取得
    const popu = parseInt(columns[7]);

    if(year === 2010 || year === 2015){

        let value = map.get(prefecture);

        // valueがfalseの場合初期値を設定
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }

        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }

        // 都道府県をkeyに、valueオブジェクトをvalueに設定
        map.set(prefecture, value);
    }
});

rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
