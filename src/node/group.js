import Node from '../basenode';

export default class Group extends Node {
    _tag = 'group'

    id = '';
    platform = null;

    _entries = [];

    addChild(node, applyParent = true) {
        super.addChild(node, applyParent);

        switch(node._tag) {
            case 'entry':
                this._entries.push(node);
                break;
        }
    }

    getEntries() { return this._entries; }
}