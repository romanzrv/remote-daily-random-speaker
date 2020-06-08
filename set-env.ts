const fs = require('fs');
const targetPath = './src/environments/environment.ts';
require('dotenv').config();

const envConfigFile = `export const environment = {
   production: false,
   HOST_URL: '${process.env.SERVER_IP_ADDRESS}',
   SOCKET_ENDPOINT: 'http://${process.env.SERVER_IP_ADDRESS}:${process.env.SOCKET_IO_PORT}'
};\n`;

fs.writeFile(targetPath, envConfigFile,  (err) => {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath}`);
  }
});
