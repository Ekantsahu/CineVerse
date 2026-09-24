import mongoose from "mongoose";
import dotenv from "dotenv";

import Movie from "./models/Movie.js";
import Genre from "./models/Genre.js";

dotenv.config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  accept: "application/json",
};

/*
  TMDB official movie genres
*/
const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
  { id: 18, name: "Drama" },
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchTMDB = async (url) => {
  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `TMDB Error ${response.status}: ${errorText}`
    );
  }

  return response.json();
};

const seedMovies = async () => {
  try {
    if (!process.env.TMDB_ACCESS_TOKEN) {
      throw new Error(
        "TMDB_ACCESS_TOKEN is missing from your .env file"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");
    console.log("Starting TMDB movie import...\n");

    /*
      Create/find our local genres
    */

    const genreMap = {};

    for (const genre of genres) {
      const localGenre = await Genre.findOneAndUpdate(
        { name: genre.name },
        {
          $setOnInsert: {
            name: genre.name,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      genreMap[genre.id] = localGenre._id;
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    /*
      Import 5 movies from each genre.

      18 genres × 5 movies = up to 90 movies.
    */

    for (const genre of genres) {
      console.log(`\n🎬 ${genre.name}`);

      const discoverUrl =
        `${TMDB_BASE_URL}/discover/movie` +
        `?language=en-US` +
        `&include_adult=false` +
        `&include_video=false` +
        `&sort_by=popularity.desc` +
        `&vote_count.gte=20` +
        `&with_genres=${genre.id}` +
        `&page=1`;

      const discoverData = await fetchTMDB(discoverUrl);

      const movies = discoverData.results
        .filter((movie) => movie.poster_path)
        .filter((movie) => movie.release_date)
        .slice(0, 5);

      for (const movie of movies) {
        try {
          /*
            Get full movie details + cast
          */

          const detailsUrl =
            `${TMDB_BASE_URL}/movie/${movie.id}` +
            `?language=en-US` +
            `&append_to_response=credits`;

          const details = await fetchTMDB(detailsUrl);

          /*
            Get first 8 cast members
          */

          const cast =
            details.credits?.cast
              ?.slice(0, 8)
              .map((person) => person.name)
              .filter(Boolean) || [];

          const year = details.release_date
            ? Number(details.release_date.substring(0, 4))
            : 0;

          if (!year || !details.title) {
            skipped++;
            continue;
          }

          const movieData = {
            name: details.title,

            image: details.poster_path
              ? `${TMDB_IMAGE_URL}${details.poster_path}`
              : "",

            year,

            detail:
              details.overview ||
              "No description available.",

            cast,

            rating: Number(
              Number(details.vote_average || 0).toFixed(1)
            ),

            genre: genreMap[genre.id],

            numReviews: 0,

            reviews: [],
          };

          /*
            Avoid duplicates using movie name.
          */

          const existingMovie = await Movie.findOne({
            name: details.title,
          });

          if (existingMovie) {
            await Movie.findByIdAndUpdate(
              existingMovie._id,
              movieData,
              {
                new: true,
              }
            );

            updated++;

            console.log(`  ↻ Updated: ${details.title}`);
          } else {
            await Movie.create(movieData);

            imported++;

            console.log(`  ✓ Added: ${details.title}`);
          }

          /*
            Small delay between detail requests
          */

          await sleep(150);
        } catch (movieError) {
          console.error(
            `  ✗ Failed: ${movie.title}`,
            movieError.message
          );
        }
      }
    }

    console.log("\n================================");
    console.log("TMDB IMPORT COMPLETE");
    console.log("================================");
    console.log(`Added:   ${imported}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log("================================\n");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Import failed:");
    console.error(error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedMovies();