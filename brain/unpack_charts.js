const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Projects/ArthaLens/arthalens/apps/web/src/components/charts/bklit';

function unpackRegistry(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const files = data.files || [];
  console.log(`Unpacking ${jsonPath} (${files.length} files)...`);

  for (const f of files) {
    let relPath = f.path.replace(/^src\/charts\//, '');
    const outPath = path.join(targetDir, relPath);
    const outSubDir = path.dirname(outPath);
    if (!fs.existsSync(outSubDir)) {
      fs.mkdirSync(outSubDir, { recursive: true });
    }
    fs.writeFileSync(outPath, f.content, 'utf8');
    console.log(` Wrote ${relPath}`);
  }
}

unpackRegistry('c:/Projects/ArthaLens/arthalens/brain/ring-chart.json');
unpackRegistry('c:/Projects/ArthaLens/arthalens/brain/pie-chart.json');
unpackRegistry('c:/Projects/ArthaLens/arthalens/brain/bar-chart.json');

console.log('Unpacking complete!');
