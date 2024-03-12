const core = require("@actions/core");
const axios = require("axios");
const https = require('https');

const token = core.getInput('token');
const host = core.getInput('host') || 'https://www.appstage.io';
const pattern = core.getInput('pattern');

(async () => {
  try {
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    const response = await instance.get(`${host}/api/live_builds`,{
      headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    });

    matchRegex = new RegExp(pattern, "g")
    const matchingFiles = response.data.release_files.filter((file) => file.name.match(matchRegex))

    await matchingFiles.forEach(async (file) => {
      console.log(`Deleting: ${file.name}`)
      await instance.delete(`${host}/api/live_builds/${file.id}`,{
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
        });
    });

    console.log(`Deleted ${matchingFiles.length} files.`)
  } catch (error) {
    msg = `File delete failed - ${error.message}`
    core.setFailed(msg);
  }
})();
  