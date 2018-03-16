import Node from '../basenode'

export default class Language extends Node {
    _tag = 'language';
    _nodes = new Map();

    source = '';
    target = '';

    addNode(node) {
        //We'll keep a dictionary of all the nodes anyways
        if(node instanceof Node)
            this._nodes.set(node.getID(), node);
    }
}