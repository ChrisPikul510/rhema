import Node from '../basenode';

export default class Entry extends Node {
    _tag = 'entry';

    id = '';
    platform = null;

    _source = null;
    _target = null;

    addChild(node, applyParent = true) {
        super.addChild(node, applyParent);

        switch(node._tag) {
            case 'source':
                this._source = node;
                break;
            case 'target':
                this._target = node;
                break;
        }
    }

    getSource() { return this._source; }
    getTarget() { return this._target; }
}