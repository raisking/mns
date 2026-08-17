export interface Post {
  id: string;
  author: string;
  /** Small byline shown under the author, e.g. "posted to Nepali School - Marietta" */
  context?: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  content: string;
  /** Link back to the original Facebook post */
  link?: string;
  reply?: {
    author: string;
    text: string;
  };
}
