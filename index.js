const { exec } = require('child_process');

// TODO: options for muffet
function runMuffet(url) {
  // TODO: run muffet within node_modules/.bin
  
  exec(`muffet ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Muffet Output:\n${stdout}`);
  });
}

module.exports = runMuffet;
