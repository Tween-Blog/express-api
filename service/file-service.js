const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

class FileService {
    saveFile(file, folder) {
        try {
            const fileName = uuid.v4() + '.' + file.name.split('.')[1];
            const filePath = path.resolve(`static/${folder}`, fileName);
            file.mv(filePath);

            return fileName;
        } catch (e) {
            console.error(e);
        }
    }

    removeFile(fileName, folder) {
        const filePath = path.resolve(`static/${folder}/${fileName}`);
        fs.unlinkSync(filePath);
    }
}

module.exports = new FileService();