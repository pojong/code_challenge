import React, { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { ITrackMetadata } from "../../api/types";
import {deleteTrackFn, getTrackImageFn} from "../../api/trackMetadataApi";

type TrackMetadataItemProps = {
  track: ITrackMetadata;
};

const TrackItem: FC<TrackMetadataItemProps> = ({ track }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openTrackModal, setOpenTrackModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);


  // My addition
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${track.name}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [track.queryString]);

  const queryClient = useQueryClient();
  const { mutate: deleteTrackItem } = useMutation({
    mutationFn: (queryString: string) => deleteTrackFn(queryString),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries({queryKey:["getTracks"]});
      toast("Track deleted successfully", {
        type: "warning",
        position: "top-right",
      });
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
      NProgress.done();
    },
  });

  const onDeleteHandler = (queryString: string) => {
    if (window.confirm("Are you sure")) {
      deleteTrackItem(queryString);
    }
  };

    useEffect(() => {
        const fetchImage = async (queryString:string) => {
            try {
                const response = await getTrackImageFn(queryString)
                //const imageBlob = await response.data;
                const objectURL = URL.createObjectURL(response);
                setImageUrl(objectURL);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        };

        fetchImage(track.queryString);

        // Clean up the object URL when the component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, []);
  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md flex flex-col justify-between overflow-hidden">
         <div>
             <img src={imageUrl}></img>
         </div>
        <div className="details">
          <p className="mb-2 pb-2 text-2xl font-semibold tracking-tight text-gray-900">
              <label>Track Name:</label>&nbsp;&nbsp;
              {track.name.length > 40
              ? track.name.substring(0, 40) + "..."
              : track.name}
          </p>
            <p className="text-ct-dark-100 text-sm">
                <label>Artist Name:</label>&nbsp;&nbsp;
                {track.artistName.length > 210
                    ? track.artistName.substring(0, 210) + "..."
                    : track.artistName}
            </p>
            <p className="text-ct-dark-100 text-sm">
                <label>Album Name:</label>&nbsp;&nbsp;
                {track.albumName.length > 210
                    ? track.albumName.substring(0, 210) + "..."
                    : track.albumName}
            </p>
            <p className="text-ct-dark-100 text-sm">
                <label>Artist ID:</label>&nbsp;&nbsp;
                {track.albumId.length > 210
                    ? track.albumId.substring(0, 210) + "..."
                    : track.albumId}
            </p>
            <p className="text-ct-dark-100 text-sm">
                <label>Explicit:</label>&nbsp;&nbsp;
                {track.isExplicit?"True":"False"}
            </p>
            <p className="text-ct-dark-100 text-sm">
                <label>Play Back:</label>&nbsp;&nbsp;
                {track.playBackSeconds}
            </p>
        </div>
        <div className="relative border-t border-slate-300 flex justify-between items-center">
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="text-ct-dark-100 text-lg cursor-pointer"
          >
            <i className="bx bx-dots-horizontal-rounded"></i>
          </div>
          <div
            id={`settings-dropdown-${track.name}`}
            className={twMerge(
              `absolute right-0 bottom-3 z-10 w-28 text-base list-none bg-white rounded divide-y divide-gray-100 shadow`,
              `${openSettings ? "block" : "hidden"}`
            )}
          >
            <ul className="py-1" aria-labelledby="dropdownButton">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(track.queryString);
                }}
                className="py-2 px-4 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                <i className="bx bx-trash"></i> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackItem;
