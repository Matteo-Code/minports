export interface UnusedImport {
  file: string;
  unused: string[];
}

export interface AnalysisReport {
  imports: UnusedImport[];
  packages: string[];
}
