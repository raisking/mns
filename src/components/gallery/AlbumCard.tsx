import { Link } from 'react-router-dom';
import type { Album } from '../../types/Album';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const date = album.eventDate
    ? new Date(album.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <Link to={`/gallery/${album.slug}`} className="group block">
      <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {album.coverPhoto ? (
            <img
              src={album.coverPhoto}
              alt={album.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-5xl">🖼️</span>
            </div>
          )}
          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg">
            {album.photoCount} photos
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#C41E3A] transition-colors">
            {album.title}
          </h3>
          {date && <p className="text-sm text-gray-500 mt-1">{date}</p>}
          {album.description && (
            <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{album.description}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
