export interface BuildPluginHbsConfig {
  srcPatterns: string[];
  partialPatterns: string[];
  dataPatterns: string[];
  enableRuntimeBuild: boolean;
  enableRuntimeBuildMinify: boolean;
  runtimeBuildPath: string;
  runtimeBuildNamespace: string;
}