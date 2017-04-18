'use strict';
const electron = require('electron');
const isDev = require('electron-is-dev');
const config = require('./config');

const globalShortcut = electron.globalShortcut;

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const lastWindowState = config.get('lastWindowState');
	console.log(`Last Window State: ${lastWindowState.width} x ${lastWindowState.height}`);

	const win = new electron.BrowserWindow({
		title: app.getName(),
		width: lastWindowState.width,
		height: lastWindowState.height,
		minWidth: 1000,
		minHeight: 800
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	let keyRegisterFn = (...args) => globalShortcut.register(...args);

	keyRegisterFn('MediaPreviousTrack', () => {
		console.log('playback:previousTrack');
	});

	keyRegisterFn('MediaPlayPause', () => {
		console.log('playback:playPause');
	});

	keyRegisterFn('MediaNextTrack', () => {
		console.log('playback:nextTrack');
	});

	keyRegisterFn('MediaStop', () => {
		console.log('playback:stop');
	});
});

app.on('before-quit', () => {
	if (!mainWindow.isFullScreen()) {
		console.log(mainWindow.getBounds())
		// config.set('lastWindowState', mainWindow.getBounds());
	}
});
