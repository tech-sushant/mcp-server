export const signedUrlMap = new Map<string, object>();
export const testFilePathsMap = new Map<string, string[]>();

let _storedPercyResults: any = null;

export const storedPercyResults = {
  get: () => _storedPercyResults,
  set: (value: any) => {
    _storedPercyResults = value;
  },
};
