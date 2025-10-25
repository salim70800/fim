import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroSlide {
  id: number
  title: string
  description: string
  year?: number
  genres?: string[]
  backdropUrl: string
  type: 'movie' | 'series' | 'anime'
  rating?: number
}

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  if (slides.length === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-extra-slow ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.backdropUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/80" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-hero font-bold text-neutral-200 mb-4 leading-tight">
                {slide.title}
              </h1>
              
              <p className="text-body-large text-neutral-400 mb-6 line-clamp-3">
                {slide.description}
              </p>

              <div className="flex items-center gap-4 mb-8 text-small text-neutral-400">
                {slide.year && <span>{slide.year}</span>}
                {slide.rating && (
                  <span className="flex items-center gap-1">
                    ⭐ {slide.rating.toFixed(1)}
                  </span>
                )}
                {slide.genres && slide.genres.length > 0 && (
                  <div className="flex gap-2">
                    {slide.genres.slice(0, 3).map((genre, i) => (
                      <span key={i} className="bg-neutral-800 px-3 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Link
                  to={`/watch/${slide.type}/${slide.id}`}
                  className="px-8 py-3 bg-primary-500 text-neutral-950 rounded-md font-semibold flex items-center gap-2 hover:bg-primary-400 hover:shadow-glow-primary transition-all duration-fast"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>مشاهدة الآن</span>
                </Link>
                
                <button className="px-8 py-3 bg-transparent border-2 border-primary-500 text-primary-500 rounded-md font-semibold hover:bg-primary-500 hover:text-neutral-950 transition-all duration-fast">
                  المزيد من التفاصيل
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200 rounded-full backdrop-blur-sm transition-all duration-fast opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200 rounded-full backdrop-blur-sm transition-all duration-fast opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-normal ${
              index === currentIndex
                ? 'w-8 bg-primary-500 shadow-glow-primary'
                : 'bg-neutral-600 hover:bg-neutral-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
