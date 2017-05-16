const { app, dialog, ipcMain } = require('electron');
const { EXPORT_REQUEST } = require('./ipcevents.js');
const copy = require('recursive-copy');
const os = require('os');
const path = require('path');
const fs = require('pn/fs');
const { format } = require('prettier');
const Color = require('color');
const themer = require('themer').default;

const renderColorSets = (colorSets) => {
  const shouldIncludeDark = Object.values(colorSets.dark).every(Boolean);
  const shouldIncludeLight = Object.values(colorSets.light).every(Boolean);
  const source = [
    'exports.colors = {',
    ...(shouldIncludeDark ? renderColorSet('dark', colorSets.dark) : []),
    ...(shouldIncludeLight ? renderColorSet('light', colorSets.light) : []),
    '};',
  ].join('\n');
  return format(source, { singleQuote: true, trailingComma: 'es5' });
};

const renderColorSet = (colorSetKey, colorSet) => {
  return [
    `${colorSetKey}: {`,
    ...Object.entries(colorSet).map(renderColorSetColor),
    `}`,
  ];
};

const renderColorSetColor = ([ colorKey, color ]) => {
  const formatted = Color(color).hex();
  return `${colorKey}: '${formatted}', ${formatted !== color ? `// ${color}` : ''}`;
};

exports.bootstrap = (browserWindow) => {
  ipcMain.on(EXPORT_REQUEST, (event, colorSets, exportOptions) => {
    const {
      hyper,
      iterm,
      terminal,
      atomSyntax,
      sublimeText,
      vim,
      vimLightline,
      wallpaperBlockWave,
      wallpaperOctagon,
      slack,
    } = exportOptions;
    const templates = [
      hyper && 'themer-hyper',
      iterm && 'themer-iterm',
      terminal && 'themer-terminal',
      atomSyntax && 'themer-atom-syntax',
      sublimeText && 'themer-sublime-text',
      vim && 'themer-vim',
      vimLightline && 'themer-vim-lightline',
      wallpaperBlockWave && 'themer-wallpaper-block-wave',
      wallpaperOctagon && 'themer-wallpaper-octagon',
      slack && 'themer-slack',
    ].filter(Boolean);
    const colorsFileContents = renderColorSets(colorSets);

    const tmpOutputDirName = `themer-${Date.now()}`;
    const tmpOutputDirPath = path.join(os.tmpdir(), tmpOutputDirName);
    const tmpOutputColorsPath = path.join(tmpOutputDirPath, 'colors.js');
    const userOutputDirPath = dialog.showSaveDialog(
      browserWindow,
      {
        title: 'Choose export location',
        defaultPath: path.join(app.getPath('home'), tmpOutputDirName),
      }
    );

    fs.mkdir(tmpOutputDirPath)
      .then(() => fs.writeFile(tmpOutputColorsPath, colorsFileContents))
      .then(() => {
        themer(tmpOutputColorsPath, templates, tmpOutputDirPath, {}).subscribe(
          evt => console.log(evt),
          err => console.error(err),
          () => {
            console.log('done!!!');
            copy(tmpOutputDirPath, userOutputDirPath)
              .then((results) => { console.log('copy complete!!', results); })
              .catch((e) => { console.error('copy failed...', e); });
          }
        );
      })
      .catch(e => console.error(e));

  });
};