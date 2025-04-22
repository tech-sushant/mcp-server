import { startBrowserLiveSession } from '../../src/tools/live';
import { startBrowserSession } from '../../src/tools/live-utils/start-session';
import logger from '../../src/logger';
import { ensureLocalBinarySetup } from '../../src/lib/local';

// Mock the dependencies
jest.mock('../../src/tools/live-utils/start-session');
jest.mock('../../src/logger');
jest.mock('../../src/lib/local');
jest.mock('../../src/config', () => ({
  default: {
    config: {
      browserstackUsername: 'test',
      browserstackAccessKey: 'test',
    },
  },
}));

describe('startBrowserLiveSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    (startBrowserSession as jest.Mock).mockResolvedValue('https://live.browserstack.com/123456');
    (ensureLocalBinarySetup as jest.Mock).mockResolvedValue(null);
  });

  const validArgs = {
    desiredBrowser: 'Chrome',
    desiredOSVersion: '10',
    desiredURL: 'https://example.com',
    desiredOS: 'Windows',
    desiredBrowserVersion: '133.2'
  };

  it('should successfully start a browser session', async () => {
    const result = await startBrowserLiveSession(validArgs);

    expect(startBrowserSession).toHaveBeenCalledWith({
      browser: validArgs.desiredBrowser,
      os: validArgs.desiredOS,
      osVersion: validArgs.desiredOSVersion,
      url: validArgs.desiredURL,
      browserVersion: validArgs.desiredBrowserVersion
    });
    expect(result.content[0].text).toContain('Successfully started a browser session');
    expect(result.content[0].text).toContain('https://live.browserstack.com/123456');
  });

  it('should fail if browser is not provided', async () => {
    const args = { ...validArgs, desiredBrowser: '' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('You must provide a desiredBrowser');
  });

  it('should fail if URL is not provided', async () => {
    const args = { ...validArgs, desiredURL: '' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('You must provide a desiredURL');
  });

  it('should fail if OS is not provided', async () => {
    const args = { ...validArgs, desiredOS: '' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('You must provide a desiredOS');
  });

  it('should fail if OS version is not provided', async () => {
    const args = { ...validArgs, desiredOSVersion: '' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('You must provide a desiredOSVersion');
  });

  it('should fail if browser version is not provided', async () => {
    const args = { ...validArgs, desiredBrowserVersion: '' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('You must provide a desiredBrowserVersion');
  });

  it('should fail if URL is invalid', async () => {
    const args = { ...validArgs, desiredURL: 'invalid-url' };
    await expect(startBrowserLiveSession(args)).rejects.toThrow('The provided URL is invalid');
    expect(logger.error).toHaveBeenCalled();
  });

  it('should handle session start failure', async () => {
    (startBrowserSession as jest.Mock).mockRejectedValue(new Error('Session start failed'));
    await expect(startBrowserLiveSession(validArgs)).rejects.toThrow('Session start failed');
  });

  it('should handle localhost URLs', async () => {
    const localArgs = { ...validArgs, desiredURL: 'http://localhost:3000' };
    const result = await startBrowserLiveSession(localArgs);
    expect(result.content[0].text).toContain('Successfully started a browser session');
  });

  it('should handle HTTPS URLs', async () => {
    const httpsArgs = { ...validArgs, desiredURL: 'https://example.com' };
    const result = await startBrowserLiveSession(httpsArgs);
    expect(result.content[0].text).toContain('Successfully started a browser session');
  });

  it('should handle different browser types', async () => {
    const browsers = ['Chrome', 'IE', 'Safari', 'Edge'];
    for (const browser of browsers) {
      const args = { ...validArgs, desiredBrowser: browser };
      const result = await startBrowserLiveSession(args);
      expect(result.content[0].text).toContain('Successfully started a browser session');
    }
  });

  it('should handle different OS types', async () => {
    const osTypes = ['Windows', 'macOS', 'iOS', 'Android'];
    for (const os of osTypes) {
      const args = { ...validArgs, desiredOS: os };
      const result = await startBrowserLiveSession(args);
      expect(result.content[0].text).toContain('Successfully started a browser session');
    }
  });
}); 