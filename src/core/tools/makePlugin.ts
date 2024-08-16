import * as fs from 'fs';
import { Logger } from '../utils/logger/index.js';
import { input } from '@inquirer/prompts';


function makePlugin(name: string): any {
  const logger = new Logger("MakePlugin")
  logger.info(`Creating plugin ${name}...`);

  const pluginFolder = `src/plugins/${name}`;
  const pluginFile = `${pluginFolder}/index.ts`;

  // Check if plugin already exists
  if (fs.existsSync(pluginFolder)) {
    logger.error(`Plugin ${name} already exists.`);
    return askForPluginName();
  }

  // Create plugin folder
  fs.mkdirSync(pluginFolder);

  // Create plugin file
  fs.writeFileSync(pluginFile, `import { Plugin } from '@itsmybot';

export default class ${name}Plugin extends Plugin {

  version = "0.0.1"
  authors = ["ItsMe.to"]
  description = "An example plugin."

  async initialize() { }
}`);

  logger.info(`Plugin ${name} created.`);

  return;
}

async function askForPluginName() {
  const answer = await input({ message: "What's the name of the plugin?" });
  return makePlugin(answer);
}

await askForPluginName();
