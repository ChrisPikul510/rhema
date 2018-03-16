import Node from '../basenode'

export default class Project extends Node {
    _tag = 'project';
    _nodes = new Map();

    xmlns = 'rhema.100.project';

    _nodeFiles = null;

    addNode(node) {
        //We'll keep a dictionary of all the nodes anyways
        if(node instanceof Node)
            this._nodes.set(node.getID(), node);

        //Find some interesting stuff
        if(node._tag === 'files')
            this._nodeFiles = node;
    }

    hasFiles() { return this._nodeFiles && this._nodeFiles._base && this._nodeFiles._files.length > 0; }
    countFiles() {
        if(this.hasFiles())
            return this._nodeFiles._files.length + 1; //+1 for base file
        return 0;
    }
    getFiles() {
        if(!this.hasFiles()) return [];
        return [ this._nodeFiles._base ].concat(this._nodeFiles._files);
    }

    getBaseElement() {
        if(!this.hasFiles()) return null;
        return this._nodeFiles._base;
    }
}