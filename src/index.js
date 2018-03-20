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
                        if(obj.target && obj.target !== '')
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

    export(options = {}) {
        options = Object.assign({}, {
            format: 'JSON',
        }, options);

        return new Promise((resolve, reject) => {
            if(!this.loaded || !this.isProject)
                reject('must have a project loaded');

            if(!this.baseLanguage || !this.baseLanguage.source || this.baseLanguage.source==='') {
                console.warn('Base language', this.baseLanguage);
                reject('no base-language is loaded');
            }

            const output = {};
            function recursiveAddObject(node) {
                const obj = {};
                node._children.forEach(child => {
                    if(child._tag == 'group')
                        obj[child.id] = recursiveAddObject(child);
                    else if(child._tag == 'entry')
                        obj[child.id] = child.getTarget() ? child.getTarget().getContent() : child.getSource().getContent();
                })
                return obj;
            };
            output[this.baseLanguage.source] = recursiveAddObject(this.baseLanguage);

            for(const [lng, node] of this.languages.entries()) {
                if(output.hasOwnProperty(lng) === false)
                    output[lng] = recursiveAddObject(node);
            }

            resolve(output);
        });
    }
}