const { exec } = require("child_process");

const runCode = (code, language) => {
  return new Promise((resolve, reject) => {
    let command;
    if (language === "javascript") {
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
    } else if (language === "python") {
      command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
    } else {
      return reject("❌ ยังไม่รองรับภาษาอื่น");
    }

    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        return reject(`⚠️ Error: ${stderr || error.message}`);
      }
      resolve(stdout);
    });
  });
};

// ทดสอบ
runCode('console.log("Hello, World!");', "javascript")
  .then(output => console.log("Output:", output))
  .catch(err => console.error(err));