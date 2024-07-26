import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as zlib from 'zlib';

class LogManager {
  logFilePath: string;
  logFile: fs.WriteStream;

  constructor() {
    this.logFilePath = './logs/latest.log';
    this.logFile = fs.createWriteStream(this.logFilePath, { flags: 'a' });
  }

  private stripColors(text: string) {
    return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nq-uy=><]/g, '');
  }

  private async rotateLogFile() {
    const fileSizeInLines = await this.countFileLines(this.logFilePath);

    if (fileSizeInLines >= 1000) {
      this.logFile.end();

      const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
      const newLogFileName = `./logs/log-${timestamp}.log`;

      await fsp.rename(this.logFilePath, newLogFileName);

      const gzip = zlib.createGzip();
      const readStream = fs.createReadStream(newLogFileName);
      const writeStream = fs.createWriteStream(`${newLogFileName}.gz`);
      readStream.pipe(gzip).pipe(writeStream).on('finish', async () => {
        await fsp.unlink(newLogFileName);
      });

      this.logFile = fs.createWriteStream(this.logFilePath, { flags: 'a' });
    }
  }

  private countFileLines(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      let lineCount = 0;
      fs.createReadStream(filePath)
        .on('data', (buffer) => {
          let idx = -1;
          lineCount--;
          do {
            idx = buffer.indexOf("10", idx + 1);
            lineCount++;
          } while (idx !== -1);
        })
        .on('end', () => resolve(lineCount))
        .on('error', reject);
    });
  }

  public async log(message: string): Promise<void> {
    await this.rotateLogFile();
    this.logFile.write(this.stripColors(message) + '\n');
  }
}

const logManager = new LogManager();
export default logManager;
