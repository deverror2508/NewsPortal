const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div style={{ padding: 20 }}>
      <div className="skeleton skeleton-text short" style={{ width: '30%', height: 20, marginBottom: 12 }}></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div className="skeleton" style={{ width: 80, height: 14 }}></div>
        <div className="skeleton" style={{ width: 80, height: 14 }}></div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="article-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
