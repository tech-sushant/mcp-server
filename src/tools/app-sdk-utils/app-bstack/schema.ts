// Zod validation schemas for App SDK utilities
import { z } from "zod";
import {
  AppSDKSupportedLanguageEnum,
  AppSDKSupportedFrameworkEnum,
  AppSDKSupportedTestingFrameworkEnum,
  AppSDKSupportedPlatformEnum,
} from "./types.js";

// Base validation schemas
export const AppSDKLanguageSchema = z.nativeEnum(AppSDKSupportedLanguageEnum);
export const AppSDKFrameworkSchema = z.nativeEnum(AppSDKSupportedFrameworkEnum);
export const AppSDKTestingFrameworkSchema = z.nativeEnum(
  AppSDKSupportedTestingFrameworkEnum,
);
export const AppSDKPlatformSchema = z.nativeEnum(AppSDKSupportedPlatformEnum);

// Input validation schemas
export const AppSDKSetupInputSchema = z.object({
  language: AppSDKLanguageSchema,
  framework: AppSDKFrameworkSchema,
  testingFramework: AppSDKTestingFrameworkSchema,
  username: z.string().min(1, "Username is required"),
  accessKey: z.string().min(1, "Access key is required"),
  platforms: z
    .array(AppSDKPlatformSchema)
    .min(1, "At least one platform is required"),
  appPath: z.string().optional(),
});

export type AppSDKSetupInput = z.infer<typeof AppSDKSetupInputSchema>;

// Configuration validation schema
export const AppSDKConfigSchema = z.object({
  userName: z.string(),
  accessKey: z.string(),
  framework: z.string().optional(),
  app: z.string(),
  platforms: z.array(
    z.object({
      platformName: z.string(),
      deviceName: z.string(),
      platformVersion: z.string(),
    }),
  ),
  parallelsPerPlatform: z.number().positive().default(1),
  browserstackLocal: z.boolean().default(true),
  buildName: z.string().default("bstack-demo"),
  projectName: z.string().default("BrowserStack Sample"),
  debug: z.boolean().default(true),
  networkLogs: z.boolean().default(true),
  percy: z.boolean().default(false),
  percyCaptureMode: z.string().default("auto"),
  accessibility: z.boolean().default(false),
});

export type AppSDKConfig = z.infer<typeof AppSDKConfigSchema>;

// Result validation schemas
export const AppSDKInstructionSchema = z.object({
  content: z.string(),
  type: z.enum(["setup", "config", "run", "info"]),
});

export const AppSDKResultSchema = z.object({
  success: z.boolean(),
  instructions: z.array(AppSDKInstructionSchema),
  error: z.string().optional(),
});

export type AppSDKResultType = z.infer<typeof AppSDKResultSchema>;

// Validation functions
export function validateAppSDKSetupInput(input: unknown): AppSDKSetupInput {
  return AppSDKSetupInputSchema.parse(input);
}

export function validateAppSDKConfig(config: unknown): AppSDKConfig {
  return AppSDKConfigSchema.parse(config);
}

export function validateAppSDKResult(result: unknown): AppSDKResultType {
  return AppSDKResultSchema.parse(result);
}

// Partial validation for optional fields
export const PartialAppSDKSetupInputSchema = AppSDKSetupInputSchema.partial({
  username: true,
  accessKey: true,
  appPath: true,
  platforms: true,
});

export type PartialAppSDKSetupInput = z.infer<
  typeof PartialAppSDKSetupInputSchema
>;

export function validatePartialAppSDKSetupInput(
  input: unknown,
): PartialAppSDKSetupInput {
  return PartialAppSDKSetupInputSchema.parse(input);
}
