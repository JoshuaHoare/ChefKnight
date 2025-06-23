export interface GitStatus {
  branch: string;
  commit: string;
  dirty: boolean;
  empty: boolean;
}

export interface ContentStatus {
  status: string;
  version: string;
  folders: string[];
  content: Record<string, string[]>;
  git: GitStatus;
  timestamp: number;
}

export interface ContentFile {
  path: string;
  content: string;
  metadata?: Record<string, any>;
}
