import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const [searchBarData, setSearchBarData] = useState({
    searchTerms: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchBarData({ ...searchBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSearchBarData({ ...searchBarData, searchTerms: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSearchBarData({
        ...searchBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSearchBarData({ ...searchBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchBarData.searchTerms);
    urlParams.set("type", searchBarData.type);
    urlParams.set("parking", searchBarData.parking);
    urlParams.set("furnished", searchBarData.furnished);
    urlParams.set("offer", searchBarData.offer);
    urlParams.set("sort", searchBarData.sort);
    urlParams.set("order", searchBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermURL = urlParams.get("searchTerm");
    const typeURL = urlParams.get("type");
    const parkingURL = urlParams.get("parking");
    const furnishedURL = urlParams.get("furnished");
    const offerURL = urlParams.get("offer");
    const sortURL = urlParams.get("sort");
    const orderURL = urlParams.get("order");

    if (
      searchTermURL ||
      typeURL ||
      parkingURL ||
      furnishedURL ||
      offerURL ||
      sortURL ||
      orderURL
    ) {
      setSearchBarData({
        searchTerms: searchTermURL || "",
        type: typeURL || "all",
        parking: parkingURL === "true" ? true : false,
        furnished: furnishedURL === "true" ? true : false,
        offer: offerURL === "true" ? true : false,
        sort: sortURL || "createdAt",
        order: orderURL || "desc",
      });
    }

    const getListings = async () => {
      setShowMore(false);
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings/get-listings?${searchQuery}`);
        const data = await res.json();

        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }

        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
      }
    };

    getListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const showMoreHandler = async () => {
    const numOfListings = listings.length;
    const startIndex = numOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/listings/get-listings?${searchQuery}`);
    const data = await res.json();

    if(data.length < 9) {
      setShowMore(false);
    }

    setListings([...listings, ...data]);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..,"
              className="border rounded-lg p-3 w-full"
              value={searchBarData.searchTerms}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={searchBarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              defaultValue={"created_at_desc"}
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No Listing found.</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={showMoreHandler}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
