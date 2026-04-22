const { contextBridge, ipcRenderer, clipboard } = require('electron');
const fs = require('fs/promises');
const path = require('path');

function createAbortError() {
  const err = new Error('Aborted');
  err.name = 'AbortError';
  return err;
}

function createVirtualFile(filePath) {
  return {
    name: path.basename(filePath),
    path: filePath,
    async text() {
      return fs.readFile(filePath, 'utf8');
    },
  };
}

function createFileHandle(filePath) {
  return {
    kind: 'file',
    name: path.basename(filePath),
    path: filePath,
    async getPath() {
      return filePath;
    },
    async getParentDirectoryPath() {
      return path.dirname(filePath);
    },
    async getParentDirectoryHandle() {
      return createDirectoryHandle(path.dirname(filePath));
    },
    async getFile() {
      return createVirtualFile(filePath);
    },
    async createWritable() {
      let buffer = '';
      return {
        async write(data) {
          buffer = typeof data === 'string' ? data : String(data ?? '');
        },
        async close() {
          await fs.writeFile(filePath, buffer, 'utf8');
        },
      };
    },
  };
}

function createDirectoryHandle(directoryPath) {
  return {
    kind: 'directory',
    name: path.basename(directoryPath),
    path: directoryPath,
    async getFileHandle(name) {
      const baseName = path.basename(String(name || ''));
      const filePath = path.join(directoryPath, baseName);
      await fs.access(filePath);
      return createFileHandle(filePath);
    },
  };
}

function createDirectoryHandleFromFilePath(filePath) {
  const directoryPath = path.dirname(String(filePath || ''));
  return createDirectoryHandle(directoryPath);
}

contextBridge.exposeInMainWorld('STGraphXPlatform', {
  isElectron: true,
  createFileHandleFromPath(filePath) {
    return createFileHandle(String(filePath || ''));
  },
  createDirectoryHandleFromPath(filePath) {
    return createDirectoryHandleFromFilePath(filePath);
  },
  createDirectoryHandleFromDirectoryPath(directoryPath) {
    return createDirectoryHandle(String(directoryPath || ''));
  },
  readClipboardText() {
    return clipboard.readText();
  },
  writeClipboardText(text) {
    clipboard.writeText(typeof text === 'string' ? text : String(text ?? ''));
  },
  async showOpenFilePicker(options = {}) {
    const result = await ipcRenderer.invoke('stgraphx:show-open-dialog', {
      multiple: Boolean(options.multiple),
      title: options.title || '',
    });
    if (result.canceled) {
      return [];
    }
    return (result.filePaths || []).map(createFileHandle);
  },
  async showSaveFilePicker(options = {}) {
    const result = await ipcRenderer.invoke('stgraphx:show-save-dialog', {
      suggestedName: options.suggestedName || 'model.json',
      title: options.title || '',
    });
    if (result.canceled || !result.filePath) {
      throw createAbortError();
    }
    return createFileHandle(result.filePath);
  },
  async showDirectoryPicker(options = {}) {
    const result = await ipcRenderer.invoke('stgraphx:show-directory-dialog', {
      title: options.title || '',
    });
    if (result.canceled || !result.directoryPath) {
      throw createAbortError();
    }
    return createDirectoryHandle(result.directoryPath);
  },
});
