const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

const platform = os.platform();

let command;
let bashDir = "#!/bin/sh";

if (platform === 'win32') {
    bashDir = "#!/bin/sh; c:/program\ Files/Git/usr/bin/sh.exe";
}

const clearTerminal = '\033[2J\033[u';

command = `${bashDir}

pwd="$PWD"
Node_modules="$pwd/node_modules"
Dist="$pwd/dist"

if [ ! -d "$Node_modules" ]; then
    echo -e ${clearTerminal}
    echo -e "$(tput setaf 5)Pre commit needs to install node modules$(tput sgr0)"
    npm i  
fi

if [ ! -d "$Dist" ]; then
    echo "$(tput setaf 9)Dist folder needs to be created before commit your changes$(tput sgr0)"
    npm run build
    #rm -rf node_modules
fi
`;

fs.writeFile(".git/hooks/pre-commit", command, err => {
    if (err) {
        console.log("Error: ", err);
    }

    console.log("Hook file created.");
});

const ls = spawn('chmod', ['+x', '.git/hooks/pre-commit']);

ls.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


