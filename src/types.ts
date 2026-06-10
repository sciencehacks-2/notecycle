export interface Note {
  id: string;
  title: string;
  titleBn?: string;
  subject: string;
  subjectBn?: string;
  institution: string;
  institutionBn?: string;
  course: string;
  courseBn?: string;
  price: number;
  author: string;
  authorBn?: string;
  rating: number;
  ratingCount: number;
  downloadCount: number;
  pageCount: number;
  fileType: string;
  description: string;
  descriptionBn?: string;
  previewSnippet: string[];
  previewSnippetBn?: string[];
  tags: string[];
  uploadDate: string;
  sellerEmail: string;
  thumbnailSeed: string;
  featured?: boolean;
  isOfficialTextbook?: boolean;
  classLevel?: string; // Class 6, Class 7, Class 8, Class 9, Class 10
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: string;
  title: string;
  titleBn?: string;
  price: number;
  subject: string;
  subjectBn?: string;
  author: string;
  authorBn?: string;
}

export interface UserState {
  balance: number;
  purchasedNoteIds: string[];
  cart: CartItem[];
  listedNotes: Note[];
}
