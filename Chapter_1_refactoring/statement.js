var fs = require('fs');
var invoice = JSON.parse(fs.readFileSync('Chapter_1_refactoring/invoices.json', 'utf8'))[0];
var plays = JSON.parse(fs.readFileSync('Chapter_1_refactoring/plays.json', 'utf8'));


function statement(invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, invoice, plays);

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }



    function renderPlainText(data) {
        let result = `Statement for ${data.customer}\n`;

        for (let perf of data.performances) {
            //print the line for this order
            result += `  ${perf.play.name} : ${usd(amountFor(perf) / 100)} (${perf.audience} seats) \n`;
        }

        result += `Amount owed is ${usd(totalAmount() / 100)} \n`;
        result += ` You earned ${totalVolumeCredits()} credits \n`;
        return result;

        function usd(aNumber) {
            return new Intl.NumberFormat("en-US", {
                style: "currency", currency: "USD", minimumFractionDigits: 2
            }).format(aNumber / 100);
        }
    
    
        function totalVolumeCredits() {
            let result = 0;
            for (let perf of data.performances) {
                result += volumeCreditsFor(perf);
            }
            return result;
        }
    
        function volumeCreditsFor(aPerformance) {
            let result = Math.max(aPerformance.audience - 30, 0);;
            if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    
            return result;
        }
    
        function totalAmount() {
            let result = 0;
            for (let perf of data.performances) {
                result += amountFor(perf);
            }
            return result;
        }
    
        function amountFor(aPerformance) {
            let result = 0;
            switch (aPerformance.play.type) {
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
                    throw new Error(`Unknown type : ${aPerformance.play.type}`);
            }
            return result;
        }

    }

   

}


console.log(statement(invoice, plays));

