'use strict';

import https from 'https';
import fs from 'fs';
import chalk from 'chalk';
import _ from 'lodash';

const USER = 'schoi';
const PASSWORD = 'translate4fubo';
const PROJECT = 'fubotv-website-v2';
const SLUG = 'fubotv-website-v2pot';
// SLUG = 'extracted-stringspot';
const BASE_URL = `/api/2/project/${PROJECT}`;
const TRANSLATIONS_PATH = './translations';

const options = {
    host: 'www.transifex.com',
    port: '443',
    auth: USER + ':' + PASSWORD
};

let langCodes;

// ====== MAIN SEQUENCE ======

getLanguageCodes()
    .catch(err => {
        console.log(chalk.red('Error getting language list! ErrorCode: '), chalk.yellow(err));
        process.exit(1);
    })
    .then(langArray => {
        langCodes = langArray;
        return pushTranslation();
    })
    .catch(err => {
        console.log(chalk.red('Error uploading extracted strings! ErrorCode: '), chalk.yellow(err));
        process.exit(1);
    })
    .then(() => {
        return Promise.all(langCodes.map(pullTranslation));
    })
    .then(translations => {
        _.forEach(langCodes, (langIsoCode, idx)=> {
            fs.writeFile(`${TRANSLATIONS_PATH}/${langIsoCode}.po`, translations[idx], (err) => {
                if (err) {
                    console.log(chalk.red('Error getting %s translation!'), chalk.cyan(langIsoCode));
                    process.exit(1);
                }
                console.log('Downloaded %s translation', chalk.cyan(langIsoCode));
            });
        })
    });

// ====== IMPLEMENTATION ======

function getLanguageCodes() {
    return new Promise((resolve, reject)=> {
        https.get(
            _.merge(options, {path: `${BASE_URL}/languages/`}),
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

function pushTranslation() {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}
