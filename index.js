const http = require('http');
const url = require('url');
const fs = require('fs');


const overviewTemp = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const productTemp = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const cardTemp = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

function replaceTemplate(temp, i) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, i.productName);
    output = output.replace(/{%IMAGE%}/g, i.image);
    output = output.replace(/{%PRICE%}/g, i.price);
    output = output.replace(/{%FROM%}/g, i.from);
    output = output.replace(/{%NUTRIENTS%}/g, i.nutrients);
    output = output.replace(/{%QUANTITY%}/g, i.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, i.description);
    output = output.replace(/{%ID%}/g, i.id);

    if(!i.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}


const server = http.createServer((req, res) => {
    const {query, path} = url.parse(req.url, true);


    // Overview Page

    if(path === '/' || path === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map((i) => replaceTemplate(cardTemp, i)).join('');
        const output = overviewTemp.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }
    
    // Product Page

    else if(path === `/product?id=${query.id}`){
        res.writeHead(200, {'Content-type': 'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(productTemp, product);
        res.end(output);
    }
    
    // API

    else if(path === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }
    
    // Not Found Page

    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
});

server.listen(8000, () => {
    console.log('Listening at port: 8000....');
});

