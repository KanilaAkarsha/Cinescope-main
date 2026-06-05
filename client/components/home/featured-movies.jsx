import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import MoviesList from '@/components/home/movies-list';
import { MovieListSkeleton } from '@/components/home/movies-list';
import MovieSelectors from '@/app/admin/movies/movie-selectors';

export default function FeaturedMovies() {
  return (
    <section id='featured-movies' className="container px-4 py-12 md:px-6">
        {/* Heading area */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Movies</h2>
            <p className="text-muted-foreground">Our section of must-watch films</p>
        </div>

        <Button variant="outline">View All</Button>
        </div>

        {/* Movie search */}
        <MovieSelectors />

        {/*  Movies List */}
        <Suspense fallback={<MovieListSkeleton/>} >
        <MoviesList/>
        </Suspense>
    </section>
  );
}