import { useEffect, useState } from 'react';
import { getMyOrders } from '@/apis/orderService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import MyHeader from '@components/Header/Header';
import MyFooter from '@components/Footer/Footer';
import MainLayout from '@components/Layout/Layout';
import styles from '@/pages/AboutUs/styles.module.scss';
import Logos from '@/pages/AboutUs/components/Logos';

function Orders() {
  const {
    container,
    functionBox,
    specialText,
    btnBack,
    containerTitle,
    line,
    title,
    textS,
    textL,
    containerContent,
    des,
  } = styles;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        const list = res?.data?.data ?? res?.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (e) {
        setError('Không tải được đơn hàng');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleBackPreviousPage = () => {
    window.history.back();
  };

  return (
    <>
      <MyHeader />

      <MainLayout>
        <div className={container}>
          <div className={functionBox}>
            <div>
              Home > <span className={specialText}>Theo dõi đơn</span>
            </div>
            <div className={btnBack} onClick={() => handleBackPreviousPage()}>
              &lt; Return to previous page
            </div>
          </div>

          <div className={containerTitle}>
            <div className={line}>
              <div className={title}>
                <div className={textS}>your orders timeline</div>
                <div className={textL}>Lịch sử đơn hàng</div>
              </div>
            </div>
          </div>

          <div className={containerContent}>
            {/* Controls */}
            <div style={{background:'#f7f8fa', padding:16, borderRadius:12, marginBottom:16}}>
              <div style={{display:'flex', gap:12, marginBottom:12}}>
                <div style={{flex:1}}>
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Tìm theo mã đơn, sản phẩm, địa chỉ..." style={{width:'100%', padding:'10px 12px', border:'1px solid #e6e8ec', borderRadius:10, outline:'none'}} />
                </div>
                <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} style={{padding:'10px 12px', border:'1px solid #e6e8ec', borderRadius:10, minWidth:120}}>
                  <option value="all">Tất cả</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đang vận chuyển</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <button onClick={()=>{ setQuery(''); setStatusFilter('all'); }} style={{padding:'10px 12px', border:'1px solid #e6e8ec', background:'#fff', borderRadius:10, cursor:'pointer', whiteSpace:'nowrap'}}>Đặt lại</button>
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                {[
                  { key:'processing', label:'Đang xử lý' },
                  { key:'shipped', label:'Đang vận chuyển' },
                  { key:'delivered', label:'Đã giao hàng' },
                ].map((chip)=> (
                  <button key={chip.key} onClick={()=>setStatusFilter(chip.key)} style={{
                    padding:'8px 12px', borderRadius:999, border:'1px solid #e6e8ec', background: statusFilter===chip.key?'#111':'#fff', color: statusFilter===chip.key?'#fff':'#111', cursor:'pointer'
                  }}>{chip.label}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className={des}>{error}</div>
            ) : !orders.length ? (
              <div className={des}>Bạn chưa có đơn hàng nào.</div>
            ) : (
              <div style={{display:'grid', gap: 16, gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))'}}>
                {orders
                  .filter((o)=> statusFilter==='all' ? true : ((o.orderStatus||o.status)===statusFilter))
                  .filter((o)=> {
                    if (!query) return true;
                    const q = query.toLowerCase();
                    const text = [o._id, o.email, o.street, o.cities, o.state].filter(Boolean).join(' ').toLowerCase();
                    return text.includes(q);
                  })
                  .map((o) => {
                    const st = (o.orderStatus || o.status || 'pending');
                    const colorMap = { processing:'#f59e0b', shipped:'#3b82f6', delivered:'#10b981', pending:'#9ca3af', cancelled:'#ef4444' };
                    const labelMap = { processing:'Đang xử lý', shipped:'Đang vận chuyển', delivered:'Đã giao hàng', pending:'Đang xử lý', cancelled:'Đã hủy' };
                    return (
                      <div key={o._id} style={{background:'#fff', border:'1px solid #eef0f3', borderRadius:16, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                          <div style={{padding:'6px 10px', borderRadius:999, background: colorMap[st] || '#9ca3af', color:'#fff', fontSize:12}}>
                            {labelMap[st] || st}
                          </div>
                        </div>
                        <div style={{display:'grid', gap:6, fontSize:14}}>
                          <div><strong>Mã Đơn:</strong> #{o._id?.slice(-6)}</div>
                          <div><strong>Ngày đặt:</strong> {o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '-'}</div>
                          <div><strong>Sản phẩm:</strong> {(o.items||[]).map(it=> {
                            // Nếu có tên sản phẩm thì dùng, không thì dùng productId
                            const productName = it.name || it.productName || `SP-${it.productId?.slice(-6)}`;
                            return productName;
                          }).slice(0,2).join(', ')}{(o.items||[]).length>2?'...':''}</div>
                          <div><strong>Địa chỉ:</strong> {o.street}, {o.cities}, {o.state}</div>
                        </div>
                        <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <div style={{opacity:.8}}>Tổng tiền</div>
                          <div style={{fontWeight:700}}>{(o.totalPrice ?? o.totalAmount ?? 0).toLocaleString('vi-VN')} đ</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          <Logos />
        </div>
      </MainLayout>

      <MyFooter />
    </>
  );
}

export default Orders;
