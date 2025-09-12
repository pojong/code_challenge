import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {searchAndReadFn} from "../../api/trackMetadataApi";
import NProgress from "nprogress";

type ISearchMetadataProps = {
  setOpenTrackModal: (open: boolean) => void;
};

const searchTrackMetadata = object({
  search: string().min(1, "Search is required"),
});

export type SearchTrackInput = TypeOf<typeof searchTrackMetadata>;

const Search_track_item: FC<ISearchMetadataProps> = ({ setOpenTrackModal }) => {
  const methods = useForm<SearchTrackInput>({
    resolver: zodResolver(searchTrackMetadata),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const queryClient = useQueryClient();

  const { mutate: searchTrack, isPending } = useMutation({
    mutationFn: (track: SearchTrackInput) => searchAndReadFn(track.search),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTracks"] });
      setOpenTrackModal(false);
      NProgress.done();
      toast("Done searching...", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenTrackModal(false);
      NProgress.done();
      const resMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<SearchTrackInput> = async (data) => {
    searchTrack(data);
  };
  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Search Track</h2>
        <div
          onClick={() => setOpenTrackModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="Search">
            Search
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["search"] && "border-red-500"}`
            )}
            {...methods.register("search")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["search"] && "visible"}`
            )}
          >
            {errors["search"]?.message as string}
          </p>
        </div>
        <LoadingButton loading={isPending}>Search</LoadingButton>
      </form>
    </section>
  );
};

export default Search_track_item;