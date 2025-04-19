import { getFailuresInLastRun } from '../../src/tools/observability';
import { getLatestO11YBuildInfo } from '../../src/lib/api';

// Mock the API module
jest.mock('../../src/lib/api', () => ({
  getLatestO11YBuildInfo: jest.fn(),
}));

describe('getFailuresInLastRun', () => {
  const mockBuildName = 'demo-application';
  const mockProjectName = 'Default Project';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted response with observability URL and error details', async () => {
    // Mock successful API response
    // Refer to https://www.browserstack.com/docs/test-observability/api/get-latest-build-details 
    const mockGetLatestO11YBuildInfo = getLatestO11YBuildInfo as jest.MockedFunction<typeof getLatestO11YBuildInfo>;
    mockGetLatestO11YBuildInfo.mockResolvedValue({
      observability_url: 'https://example.com/observability',
      unique_errors: {
        overview: {
          insight: '1 failure caused by 1 unique error'
        },
        top_unique_errors: [
          { error: 'Test error message 1' },
          { error: 'Test error message 2' }
        ]
      }
    });

    const result = await getFailuresInLastRun(mockBuildName, mockProjectName);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('https://example.com/observability');
    expect(result.content[0].text).toContain('1 failure caused by 1 unique error');
    expect(result.content[0].text).toContain('Test error message 1');
    expect(result.content[0].text).toContain('Test error message 2');
  });

  it('should handle missing observability URL', async () => {
    const mockGetLatestO11YBuildInfo = getLatestO11YBuildInfo as jest.MockedFunction<typeof getLatestO11YBuildInfo>;
    mockGetLatestO11YBuildInfo.mockResolvedValue({
      unique_errors: {
        overview: {
          insight: 'No failures'
        }
      }
    });

    await expect(getFailuresInLastRun(mockBuildName, mockProjectName))
      .rejects
      .toThrow('No observability URL found in build data');
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error';
    const mockGetLatestO11YBuildInfo = getLatestO11YBuildInfo as jest.MockedFunction<typeof getLatestO11YBuildInfo>;
    mockGetLatestO11YBuildInfo.mockRejectedValue(new Error(errorMessage));

    await expect(getFailuresInLastRun(mockBuildName, mockProjectName))
      .rejects
      .toThrow(errorMessage);
  });

  it('should handle missing error details gracefully', async () => {
    const mockGetLatestO11YBuildInfo = getLatestO11YBuildInfo as jest.MockedFunction<typeof getLatestO11YBuildInfo>;
    mockGetLatestO11YBuildInfo.mockResolvedValue({
      observability_url: 'https://example.com/observability',
      unique_errors: {}
    });

    const result = await getFailuresInLastRun(mockBuildName, mockProjectName);

    expect(result.content[0].text).toContain('No overview available');
    expect(result.content[0].text).toContain('No error details available');
  });
}); 