import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

//useSWR-fetcher without advanced error-handling:
// const fetcher = (...args) => fetch(...args).then((res) => res.json());

//useSWR-fetcher with advanced error-handling:
const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

//fetch-URL:
const URL = "https://api.wheretheiss.at/v1/satellites/25544";

//
export default function ISSTracker() {
  //useSWR-hook with error-handling, refreshInterval and mutate-function to fetch data programmatically (here: clicking the "Refresh" button)
  const { data, error, isLoading, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  console.log(data);

  return (
    <main>
      <Map longitude={data.longitude} latitude={data.latitude} />
      <Controls
        longitude={data.longitude}
        latitude={data.latitude}
        onRefresh={() => mutate()}
      />
    </main>
  );
}
