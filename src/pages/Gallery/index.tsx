import { mockAlbums } from '../../data/mockData';
import SectionHeader from '../../components/common/SectionHeader';
import PageHero from '../../components/common/PageHero';
import AlbumCard from '../../components/gallery/AlbumCard';
import EmptyState from '../../components/common/EmptyState';

export default function Gallery() {
  const publicAlbums = mockAlbums.filter(a => a.status === 'public');

  return (
    <>
      <PageHero title="Community Gallery" subtitle="Browse our photo albums from events, school programs, and community celebrations." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {publicAlbums.length === 0 ? (
          <EmptyState title="No Albums Yet" message="Photo albums will appear here as they are added." />
        ) : (
          <>
            <SectionHeader title="Photo Albums" subtitle={`${publicAlbums.length} albums`} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publicAlbums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
