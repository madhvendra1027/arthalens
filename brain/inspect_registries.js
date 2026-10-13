const https = require('https');
const fs = require('fs');

async function fetchRegistry(name) {
  return new Promise((resolve, reject) => {
    https.get(`https://bklit.com/r/${name}.json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const ring = await fetchRegistry('ring-chart');
  console.log('Ring files:', ring.files ? ring.files.map(f => f.path) : Object.keys(ring));
  
  const bar = await fetchRegistry('bar-chart');
  console.log('Bar files:', bar.files ? bar.files.map(f => f.path) : Object.keys(bar));

  const pie = await fetchRegistry('pie-chart');
  console.log('Pie files:', pie.files ? pie.files.map(f => f.path) : Object.keys(pie));

  fs.writeFileSync('c:/Projects/ArthaLens/arthalens/brain/ring-chart.json', JSON.stringify(ring, null, 2));
  fs.writeFileSync('c:/Projects/ArthaLens/arthalens/brain/bar-chart.json', JSON.stringify(bar, null, 2));
  fs.writeFileSync('c:/Projects/ArthaLens/arthalens/brain/pie-chart.json', JSON.stringify(pie, null, 2));
}

main().catch(console.error);
