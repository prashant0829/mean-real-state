import { useState, useEffect } from "react";

const CreateListing = () => {
  return (
    <main className="p-2 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="listingType"
                className="w-5"
                value="sell"
              />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="listingType"
                className="w-5"
                value="rent"
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="regualarPrice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">(&#8377; / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg"
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                required
              />

              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-sm">(&#8377; / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover(max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-2 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-2 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-2 bg-slate-700 text-white rounded-lg hover:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
