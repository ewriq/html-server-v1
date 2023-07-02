    const { exec } = require('child_process');
    const exe = './server/main.exe';

    function open() {
        exec(`cd server && go run .`, (err, stdout, stderr) => {
            if (err) {
            console.error('Hata:', err);
            return;
            console.log(stdout)
            }
        });
        
    } 

    module.exports = open