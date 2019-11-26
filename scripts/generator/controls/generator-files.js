const path = require('path');
const fs = require('fs');
const { getDirs, generateFile, getFileContent } = require('../utils');

function getFileLevel(filePath) {
    const src = '/src/'; // FIXME 这里是硬编码

    if (!filePath) return './';

    const filePaths = filePath.split(src);

    if (filePaths.length < 2) return './';

    const length = filePaths[1].split('/').length - 1;

    const levels = [];
    for (let i = 0; i < length; i++) {
        levels.push('../');
    }
    return levels.join('');
}

module.exports = {
    generatorFiles(req, res, next) {
        const { baseInfo, listPage, editPage, ajaxApi } = req.body;
        const generates = [];

        if (listPage) {
            const outPutFile = path.resolve(listPage.outPutDir, listPage.outPutFile);
            const fileLevel = getFileLevel(outPutFile);
            const config = {
                ...baseInfo,
                ...listPage,
                outPutFile,
                fileLevel,
            };
            generates.push(generateFile(config));
        }

        if (editPage) {
            const outPutFile = path.resolve(editPage.outPutDir, editPage.outPutFile);
            const fileLevel = getFileLevel(outPutFile);
            const config = {
                ...baseInfo,
                ...editPage,
                outPutFile,
                fileLevel,
            };
            generates.push(generateFile(config));
        }

        if (ajaxApi) {
            //生成api文件
            generates.push(generateFile({
                template: ajaxApi.template,
                outPutFile: path.resolve(ajaxApi.outPutDir, ajaxApi.outPutFile),
                ajaxUrl: baseInfo.ajaxPrefix,
            }));
        }

        Promise.all(generates).then(() => {
            res.send({ code: 200, data: true });
        });
    },

    getFileContent(req, res, next) {
        const { baseInfo, pageInfo } = req.body;
        const outPutFile = path.resolve(pageInfo.outPutDir, pageInfo.outPutFile);
        const fileLevel = getFileLevel(outPutFile);
        const config = {
            ...baseInfo,
            ...pageInfo,
            outPutFile,
            fileLevel,
        };

        getFileContent(config)
            .then(content => res.send({ code: 200, data: content }));
    },

    getSrcDirs(req, res, next) {
        const dirs = getDirs();
        if (dirs && dirs.children) {
            res.send({ code: 200, data: dirs.children });
            return;
        }
        res.send({ code: 200, data: [] });
    },

    checkFileExist(req, res, next) {
        const { files } = req.query;
        const result = [];

        files.forEach(item => {
            const { fileDir, fileName } = JSON.parse(item);
            const file = path.resolve(fileDir, fileName);
            const exist = fs.existsSync(file);
            result.push({
                fileName,
                exist,
            });
        });

        res.send({ code: 200, data: result });
    },
};
