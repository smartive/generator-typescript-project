export interface Answers {
  name: string;
  description?: string;
  type: 'library' | 'application';
  gitUser: string;
  gitEmail: string;
}
