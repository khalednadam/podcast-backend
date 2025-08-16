export type Episode = {
  episodeUrl: string;
  artistIds: number[];
  artworkUrl160: string;
  episodeFileExtension: string;
  episodeContentType: string;
  artworkUrl600: string;
  trackViewUrl: string;
  genres: { name: string; id: string }[];
  episodeGuid: string;
  shortDescription: string;
  collectionId: number;
  collectionName: string;
  trackId: number;
  trackName: string;
  releaseDate: string;
  feedUrl: string;
  closedCaptioning: string;
  kind: string;
  wrapperType: string;
  description: string;
  country: string;
  previewUrl: string;
  collectionViewUrl: string;
  artworkUrl60: string;
  trackTimeMillis: number;
  contentAdvisoryRating: string;
};

export type EpisodesResults = {
  resultCount: number;
  results: Episode[];
};
