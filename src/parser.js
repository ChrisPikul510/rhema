/*
 * RHEMA - Language Translation System
 * @author Chris Pikul <ChrisPikul510@gmail.com>
 * @license Apache-2.0
 */
import SAX from 'sax';

import BaseNode from './basenode'
import * as Nodes from './node'

/**
 * Converts a SAX node object to a Rhema object by matching node name.
 * Note: The methodology for instantiating first and then using the applyFromSAX function
 * when creating the object is so the function under that actual classes scope get's called!
 * Passing the node directly to the constructor evidentally only calls the base class version
 * @param {object} node Node object from SAX onOpenTag event
 * @returns {BaseNode} Sub-class object of BaseNode
 */
export function NodeFromSAX(node) {
    var outp;
    switch(node.name) {
        case 'project': outp = (new Nodes.Project()); break;
        case 'files': outp = (new Nodes.Files()); break;
        case 'file': outp = (new Nodes.File()); break;
        case 'base': outp = (new Nodes.Base()); break;

        case 'language': outp = (new Nodes.Language()); break;
        case 'group': outp = (new Nodes.Group()); break;
        case 'entry': outp = (new Nodes.Entry()); break;
        case 'source': outp = (new Nodes.Source()); break;
        case 'target': outp = (new Nodes.Target()); break;
        
        default:
            //Unknown tag types get absorbed as basic Node types
            outp = new BaseNode();
            outp._tag = node.name;
            break;
    }
    return outp ? outp.applyFromSAX(node) : null;
}

/**
 * Converts the string reported as the attributes section of a tag into an object of key-values.
 * For Processing Instructions, SAX returns the whole string ie. <?xml version="1.0" encoding="UTF-8" ?>
 * returns the string 'version="1.0" encoding="UTF-8" '. This function tokenizes that and returns an object
 * @param {string} rawStr Raw element attribute string
 * @returns {object} Attributes object
 */
export function ParseRawAttribute(rawStr) {
    const attrs = rawStr.split(" ");
    const rtn = {};
    attrs.map(str => {
            const parts = str.split("=");
            if(parts.length == 2) {
                return [parts[0].trim(), parts[1].substr(1, parts[1].length - 2).trim()];
            }
            return null;
        })
        .filter(p => p !== null)
        .forEach(e => {
            rtn[e[0]] = e[1];
        });
    return rtn;
}

 /**
  * Parses the XML string data and generates a valid document from it
  * @param {string} data Data to parse
  * @returns {Promise} Promise that resolves to a Document object
  */
 export default function Parse(data) {
    if(typeof data !== 'string')
        return Promise.reject("Parse must be supplied with a string of data");
    return new Promise((resolve, reject) => {
        const p = SAX.parser(false, {
            trim: true,
            normalize: false,
            lowercase: true,
            xmlns: true,
            position: true
        });
        p.onerror = reject;

        p.onprocessinginstruction = ({ name, body }) => {
            const attrs = ParseRawAttribute(body);
            console.log('[PI]', name, attrs);
        }

        let rootDoc = null;
        let lastTag = null, thisTag = null;
        let treeDepth = [];

        p.onopentag = node => {
            //Figure out which tag it is
            thisTag = NodeFromSAX(node);

            //Apply tree-mapping
            if(thisTag) {
                if(!rootDoc && (thisTag instanceof Nodes.Project || thisTag instanceof Nodes.Language))
                    rootDoc = thisTag;

                if(lastTag) {
                    thisTag.setParent(lastTag);
                    treeDepth.push(lastTag);
                }

                lastTag = thisTag;

                if(rootDoc && thisTag._id !== rootDoc._id) rootDoc.addNode(thisTag);
            } else {
                reject(`failed to parse element: ${node.name}`);
            }
        };

        p.onclosetag = tag => {
            if(treeDepth.length > 0) lastTag = treeDepth.pop();
        };

        p.ontext = txt => {
            if(lastTag !== null)
                lastTag.setContent(txt);
        };

        
        p.onend = () => resolve(rootDoc);

        p.write(data).close();
    })
 }
