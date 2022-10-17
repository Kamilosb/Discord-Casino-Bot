const { glob } = require("glob");
const { dirname } = require("path");
const { promisify } = require("util");
const proGlob = promisify(glob);

async function loadFiles(dirname) {
    const Files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirname}/**/*.js`)
    Files.forEach((file) => delete require.cache[require.resolve(file)])
    return Files;
}

module.exports = { loadFiles }