import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getServices, toggleFavorite, isFavorited } from '../utils/storage';
import { SortType } from '../types';

const categoryNames: Record<string, string> = {
  cleaning: '保洁服务',
  repair: '维修服务',
  moving: '搬家服务',
  cooking: '做饭服务',
};

export default function ServiceList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortType>('default');
  const [tick, setTick] = useState(0);

  const services = useMemo(() => {
    const all = getServices().filter((s) => s.categoryId === categoryId);
    switch (sort) {
      case 'price-asc':
        return [...all].sort((a, b) => a.priceMin - b.priceMin);
      case 'price-desc':
        return [...all].sort((a, b) => b.priceMin - a.priceMin);
      case 'rating-desc':
        return [...all].sort((a, b) => b.aunt.rating - a.aunt.rating);
      default:
        return all;
    }
  }, [categoryId, sort, tick]);

  const handleFavorite = (e: React.MouseEvent, service: typeof services[number]) => {
    e.stopPropagation();
    const aunt = service.aunt;
    toggleFavorite(aunt.id, {
      auntName: aunt.name,
      auntAvatar: aunt.avatar,
      auntRating: aunt.rating,
      auntOrderCount: aunt.orderCount,
      specialties: aunt.specialties,
      customerName: '我',
    });
    setTick((t) => t + 1);
  };

  return (
    <div>
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="title">{categoryNames[categoryId || ''] || '服务列表'}</span>
      </div>

      <div className="sort-bar">
        <button className={`sort-btn ${sort === 'default' ? 'active' : ''}`} onClick={() => setSort('default')}>综合排序</button>
        <button className={`sort-btn ${sort === 'price-asc' ? 'active' : ''}`} onClick={() => setSort('price-asc')}>价格↑</button>
        <button className={`sort-btn ${sort === 'price-desc' ? 'active' : ''}`} onClick={() => setSort('price-desc')}>价格↓</button>
        <button className={`sort-btn ${sort === 'rating-desc' ? 'active' : ''}`} onClick={() => setSort('rating-desc')}>评分↓</button>
      </div>

      <div className="service-list">
        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">暂无相关服务</div>
          </div>
        ) : (
          services.map((s) => {
            const fav = isFavorited(s.aunt.id);
            return (
              <div key={s.id} className="service-card" onClick={() => navigate(`/service/${s.id}`)} style={{ position: 'relative' }}>
                <div className="service-avatar">{s.aunt.avatar}</div>
                <div className="service-info">
                  <div className="service-name">{s.name}</div>
                  <div className="service-desc">{s.description}</div>
                  <div className="service-meta">
                    <span className="service-price">¥{s.priceMin}-{s.priceMax}</span>
                    <span className="service-rating">⭐ {s.aunt.rating}</span>
                    <span className="text-secondary text-sm">{s.aunt.orderCount}单</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleFavorite(e, s)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    border: 'none',
                    fontSize: 20,
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  title={fav ? '取消收藏' : '收藏阿姨'}
                >
                  {fav ? '❤️' : '🤍'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
