'use strict';

import https from 'https';
import fs from 'fs';
import _ from 'lodash';

const USER = 'schoi';
const PASSWORD = 'translate4fubo';
const PROJECT = 'fubotv-website-v2';
const SLUG = 'fubotv-website-v2pot';
// SLUG = 'extracted-stringspot';
const BASE_PATH = `/api/2/project/${PROJECT}`;

const options = {
    host: 'www.transifex.com',
    port: '443',
    auth: USER + ':' + PASSWORD
};

let langCodes;

getLanguageCodes()
    .then(langArray => {
        langCodes = langArray;
        return Promise.all(langArray.map(getTranslation));
    })
    .then(translations => {
        _.forEach(langCodes, (isoLang, idx)=> {
            fs.writeFile(`../translations/${isoLang}.po`, translations[idx], (err) => {
                if (err) throw Error(err);
            });
        })
    })
    .catch(err => {
        console.log('Error getting language files! ErrorCode: ', err);
    });

// ====== IMPLEMENTATION ======

function getLanguageCodes() {
    return new Promise((resolve, reject)=> {
        https.get(
            _.merge(options, {path: `${BASE_PATH}/languages/`}),
            res => {
                res.on('data', data => {
                    (parseInt(res.statusCode, 10) === 200)
                        ? resolve(_.map(JSON.parse(data), 'language_code'))
                        : reject(res.statusCode);
                });
            });
    })
}

function getTranslation(languageCode) {
    return new Promise((resolve, reject)=> {
        https.get(
            _.merge(options, {path: `${BASE_PATH}/resource/${SLUG}/translation/${languageCode}/`}),
            res => {
                var output = '';

                res.setEncoding('utf8');
                res.on('data', data => {
                    if (parseInt(res.statusCode, 10) !== 200) reject(res.statusCode);
                    else output += data;    // Bufferized data
                });
                res.on('end', ()=> {
                    resolve(JSON.parse(output.toString()).content);
                });
            });
    })
}
