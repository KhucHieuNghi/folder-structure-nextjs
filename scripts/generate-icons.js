/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const svgr = require('@svgr/core').default;
const getColors = require('get-svg-colors');

const fs = require('fs/promises');
const path = require('path');

const exists = async (file) => {
  try {
    await fs.stat(file);
    return true;
  } catch (err) {
    return false;
  }
};

const upper = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const SRC_PATH = path.resolve(__dirname, '../src');

const getInputPath = () => path.resolve(process.cwd(), 'public/svgs/');

const getOutputPath = () => path.resolve(SRC_PATH, 'components/atoms/Icon/svg');
const getTypesFile = () => path.resolve(process.cwd(), 'svg.d.ts');

const getTypeName = (name = '') => `Icon${ upper(name) }`;

const FILE_PREFIX = `/* eslint-disable no-undef */
// 🔴 DO NOT EDIT — This file is generated.
`;
// About add or replace icons, check docs/icons.md file

const TYPES_FILE_TEMPLATE = `${ FILE_PREFIX }
type {typeName} =
  | {iconTypes}
`;

const EXPORTS_FILE_TEMPLATE = `${ FILE_PREFIX }
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

{imports}

type ComponentsByTypeIcon = {
  [key in {type}]: React.FunctionComponent;
};

export const ComponentsByType: ComponentsByTypeIcon = {
  {mapping}
};
`;

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toCamel = (s, capitalize = true) => {
  const output = s.replace(/([-_][a-z0-9])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '');
  });

  if (capitalize) {
    return output.replace(/^(.)/, ($1) => $1.toUpperCase());
  }
  return output;
};

const getComponentName = (svgFile) =>
  `${ toCamel(svgFile).replace('.svg', '') }Svg`;

const getComponentFileName = (svgFile) => toCamel(svgFile, false);

const getComponentType = (svgFile) =>
  `${ toCamel(svgFile, false).replace('.svg', '') }`;

const getTypes = (files) =>
  files.map((f) => `'${ getComponentType(f) }'`).join('\n  | ');

const getImportLines = (files) =>
  files
    .map(
      (f) =>
        `// @ts-ignore
import ${ getComponentName(f) } from './${ getComponentFileName(f) }.tsx';`,
    )
    .join('\n');

const getMapping = (files) =>
  files
    .map((f) => `${ getComponentType(f) }: ${ getComponentName(f) }`)
    .join(',\n  ');

const cleanupIDs = (svgContent, componentName) => {
  for (const [ , id ] of svgContent.matchAll(/id="([a-zA-Z0-9-_:]+)"/g)) {
    svgContent = svgContent.replace(
      new RegExp(escapeRegExp(id), 'g'),
      `${ componentName }__${ id }`,
    );
  }
  return svgContent;
};

async function convert(svgs, inputPath, outputPath) {
  for (const svgFile of svgs) {
    if (!/^[a-z0-9-]+.svg$/.test(svgFile)) {
      console.error(
        `🔴 Please name the icon "${ svgFile }" properly (words separated by '-')`,
      );
      process.exit(1);
    }
    const componentName = getComponentName(svgFile);
    const componentFile = `${ outputPath }/${ getComponentFileName(svgFile) }.tsx`;
    if (await exists(componentFile)) {
      continue;
    }
    const filePath = path.resolve(inputPath, svgFile);
    const svgContent = await fs.readFile(filePath);
    const content = svgContent
      .toString()
      // replace color names by hex code
      .replace(
        /(fill|stroke)="(black|white)"/g,
        (_, attr, val) => `${ attr }="${ val === 'white' ? '#fff' : '#000' }"`,
      );
    const colors = await getColors(content);
    let { fills, strokes } = colors;
    fills = fills.map((color) => color.hex());
    strokes = strokes.map((color) => color.hex());
    const svgProps = {};
    // detect if it's single or multiple colors
    const monoChrome =
      Array.from(new Set(fills.concat(strokes))).length === 1 &&
      !content.includes('feColorMatrix');
    // add data-attributes for CSS overrides
    if (monoChrome) {
      if (fills.length && !strokes.length) {
        svgProps[ 'data-custo' ] = 'fill';
      } else if (strokes.length && !fills.length) {
        svgProps[ 'data-custo' ] = 'stroke';
      } else {
        svgProps[ 'data-custo' ] = 'both';
      }
    }
    // generate react svg components
    const jsCode = await svgr(
      content,
      {
        icon: true,
        typescript: true,
        plugins: [ '@svgr/plugin-jsx', '@svgr/plugin-prettier' ],
        svgProps,   
      },
      { componentName },
    );
    await fs.writeFile(
      componentFile,
      FILE_PREFIX + cleanupIDs(jsCode, componentName),
    );
  }
}

async function generateTypes(iconsToConvert) {
  await fs.writeFile(
    getTypesFile(),
    TYPES_FILE_TEMPLATE.replace('{typeName}', getTypeName()).replace(
      '{iconTypes}',
      getTypes(iconsToConvert),
    ),
  );
}

async function generateExports(files, outputPath) {
  await fs.writeFile(
    path.resolve(outputPath, './index.ts'),
    EXPORTS_FILE_TEMPLATE.replace('{imports}', getImportLines(files))
      .replace('{type}', getTypeName())
      .replace('{mapping}', getMapping(files)),
  );
}

(async () => {
  const inputPath = getInputPath();
  const outPath = getOutputPath();

  const icons = (await fs.readdir(inputPath)).filter((name) =>
    /svg$/.test(name),
  );

  await convert(icons, inputPath, outPath);

  await generateTypes(icons);

  await generateExports(icons, outPath);
})();
