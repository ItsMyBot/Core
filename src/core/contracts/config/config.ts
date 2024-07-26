import { Logger } from '@utils';

export class Config {
  public values: Map<string, any>;
  public logger: Logger;
  private currentPath: string;
  private fileName: string;

  constructor(logger: Logger, fileName: string = '', currentPath = '') {
    this.values = new Map();
    this.logger = logger;
    this.currentPath = currentPath;
    this.fileName = fileName;
  }

  public init(values: any) {
    this.values.clear();

    const normalizedValues = this.normalizeToConfig(values);
    for (const [key, value] of normalizedValues) {
      this.values.set(key, value);
    }
  }

  public toPlaintext(): string {
    return JSON.stringify(Object.fromEntries(this.values));
  }

  public has(path: string): boolean {
    return this.getOrNull(path) !== undefined;
  }

  public empty() {
    return new Config(this.logger, this.fileName, this.currentPath);
  }

  private getOrNull(path: string): any {
    const nearestPath = path.split('.')[0];

    if (path.includes('.')) {
      const remainingPath = path.substring(nearestPath.length + 1);
      if (!remainingPath) return undefined;

      const first = this.getOrNull(nearestPath);
      return first instanceof Config ? first.getOrNull(remainingPath) : undefined;
    }

    return this.values.get(nearestPath);
  }

  private get(path: string): any {
    const value = this.getOrNull(path);
    if (value === null || value === undefined) {
      const totalPath = this.currentPath ? `${this.currentPath}.${path}` : path;
      throw this.logger.error(`No config value found for "${totalPath}"` + (this.fileName ? ` in file ${this.fileName}` : ""));
    }
    return value;
  }

  private getValueOfType<T>(path: string, typeCheck: (value: any) => boolean): T {
    const value = this.get(path);
    if (!typeCheck(value)) {
      const totalPath = this.currentPath ? `${this.currentPath}.${path}` : path;
      throw this.logger.error(`Config value for "${totalPath}" is not of expected type`);
    }
    return value as T;
  }

  private getOrNullOfType<T>(path: string, typeCheck: (value: any) => boolean): T | undefined {
    const value = this.getOrNull(path);
    if (typeCheck(value)) {
      return value as T;
    }
    return undefined;
  }

  private isArrayOfType<T>(value: any, itemCheck: (item: any) => item is T): value is T[] {
    return Array.isArray(value) && value.every(itemCheck);
  }

  private isString(value: any): value is string {
    return typeof value === 'string';
  }

  private isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
  }

  private isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  private isConfig(value: any): value is Config {
    return value instanceof Config;
  }

  public getString(path: string): string {
    return this.getValueOfType<string>(path, this.isString);
  }

  public getStringOrNull(path: string): string | undefined {
    return this.getOrNullOfType<string>(path, this.isString);
  }

  public getStrings(path: string): string[] {
    return this.getValueOfType<string[]>(path, value => this.isArrayOfType(value, this.isString));
  }

  public getStringsOrNull(path: string): string[] | undefined {
    return this.getOrNullOfType<string[]>(path, value => this.isArrayOfType(value, this.isString));
  }

  public getBool(path: string): boolean {
    return this.getValueOfType<boolean>(path, this.isBoolean);
  }

  public getBoolOrNull(path: string): boolean | undefined {
    return this.getOrNullOfType<boolean>(path, this.isBoolean);
  }

  public getNumber(path: string): number {
    return this.getValueOfType<number>(path, this.isNumber);
  }

  public getNumberOrNull(path: string): number | undefined {
    return this.getOrNullOfType<number>(path, this.isNumber);
  }

  public getNumbers(path: string): number[] {
    return this.getValueOfType<number[]>(path, value => this.isArrayOfType(value, this.isNumber));
  }

  public getNumbersOrNull(path: string): number[] | undefined {
    return this.getOrNullOfType<number[]>(path, value => this.isArrayOfType(value, this.isNumber));
  }

  public getSubsection(path: string): Config {
    return this.getValueOfType<Config>(path, this.isConfig);
  }

  public getSubsectionOrNull(path: string): Config | undefined {
    return this.getOrNullOfType<Config>(path, this.isConfig);
  }

  public getSubsections(path: string): Config[] {
    return this.getValueOfType<Config[]>(path, value => this.isArrayOfType(value, this.isConfig));
  }

  public getSubsectionsOrNull(path: string): Config[] | undefined {
    return this.getOrNullOfType<Config[]>(path, value => this.isArrayOfType(value, this.isConfig));
  }

  public set(path: string, obj: any) {
    const pathParts = path.split('.');
    const nearestPath = pathParts[0];
    const updatedPath = this.currentPath ? `${this.currentPath}.${nearestPath}` : nearestPath;

    if (path.includes('.')) {
      const remainingPath = path.substring(nearestPath.length + 1);

      const section = this.getOrNull(nearestPath) as Config || new Config(this.logger, this.fileName, updatedPath);
      section.set(remainingPath, obj);
      this.values.set(updatedPath, section);
      return;
    }

    if (obj === null) {
      this.values.delete(updatedPath);
    } else {
      this.values.set(updatedPath, obj);
    }
  }

  private normalizeToConfig(obj: any): Map<string, any> {
    const normalized = new Map();

    for (const [key, value] of Object.entries(obj)) {
      if (key == null || value == null) continue;

      const stringKey = key.toString();
      normalized.set(stringKey, this.constrainConfigTypes(value, stringKey));
    }

    return normalized;
  }

  private constrainConfigTypes(value: any, path: string = '') {
    const updatedPath = this.currentPath ? `${this.currentPath}.${path}` : path;

    if (Array.isArray(value)) {
      if (!value.length) return [];
      return value.map((item, index) => {
        if (typeof item === 'object') {
          const config = new Config(this.logger, this.fileName, `${updatedPath}[${index}]`);
          config.init(item);
          return config;
        } else {
          return item;
        }
      });
    }

    if (typeof value === 'object') {
      const config = new Config(this.logger, this.fileName, updatedPath);
      config.init(value);
      return config;
    }

    if (typeof value === 'number' && !Number.isInteger(value)) {
      return value.toFixed(2);
    }

    return value;
  }
}
