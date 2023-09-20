process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const Fs = require('fs');
const Axios = require('axios');
const csvtojson = require('csvtojson');
const https = require('https');

const csvPath = './csv/TB_COD_PAT.csv';
console.log(csvPath);

async function downloadImage () {
  const url = 'https://sgo.dnit.gov.br/sgo/anexo/arquivoanexo?id=';
  const json = await csvtojson().fromFile(csvPath).then((jsonObj) => {
    return jsonObj;
  });
  
  json.forEach(async (element) => {
    const response = await Axios({
      method: 'GET',
      url: `${url}${element.cod_foto}`,
      responseType: 'stream',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
    });

    response.data.pipe(Fs.createWriteStream(`./images/${element.CO_PATOLOGIA}_${element.cod_foto}.jpg`));
    console.log('downloaded image ' + element.cod_foto);
  });

}

downloadImage();