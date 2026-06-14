import { useNavigate } from 'react-router-dom';
import { getReviews, getOrders, getFavorites, removeFavorite, getServices } from '../utils/storage';
import { UserRole } from '../types';
import { useState } from 'react';

interface ProfileProps {
  role: UserRole;
  onSwitchRole: (r: UserRole) => void;
}

export default function Profile({ role, onSwitchRole }: ProfileProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<'menu' | 'orders' | 'reviews' | 'favorites' | 'fans'>('menu');
  const [tick, setTick] = useState(0);

  const orders = getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const reviews = getReviews();
  const favorites = getFavorites();
  void tick;

  if (view === 'orders') {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的订单</span>
        </div>
        <div style={{ padding: 16 }}>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">暂无订单</div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">{order.id}</span>
                  <span className="text-secondary text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-body">
                  <div className="order-service">{order.serviceName}</div>
                  <div className="order-detail">{order.auntAvatar} {order.auntName} | ¥{order.totalPrice}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'reviews') {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的评价</span>
        </div>
        <div style={{ padding: 16 }}>
          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-text">暂无评价</div>
            </div>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <span style={{ fontWeight: 600 }}>{r.serviceName} - {r.auntName}</span>
                  <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <div className="review-text">{r.text || '用户未填写文字评价'}</div>
                <div className="text-sm text-secondary" style={{ marginTop: 8 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'favorites') {
    const handleRemove = (auntId: string) => {
      if (confirm('确定取消收藏这位阿姨吗？')) {
        removeFavorite(auntId);
        setTick((t) => t + 1);
      }
    };
    const handleBook = (auntId: string) => {
      const services = getServices().filter((s) => s.aunt.id === auntId);
      if (services.length > 0) {
        navigate(`/service/${services[0].id}`);
      } else {
        alert('该阿姨暂无可用服务');
      }
    };
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的收藏</span>
        </div>
        <div style={{ padding: 16 }}>
          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">❤️</div>
              <div className="empty-text">还没有收藏的阿姨</div>
              <button className="btn btn-primary" onClick={() => navigate('/')}>去发现阿姨</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {favorites.map((f) => (
                <div key={f.id} className="service-card" style={{ position: 'relative' }}>
                  <div className="service-avatar">{f.auntAvatar}</div>
                  <div className="service-info">
                    <div className="service-name">{f.auntName}</div>
                    <div className="service-desc">{f.specialties.join(' / ')}</div>
                    <div className="service-meta">
                      <span className="service-rating">⭐ {f.auntRating}</span>
                      <span className="text-secondary text-sm">{f.auntOrderCount}单</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleBook(f.auntId)}>
                      立即预约
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleRemove(f.auntId)}
                      style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
                    >
                      取消收藏
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'fans') {
    return (
      <div>
        <div className="header">
          <button className="back-btn" onClick={() => setView('menu')}>←</button>
          <span className="title">我的粉丝</span>
        </div>
        <div style={{ padding: 16 }}>
          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-text">还没有人收藏您</div>
              <div className="text-sm text-secondary" style={{ marginTop: 8 }}>继续努力服务，收获更多粉丝吧！</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {favorites.map((f) => (
                <div key={f.id} className="order-card">
                  <div className="order-header">
                    <span style={{ fontWeight: 600 }}>👤 {f.customerName}</span>
                    <span className="text-sm text-secondary">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-body">
                    <div className="order-detail">收藏时间：{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <span className="title-main">个人中心</span>
      </div>

      <div className="page-banner" style={{ paddingBottom: 30 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{role === 'aunt' ? '👩‍🔧' : '👤'}</div>
        <h2>{role === 'aunt' ? '家政阿姨' : '尊享用户'}</h2>
        <p>{role === 'aunt' ? '专业服务 温暖到家' : '感谢您选择温馨家政'}</p>
      </div>

      <div style={{ marginTop: -16 }}>
        <div className="card" style={{ margin: '0 20px', padding: '20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{orders.length}</div>
            <div className="text-sm text-secondary">总订单</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{completedCount}</div>
            <div className="text-sm text-secondary">已完成</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{role === 'customer' ? favorites.length : reviews.length}</div>
            <div className="text-sm text-secondary">{role === 'customer' ? '收藏' : '评价'}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="profile-menu-item" onClick={() => setView('orders')}>
          <span className="menu-icon">📦</span>
          <span>我的订单</span>
          <span className="menu-arrow">›</span>
        </button>
        {role === 'customer' ? (
          <>
            <button className="profile-menu-item" onClick={() => setView('favorites')}>
              <span className="menu-icon">❤️</span>
              <span>我的收藏</span>
              <span className="menu-arrow">›</span>
            </button>
            <button className="profile-menu-item" onClick={() => setView('reviews')}>
              <span className="menu-icon">⭐</span>
              <span>我的评价</span>
              <span className="menu-arrow">›</span>
            </button>
            <button className="profile-menu-item" onClick={() => navigate('/addresses')}>
              <span className="menu-icon">📍</span>
              <span>常用地址</span>
              <span className="menu-arrow">›</span>
            </button>
          </>
        ) : (
          <button className="profile-menu-item" onClick={() => setView('fans')}>
            <span className="menu-icon">👥</span>
            <span>我的粉丝</span>
            <span className="menu-arrow">›</span>
          </button>
        )}
        <button className="profile-menu-item" onClick={() => {
          const newRole = role === 'customer' ? 'aunt' : 'customer';
          onSwitchRole(newRole);
          if (newRole === 'aunt') navigate('/aunt');
        }}>
          <span className="menu-icon">🔄</span>
          <span>切换到{role === 'customer' ? '阿姨' : '用户'}视角</span>
          <span className="menu-arrow">›</span>
        </button>
        <button className="profile-menu-item" onClick={() => {
          if (confirm('确定清除所有数据？此操作不可撤销。')) {
            localStorage.clear();
            window.location.reload();
          }
        }}>
          <span className="menu-icon">🗑️</span>
          <span>清除数据</span>
          <span className="menu-arrow">›</span>
        </button>
      </div>
    </div>
  );
}
