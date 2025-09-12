import axios  from "axios";
import {IGenericResponse, ITrackMetadata} from "./types";

const API_URL = "http://localhost:8080/code_challenge/";

export const trackMetadataApi = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});

function addItemInLocalStorage(newItem: ITrackMetadata): void {
    const storedArrayString = localStorage.getItem('tracks');
    let existingArray: ITrackMetadata[];
    if (storedArrayString) {
        try {
            existingArray = JSON.parse(storedArrayString) as ITrackMetadata[];
        } catch (e) {
            console.error("Error parsing localStorage item:", e);
            existingArray = [];
        }
    } else {
        existingArray = [];
    }
    if (!existingArray.length && !existingArray.some(item => item.queryString === newItem.queryString)) {
        existingArray.push(newItem);
        const updatedArrayString = JSON.stringify(existingArray);
        localStorage.setItem('tracks', updatedArrayString);
    }
}
function removeItemInLocalStorage(itemIdToRemove: string): void {
    const storedItemsString = localStorage.getItem('tracks');
    let items: ITrackMetadata[] = storedItemsString ? JSON.parse(storedItemsString) : [];
    const updatedItems = items.filter(item => item.queryString !== itemIdToRemove);
    localStorage.setItem('tracks', JSON.stringify(updatedItems));
}
// trackMetadataApi.defaults.headers.common["content-type"] = "application/json";

export const deleteTrackFn = async (queryString: string) => {
    removeItemInLocalStorage(queryString);
    return new Promise<void>((resolve) => {resolve();});
};

export const getSingleTrackFn = async (isrc: string) => {
  const response = await trackMetadataApi.get<ITrackMetadata>(`getTrackMetadata?src=${isrc}`);
  return response.data;
};

export const getTracksFn= async (): Promise<ITrackMetadata[]> => {
      // Simulate API call
      let tracks = JSON.parse(localStorage.getItem("tracks") || "[]");
      return new Promise((resolve) => setTimeout(() => resolve(tracks), 500));
  };

export const searchAndReadFn = async (isrc: string) => {
  const response = await trackMetadataApi.get(`createTrack?query=${isrc}`);
  const track = await getSingleTrackFn(isrc);
  addItemInLocalStorage(track);
  return track;
};

export const getTrackImageFn = async (queryString: string) => {
  const response = await trackMetadataApi.get<Blob>(`getCover?queryString=${queryString}`, {responseType: 'blob'});
  return response.data;
};

