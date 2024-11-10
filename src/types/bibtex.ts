export type BibTeXEntry = {
  type: string;  // e.g., 'article', 'book'
  key: string;
  author?: string;
  authors?: string;
  title?: string;
  journal?: string;
  year?: string;
  volume?: string;
  number?: string;
  pages?: string;
  instutition?: string;
};
