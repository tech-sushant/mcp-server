import { LiveConfigMapping } from "./types";

export const SUPPORTED_LIVE_CONFIGURATIONS: LiveConfigMapping = {
    "android": {
        "chrome": {
            "version": "100"
        },
        "firefox": {
            "version": "100"
        },
        "safari": {
            "version": "100"
        },
        "samsung browser": {
            "version": "100"
        },
        "internet-explorer": {
            "version": "100"
        }
    },
    "ios": {
        "chrome": {
            "version": "100"
        },
        "firefox": {
            "version": "100"
        },
        "edge": {
            "version": "100"
        },
        "safari": {
            "version": "100"
        },
        "samsung browser": {
            "version": "100"
        },
        "internet-explorer": {
            "version": "100"
        }
    },
    "windows": {
        "chrome": {
            "version": "100"
        },
        "firefox": {
            "version": "100"
        },
        "edge": {
            "version": "100"
        },
        "safari": {
            "version": "100"
        },
        "samsung browser": {
            "version": "100"
        },
        "internet-explorer": {
            "version": "100"
        }
    },
    "macos": {
        "chrome": {
            "version": "100"
        },
        "firefox": {
            "version": "100"
        },
        "edge": {
            "version": "100"
        },
        "safari": {
            "version": "100"
        },
        "samsung browser": {
            "version": "100"
        },
        "internet-explorer": {
            "version": "100"
        }
    }
} as const;
