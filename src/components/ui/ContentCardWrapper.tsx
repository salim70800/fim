import { Content } from '../../types/database'
import ContentCard from './ContentCard'

interface ContentCardWrapperProps {
  content: Content
}

export default function ContentCardWrapper({ content }: ContentCardWrapperProps) {
  return (
    <ContentCard
      id={content.id}
      title={content.title_ar}
      year={content.year}
      rating={content.imdb_rating || content.user_rating}
      posterUrl={content.poster_url}
      type={content.type}
      language={content.language}
    />
  )
}
