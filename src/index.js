/*
 * RHEMA - Language Translation System
 * @author Chris Pikul <ChrisPikul510@gmail.com>
 * @license Apache-2.0
 */
import Parser from './parser';

export default class Rhema {
    project = null;
    baseLanguage = null;
    languages = new Map();

    loaded = false;
    isProject = false;

    parse(data, options = {}) {
        options = Object.assign({}, {
        }, options);
        return new Promise((resolve, reject) => {
            Parser(data)
                .then(obj => {
                    if(!obj) {
                        reject('parse returned null, failed to parse the file');
                        return;
                    }

                    this.loaded = true;
                    if(obj._tag === 'project') {
                        this.isProject = true;
                        this.project = obj;
                    } else if(obj._tag === 'language') {
                        if(obj.target !== '')
                            this.languages.set(obj.target, obj);
                        else if(this.project !== null) {
                            const baseEl = this.project.getBaseElement();
                            if(baseEl && baseEl.lang == obj.source)
                                this.baseLanguage = obj;
                        }
                    }

                    resolve();
                })
                .catch(reject);
        })
    }
}