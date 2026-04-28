import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { articlesAPI, categoriesAPI } from '../api';
import ArticleCard from '../components/ArticleCard';
import SkeletonLoader from '../components/SkeletonLoader';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(keyword);
  const [filterCategory, setFilterCategory] = useState(category);
  const [filterStartDate, setFilterStartDate] = useState(startDate);
  const [filterEndDate, setFilterEndDate] = useState(endDate);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [keyword, category, startDate, endDate, page]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (keyword) params.keyword = keyword;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await articlesAPI.getAll(params);
      setArticles(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to search articles:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchInput) params.keyword = searchInput;
    if (filterCategory) params.category = filterCategory;
    if (filterStartDate) params.startDate = filterStartDate;
    if (filterEndDate) params.endDate = filterEndDate;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    setSearchParams({});
  };

  return (
    <div className="container section">
      <h1 style={{ fontSize: 28, marginBottom: 24, fontFamily: 'var(--font-sans)' }}>
        <FiSearch style={{ marginRight: 8 }} />
        {keyword ? `Results for "${keyword}"` : 'Search Articles'}
      </h1>

      <div className="search-layout">
        {/* Filter sidebar */}
        <div className="filter-sidebar">
          <h3><FiFilter style={{ marginRight: 6 }} /> Filters</h3>
          
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">Keyword</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-input"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-input"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <FiSearch /> Search
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 8 }}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <SkeletonLoader count={6} />
          ) : articles.length > 0 ? (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>
                Showing {articles.length} of {pagination.total} results
              </p>
              <div className="article-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: page - 1 })}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={page === i + 1 ? 'active' : ''}
                      onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i + 1 })}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: page + 1 })}
                    disabled={page === pagination.pages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
