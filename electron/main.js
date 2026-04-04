const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    title: 'STGraphX',
    icon: path.join(__dirname, '..', 'icon.png'),
    show: false,
    width: 1600,
    height: 980,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));
  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  app.setName('STGraphX');
  ipcMain.handle('stgraphx:show-open-dialog', async (event, options = {}) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return dialog.showOpenDialog(win, {
      title: options.title || 'Open JSON',
      properties: options.multiple ? ['openFile', 'multiSelections'] : ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
  });

  ipcMain.handle('stgraphx:show-save-dialog', async (event, options = {}) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return dialog.showSaveDialog(win, {
      title: options.title || 'Save JSON',
      defaultPath: options.suggestedName || 'model.json',
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
  });

  ipcMain.handle('stgraphx:show-directory-dialog', async (event, options = {}) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(win, {
      title: options.title || 'Select model folder',
      properties: ['openDirectory'],
    });
    return {
      canceled: result.canceled,
      directoryPath: result.filePaths && result.filePaths[0] ? result.filePaths[0] : '',
    };
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
