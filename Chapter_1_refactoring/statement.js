var fs = require('fs');



function usd(aNumber){
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber/100);
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function totalVolumeCredits(){
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
   return result;
}

function volumeCreditsFor(aPerformance) {
    let result = Math.max(aPerformance.audience - 30, 0);;
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

    return result;
}

function totalAmount(){
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf);
    }
    return result;
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;

        default:
            throw new Error(`Unknown type : ${playFor(aPerformance).type}`);
    }
    return result;
}

function statement(invoice) {
    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        //print the line for this order
        result += `  ${playFor(perf).name} : ${usd(amountFor(perf) / 100)} (${perf.audience} seats) \n`;
    }

    result += `Amount owed is ${usd(totalAmount() / 100)} \n`;
    result += ` You earned ${totalVolumeCredits()} credits \n`;
    return result;
}

var invoice = JSON.parse(fs.readFileSync('Chapter_1_refactoring/invoices.json', 'utf8'))[0];
var plays = JSON.parse(fs.readFileSync('Chapter_1_refactoring/plays.json', 'utf8'));

console.log(statement(invoice, plays));

