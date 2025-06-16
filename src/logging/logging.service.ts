import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LoggingService implements LoggerService {
    private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
    private logDirectory = 'logs';
    private maxFileSize = Number(process.env.LOG_MAX_FILE_SIZE_KB || 1024) * 1024;
    private currentFileSize = 0;
    private currentFile = 'application.log';
    private errorFile = 'error.log';

    constructor() {
        this.initializeLogDirectory();
        this.rotateLogsIfNeeded();
    }

    private initializeLogDirectory() {
        if (!existsSync(this.logDirectory)) {
            mkdirSync(this.logDirectory);
        }
    }

    private rotateLogsIfNeeded() {
        const logPath = join(this.logDirectory, this.currentFile);
        if (existsSync(logPath)) {
            const stats = require('fs').statSync(logPath);
            this.currentFileSize = stats.size;
        }
    }

    private shouldRotate(message: string): boolean {
        return this.currentFileSize + Buffer.byteLength(message) > this.maxFileSize;
    }

    private rotateLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newFilename = `application-${timestamp}.log`;
        require('fs').renameSync(
            join(this.logDirectory, this.currentFile),
            join(this.logDirectory, newFilename),
        );
        this.currentFileSize = 0;
    }

    private writeLog(level: string, message: string, context?: string, stack?: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${context ? `[${context}] ` : ''}${message}${
            stack ? `\n${stack}` : ''
        }\n`;

        if (this.shouldRotate(logMessage)) {
            this.rotateLogFile();
        }

        appendFileSync(join(this.logDirectory, this.currentFile), logMessage);
        this.currentFileSize += Buffer.byteLength(logMessage);

        if (level === 'error') {
            appendFileSync(join(this.logDirectory, this.errorFile), logMessage);
        }
    }

    log(message: string, context?: string) {
        if (this.logLevels.includes('log')) {
            this.writeLog('LOG', message, context);
        }
    }

    error(message: string, trace: string, context?: string) {
        if (this.logLevels.includes('error')) {
            this.writeLog('ERROR', message, context, trace);
        }
    }

    warn(message: string, context?: string) {
        if (this.logLevels.includes('warn')) {
            this.writeLog('WARN', message, context);
        }
    }

    debug(message: string, context?: string) {
        if (this.logLevels.includes('debug')) {
            this.writeLog('DEBUG', message, context);
        }
    }

    verbose(message: string, context?: string) {
        if (this.logLevels.includes('verbose')) {
            this.writeLog('VERBOSE', message, context);
        }
    }

    setLogLevels(levels: LogLevel[]) {
        this.logLevels = levels;
    }
}