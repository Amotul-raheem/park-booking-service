import fs from "fs";

function readHTMLFile(path) {
    try {
        return fs.readFileSync(path, 'utf-8')
    } catch (e) {
        console.log(e)
    }
}

export default readHTMLFile;