export interface IPost {
  id: string;
  title: string;
  author: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  category: string;
  lastUpdated: string;
  publishDate: string;
}
