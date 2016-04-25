'use strict';

import https from 'https';
import fs from 'fs';
import chalk from 'chalk';
import _ from 'lodash';

const USER = 'schoi';
const PASSWORD = 'translate4fubo';
const PROJECT = 'fubotv-website-v2';
const BASE_URL = `/api/2/project/${PROJECT}`;

const EXTR_STR_FILENAME = 'fubotv-website-v2.pot';
const TRANSLATIONS_PATH = './translations';
const SLUG = EXTR_STR_FILENAME.replace(/\./, '');

const FAIL = chalk.red('✘');
const SUCC = chalk.green('✔');

const options = {
    host: 'www.transifex.com',
    port: '443',
    auth: USER + ':' + PASSWORD
};

let langCodes;

// ====== MAIN SEQUENCE ======

getLanguageCodes()
    .catch(err => {
        console.log(`${FAIL} Error getting language list! ErrorCode: ${chalk.yellow(err)}`);
        process.exit(1);
    })
    .then(langArray => {
        langCodes = langArray;
        if (!langArray.length) {
            console.log(`${FAIL} No translations found for current project!`);
            process.exit(1);
        } else return Promise.all(langCodes.map(pullTranslation));
    })
    .catch(() => {
        process.exit(1);
    })
    .then(translations => Promise.all(writeTranslations(translations)))
    .then(() => {
        if (process.env.NODE_ENV === 'production') return pushTranslation();
        return Promise.resolve();
    })
    .catch(() => {
        process.exit(1);
    });

// ====== IMPLEMENTATION ======

function getLanguageCodes() {
    return new Promise((resolve, reject)=> {
        https.get(
            _.merge(options, {path: `${BASE_URL}/languages`}),
            res => {
                res.on('data', data => {
                    (parseInt(res.statusCode, 10) === 200)
                        ? resolve(_.map(JSON.parse(data), 'language_code'))
                        : reject(res.statusCode);
                });
            });
    })
}

function pullTranslation(languageCode) {
    return new Promise((resolve, reject)=> {
        https.get(
            _.merge(options, {path: `${BASE_URL}/resource/${SLUG}/translation/${languageCode}/`}),
            res => {
                let outputBuffer = '';

                res.setEncoding('utf8');
                res.on('data', dataPortion => {
                    if (parseInt(res.statusCode, 10) !== 200) reject(res.statusCode);
                    else outputBuffer += dataPortion;    // Bufferized data
                });
                res.on('end', ()=> {
                    resolve(JSON.parse(outputBuffer.toString()).content);
                });
            });
    })
}

function writeTranslations(translations) {
    return _.map(langCodes, (langIsoCode, idx)=> {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${TRANSLATIONS_PATH}/${langIsoCode}.po`, translations[idx], (err) => {
                if (err) {
                    console.log(`${FAIL} Error getting ${chalk.cyan(langIsoCode)} translation!`);
                    return reject(err);
                }
                console.log(`${SUCC} Downloaded ${chalk.cyan(langIsoCode)} translation`);
                resolve(langIsoCode);
            });
        })
    })
}

function pushTranslation() {
    return new Promise((resolve, reject) => {
        let fileName = `${TRANSLATIONS_PATH}/${EXTR_STR_FILENAME}`;

        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.log(`${FAIL} Error getting extracted strings file: ${chalk.cyan(fileName)}`);
                return reject(err);
            }

            let dataToSend = JSON.stringify({content: data});

            let req = https.request(_.merge(options, {
                path: `${BASE_URL}/resource/${SLUG}/content/`,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(dataToSend)
                }
            }));

            req.on('response', res => {
                if (res.statusCode === '200') {
                    console.log(`${SUCC} Successfully uploaded extracted strings.`);
                    return resolve();
                }
                console.log(`${FAIL} Error uploading extracted strings! ErrorCode: ${chalk.yellow(res.statusCode)}`);
                return reject(res.statusCode);
            });

            req.write(dataToSend);

            req.end();
        });

    });
}
