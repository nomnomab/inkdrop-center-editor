'use babel';

class CenterEditor {
  wasActive = false;

  getPanels() {
    const noteListBarLayout = document.getElementsByClassName('note-list-bar-layout')[0]
    const editorLayout = document.getElementsByClassName('editor-layout')[0]
    const parent = noteListBarLayout.parentNode

    return [
      {
        element: noteListBarLayout,
        index: Array.prototype.indexOf.call(parent.children, noteListBarLayout)
      },
      {
        element: editorLayout,
        index: Array.prototype.indexOf.call(parent.children, editorLayout)
      }
    ]
  }

  swapNodes(n1, n2) {
    var p1 = n1.parentNode
    var p2 = n2.parentNode
    var i1, i2

    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) {
      return
    }

    for (var i = 0; i < p1.children.length; i++) {
      if (p1.children[i].isEqualNode(n1)) {
        i1 = i
      }
    }

    for (var i = 0; i < p2.children.length; i++) {
      if (p2.children[i].isEqualNode(n2)) {
        i2 = i
      }
    }

    if (p1.isEqualNode(p2) && i1 < i2) {
      i2++
    }

    p1.insertBefore(n2, p1.children[i1])
    p2.insertBefore(n1, p2.children[i2])
  }

  activate() {
    const panels = this.getPanels()
    console.log(panels)
    
    if (panels[0].index < panels[1].index) {
      this.swapPanels(panels);
    }

    this.wasActive = true;
  }

  deactivate() {
    if (this.wasActive) {
      this.wasActive = false;

      const panels = this.getPanels()

      if (panels[0].index > panels[1].index) {
        this.swapPanels(panels);
      }
    }
  }

  swapPanels(panels) {
    this.swapNodes(panels[0].element, panels[1].element)
  }
}

module.exports = new CenterEditor()