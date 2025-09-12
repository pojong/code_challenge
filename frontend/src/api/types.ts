export type ITrackMetadata = {
  queryString: string;
  name: string;
  artistName: string;
  albumName: string;
  albumId: string;
  isExplicit: boolean;
  playBackSeconds: number;
};

export type IGenericResponse = {
  status: string;
  message: string;
};

export type ITrackResponse = {
  status: string;
  track: ITrackMetadata;
};

export type ITrackMetadatasResponse = {
  status: string;
  results: number;
  tracks: ITrackMetadata[];
};
