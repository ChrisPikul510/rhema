import Node from '../basenode';

export default class Files extends Node {
    _tag = "files";

    _base = null;
    _files = [];

    addChild(node, applyParent = true) {
        super.addChild(node, applyParent);

        //Hook into the addChild to find the file types
        if(node._tag === 'file')
            this._files.push(node);
        else if(node._tag === 'base') {
            if(this._base !== null)
                console.warn('Files element only takes 1 Base element, overriding the old with the new');
            this._base = node;
        }
    }
}