import { app, BrowserWindow, Tray } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null
let trayIcon: Tray | null = null

const appRoot = app.getAppPath()
const rendererDir = path.join(appRoot, 'src', 'renderer')
const iconPath = path.join(appRoot, 'dist', 'assets', 'icon.ico')

// Fonction pour créer la fenêtre principale
const createMainWindow = (): void => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		show: false,
		icon: iconPath,
		webPreferences: {
			contextIsolation: true
		}
	})

	mainWindow.loadFile(path.join(rendererDir, 'index.html'))
}

const createTrayIcon = (): void => {
	trayIcon = new Tray(iconPath)
	trayIcon.setToolTip('Labo 2')
}


// Fonction pour créer la fenêtre de splash / loading
const createSplashWindow = (): void => {
	splashWindow = new BrowserWindow({
		width: 420,
		height: 240,
		frame: false,
		center: true,
		show: false,
		webPreferences: {
			contextIsolation: true
		}
	})

	splashWindow.loadFile(path.join(rendererDir, 'splash.html'))
	splashWindow.once('ready-to-show', () => {
		splashWindow?.show()
	})
}

// Fonction pour créer la fenêtre "A propos"
const createAboutWindow = (): void => {
	if (!mainWindow) {
		return
	}

	const aboutWindow = new BrowserWindow({
		width: 420,
		height: 260,
		modal: true,
		parent: mainWindow,
		show: false,
		webPreferences: {
			contextIsolation: true
		}
	})

	aboutWindow.loadFile(path.join(rendererDir, 'about.html'))
	aboutWindow.once('ready-to-show', () => {
		aboutWindow.show()
	})
}

app.whenReady().then(() => {
	createMainWindow()
	createSplashWindow()
	createTrayIcon()

    // montre le splash screen pendant 3 secondes avant d'afficher la fenêtre principale
	setTimeout(() => {
		splashWindow?.close()
		mainWindow?.show()
		createAboutWindow()
	}, 3000)
})

