import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getTracksFn } from "./api/trackMetadataApi";
import TrackModal from "./components/track.modal";
import Search_track_item from "./components/tracks/search_track_item";
import TrackItem from "./components/tracks/track_item.component";
import NProgress from "nprogress";
import {ITrackMetadata} from "./api/types";


type TracksItemProps = {
    tracks: ITrackMetadata[];
};

function AppContent() {

  const [openTrackModal, setOpenTrackModal] = useState(false);

  const {
    data: tracks,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["getTracks"],
    queryFn: () => getTracksFn(),
    staleTime: 5 * 1000
  });
    useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }
  }, [isLoading, isFetching]);

    useEffect(() => {
        if (error) {
            const resMessage =
                (error as any).response?.data?.message ||
                (error as any).response?.data?.detail ||
                (error as any).message ||
                error.toString();
            toast(resMessage, {
                type: "error",
                position: "top-right",
            });
            NProgress.done();
        }
    }, [error]);


    // @ts-ignore
    // @ts-ignore
    return (
    <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
      <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
        <div className="p-4 min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
          <div
            onClick={() => setOpenTrackModal(true)}
            className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-ct-blue-600 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenTrackModal(true)}
            className="text-lg font-medium text-ct-blue-600 mt-5 cursor-pointer"
          >
            Search and Add Track
          </h4>
        </div>

        { tracks?.map((track) => (
          <TrackItem key={track.queryString} track={track} />
        ))}

        {/* Seach Track Modal */}
        <TrackModal
          openTrackModal={openTrackModal}
          setOpenTrackModal={setOpenTrackModal}
        >
          <Search_track_item setOpenTrackModal={setOpenTrackModal} />
        </TrackModal>
      </div>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
