const fs = require('fs');

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf-8');

  // Change roles
  content = content.replace(/(title:\s*'Eirenne',\s*role:\s*)'[^']+'/g, "$1'Founder & Lead Product Engineer'");
  content = content.replace(/(title:\s*'MYRADIO',\s*role:\s*)'[^']+'/g, "$1'Founder & Lead Product Engineer'");
  content = content.replace(/(title:\s*'MYPITLANE',\s*role:\s*)'[^']+'/g, "$1'Founder & Lead Product Engineer'");

  // Fix numbers
  let counter = 1;
  content = content.replace(/number:\s*'[^']+'/g, (match) => {
    const num = counter < 10 ? '0' + counter : '' + counter;
    counter++;
    return `number: '${num}'`;
  });

  fs.writeFileSync(file, content);
}

updateFile('src/data/projectsDataEn.js');
updateFile('src/data/projectsDataId.js');
