'use babel';

class CenterEditor {
  wasActive = false;
  cancelToken = null;
  sidebar = false;
  distractionFree = false;

  config = {
    updateInterval: {
      title: 'Check for a state change every X seconds',
      type: 'number',
      default: 1.0,
      minimum: 0.1
    }
  }

  listenForLayoutChanges(target) {
    const { mainLayout } = inkdrop.store.getState()

    if (target.sidebar !== mainLayout.sidebarVisible || target.distractionFree !== mainLayout.distractionFreeEnabled) {
      target.sidebar = mainLayout.sidebarVisible;
      target.distractionFree = mainLayout.distractionFreeEnabled;

      target.updateState();
    }
  }

  updateState() {
    const { layouts } = inkdrop
    const { mainLayout } = inkdrop.store.getState()

    if (mainLayout.distractionFreeEnabled) {
      this.distractionFree = mainLayout.distractionFreeEnabled;
      return;
    }

    const target = mainLayout.sidebarVisible ? 'main:full' : 'main:slim'

    this.sidebar = mainLayout.sidebarVisible;

    layouts.removeComponentFromLayout(target, 'EditorLayout')
    layouts.insertComponentToLayoutBefore(target, 'NoteListBarLayout', 'EditorLayout')
  }

  activate() {
    if (this.cancelToken) {
      return;
    }

    this.updateState();

    this.wasActive = true;
    this.cancelToken = setInterval(() => this.listenForLayoutChanges(this), 1000);
  }

  deactivate() {
    if (this.cancelToken) {
      clearInterval(this.cancelToken);
      this.cancelToken = null;
    }

    if (this.wasActive) {
      this.wasActive = false;

      const { layouts } = inkdrop
      const { mainLayout } = inkdrop.store.getState()
      
      layouts.removeComponentFromLayout('main:full', 'EditorLayout')
      layouts.insertComponentToLayoutAfter('main:full', 'NoteListBarLayout', 'EditorLayout')

      layouts.removeComponentFromLayout('main:slim', 'EditorLayout')
      layouts.insertComponentToLayoutAfter('main:slim', 'NoteListBarLayout', 'EditorLayout')
    }
  }

  swapPanels(panels) {
    this.swapNodes(panels[0].element, panels[1].element)
  }
}

module.exports = new CenterEditor()