import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoadingSpinner from '@/components/LoadingSpinner'

const HomePage = lazy(() => import('@/pages/HomePage'))
const MoviesPage = lazy(() => import('@/pages/MoviesPage'))
const SeriesPage = lazy(() => import('@/pages/SeriesPage'))
const AnimePage = lazy(() => import('@/pages/AnimePage'))
const MovieDetailsPage = lazy(() => import('@/pages/MovieDetailsPage'))
const SeriesDetailsPage = lazy(() => import('@/pages/SeriesDetailsPage'))
const AnimeDetailsPage = lazy(() => import('@/pages/AnimeDetailsPage'))
const SingleEpisodePage = lazy(() => import('@/pages/SingleEpisodePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <Navbar />
      <main className="pb-16">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'series', element: <SeriesPage /> },
      { path: 'anime', element: <AnimePage /> },
      { path: 'movie/:slug', element: <MovieDetailsPage /> },
      { path: 'series/:slug', element: <SeriesDetailsPage /> },
      { path: 'anime/:slug', element: <AnimeDetailsPage /> },
      { path: 'episode/:id', element: <SingleEpisodePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
