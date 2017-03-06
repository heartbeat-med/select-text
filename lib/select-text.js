'use babel';

import { CompositeDisposable, Point } from 'atom';

const STARTS = ["\"", "'"];
const ENDS = ["\"", "'"];

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'select-text:select': () => this.select()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  select() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const cursor = editor.getCursorBufferPosition();
      const line = editor.buffer.lines[cursor.row];
      const pre = line.substring(0, cursor.column);
      const post = line.substring(cursor.column);

      const startPositions = STARTS.map((char) => pre.lastIndexOf(char));
      const endPositions = ENDS.map((char) => post.indexOf(char));

      for (let i = 0; i < STARTS.length; i++) {
        const startColumn = startPositions[i];
        const endColumn = endPositions[i];

        if (startColumn !== -1 && endColumn !== -1) {
          editor.setCursorBufferPosition(new Point(cursor.row, startColumn + 1))
          editor.selectToBufferPosition(new Point(cursor.row, endColumn + cursor.column));
          break;
        }
      }
    }
  }
};
