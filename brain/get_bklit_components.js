const https = require('https');

https.get('https://bklit.com/docs/components/line-chart', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/href="\/docs\/components\/[^"]+"/g) || [];
    const unique = [...new Set(matches.map(m => m.replace('href="', '').replace('"', '')))];
    console.log(JSON.stringify(unique, null, 2));
  });
});
