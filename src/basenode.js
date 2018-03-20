export const Attributes = [
    "xmlns", "type", "version", "href", "lang", "source", "target", "platform", "id"
];

/**
 * Cleans and finds the valid attribute version of the supplied input string
 * @param {string} str String to clean, and check
 * @returns {string|null} The valid string version, or null if no matches
 */
function getValidAttribute(str) {
    str = str.toLowerCase();
    for(const attr of Attributes) {
        if(attr.toLowerCase() == str)
            return attr;
    }
    return null;
}

var __nodeIds = 0;
export default class Node {
    _id = 0;
    _tag = '';
    _customAttrs = {};
    _parent = 0;
    _children = [];
    _content = null;

    constructor(data) {
        __nodeIds++;
        this._id = __nodeIds;

        if(data) {
            if(typeof data === 'object' && data.name && data.attributes)
                this.applyFromSAX(data);
        }
    }

    getID() { return this._id; }
    getTag() { return this._tag; }
    //getParentID() { return this._parent; }
    //getChildrenIDs() { return new Array(this._children); }
    getContent() { return this._content; }
    getCustomAttributes() { return Object.apply({}, this._customAttrs); }
    getAllAttributes() { 
        const validAttrs = {};
        for(const prop in this) {
            if(this.hasOwnProperty(prop) && prop.startsWith('_')===false)
                validAttrs[prop] = this[prop];
        }

        return Object.apply({}, validAttrs, this._customAttrs);
    }

    /**
     * Applies the details from SAX parsing to this object
     * @param {object} node Object provided from SAX-JS
     */
    applyFromSAX(node) {
        if(node.attributes && typeof node.attributes === 'object') {
            for(const prop in node.attributes) {
                const attr = getValidAttribute(node.attributes[prop].name);
                if(attr && this.hasOwnProperty(attr))
                    this.setAttribute(attr, node.attributes[prop].value);
                else
                    this._customAttrs[node.attributes[prop].name] = node.attributes[prop].value;
            }
        }
        return this;
    }

    /**
     * Sets an attribute property by key and value
     * This is a method so sub-classes can override it
     * @param {string} attr Attribute key
     * @param {string} value Attribute value
     */
    setAttribute(attr, value) {
        this[attr] = value;
    }

    /**
     * Sets the parent of this object
     * Also carries out the child mapping to the parent by second parameter
     * @param {Node|number} node New Parent, or parent ID
     * @param {boolean} applyChild If true, set's the children of the parent as well (only if it's a node object)
     */
    setParent(node, applyChild = true) {
        const nodeId = typeof node === 'number' ? node : node._id;
        if(nodeId == 0 || nodeId == this._id) return;
        this._parent = nodeId;

        if(applyChild && typeof node !== 'number' && node._id)
            node.addChild(this, false);
    }

    /**
     * Adds a child to this node
     * Also handles setting parrent on the child
     * @param {Node|number} node New child, or child ID
     * @param {boolean} applyParent If true, set's the parent value of new children as well (only if it's a node object)
     */
    addChild(node, applyParent = true) {
        const exists = this._children.findIndex(i => i._id === node._id) !== -1;
        if(!exists) {
            this._children.push(node);

            if(applyParent)
                node.setParent(this, false);
        }
    }

    /**
     * Removes a child from this node
     * @param {Node|number} node Child to remove, node or ID of a node
     */
    removeChild(node) {
        const nodeId = typeof node === 'number' ? node : node._id;
        if(nodeId === 0 || nodeId === this._id) return;

        this._children = this._children.filter(i => i !== nodeId);
    }

    setContent(val) {
        this._content = val;
    }
}