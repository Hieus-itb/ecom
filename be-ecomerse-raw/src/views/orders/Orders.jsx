import React, { useEffect, useMemo, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CButton, CBadge, CRow, CCol, CFormSelect, CModal, 
  CModalHeader, CModalTitle, CModalBody, CModalFooter, CSpinner, CFormInput, 
  CFormTextarea, CAlert, CListGroup, CListGroupItem, CForm, CInputGroup, CInputGroupText
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const statusColors = { pending: 'secondary', processing: 'info', shipped: 'warning', delivered: 'success', cancelled: 'danger' }

const Orders = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [statusMap, setStatusMap] = useState({})
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [notes, setNotes] = useState('')
  const [addingNotes, setAddingNotes] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/admin/orders')
      const data = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : [])
      setItems(data)
      const m = {}
      data.forEach((o)=>{ m[o._id] = o.orderStatus || o.status })
      setStatusMap(m)
    } catch (e) {
      const status = e?.response?.status
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message
      console.error('ADMIN_ORDERS_LOAD_ERROR', status, msg)
      if (status === 401) setError('Vui lòng đăng nhập lại (401)')
      else if (status === 403) setError('Bạn không có quyền admin (403)')
      else setError(`Không tải được danh sách đơn hàng${status ? ` (${status})` : ''}`)
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const onChangeStatus = (orderId) => (e) => {
    const val = e.target.value
    setStatusMap((prev)=>({ ...prev, [orderId]: val }))
  }

  const updateStatus = async (orderId) => {
    try {
      setUpdatingId(orderId)
      await axiosClient.patch(`/orders/${orderId}`, { orderStatus: statusMap[orderId] })
      await load()
    } catch (e) {
      // ignore
    } finally { setUpdatingId('') }
  }

  const openDetail = (order) => {
    setSelectedOrder(order)
    setDetailModalOpen(true)
  }

  const closeDetail = () => {
    setDetailModalOpen(false)
    setSelectedOrder(null)
    setNotes('')
  }

  const addNotes = async () => {
    if (!notes.trim() || !selectedOrder) return
    setAddingNotes(true)
    try {
      // API call to add notes (implement in backend)
      await axiosClient.patch(`/orders/${selectedOrder._id}`, { notes: notes.trim() })
      setNotes('')
      // Refresh order data
      const res = await axiosClient.get(`/orders/${selectedOrder._id}`)
      setSelectedOrder(res.data.data || res.data)
    } catch (e) {
      console.error('Error adding notes:', e)
    } finally {
      setAddingNotes(false)
    }
  }

  const generateInvoice = (order) => {
    const invoiceContent = `
INVOICE
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Customer: ${order.user?.name || order.user?.username || 'N/A'}
Email: ${order.user?.email || 'N/A'}

Shipping Address:
${order.firstName} ${order.lastName}
${order.street}, ${order.cities}, ${order.state}
${order.country} ${order.zipCode}
Phone: ${order.phone}

Items:
${order.items?.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n') || 'No items'}

Total: $${order.totalPrice || order.totalAmount || 0}
Status: ${order.orderStatus || order.status}
Payment Method: ${order.paymentMethod || 'N/A'}
    `
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice_${order._id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const headers = ['OrderID','UserID','Username','Email','Amount','Status','PaymentStatus','PaymentMethod','CreatedAt','UpdatedAt']
    const rows = items.map((o)=> [
      o._id,
      o.userId,
      o.user?.username || o.user?.name || '',
      o.user?.email || '',
      o.totalPrice ?? o.totalAmount ?? '',
      (o.orderStatus||o.status||''),
      o.paymentStatus || '',
      o.paymentMethod || '',
      new Date(o.createdAt).toISOString(),
      new Date(o.updatedAt).toISOString()
    ])
    const csv = [headers, ...rows].map(r=> r.map((x)=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_export_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.user?.username && item.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.user?.email && item.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === (item.orderStatus || item.status))
    
    const matchesDate = !dateFilter || 
      new Date(item.createdAt).toDateString() === new Date(dateFilter).toDateString()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol><strong>Orders Management</strong></CCol>
            <CCol className="text-end">
              <CButton color="secondary" variant="outline" onClick={exportCSV}>Export CSV</CButton>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={3}>
              <CFormInput 
                placeholder="Search orders..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormInput 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Payment</CTableHeaderCell>
                  <CTableHeaderCell>Created</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredItems.map((o)=> (
                  <CTableRow key={o._id}>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{o._id}</div>
                        <small className="text-muted">{o.items?.length || 0} items</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{o.user?.username || o.user?.name || o.userId}</div>
                        <small className="text-muted">{o.user?.email || ''}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>${o.totalPrice ?? o.totalAmount ?? 0}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={statusColors[o.orderStatus||o.status] || 'secondary'}>
                        {o.orderStatus||o.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{o.paymentMethod || 'N/A'}</div>
                        <small className="text-muted">{o.paymentStatus || 'pending'}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>{new Date(o.createdAt).toLocaleString()}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CRow className="g-2 justify-content-end">
                        <CCol xs="auto">
                          <CButton size="sm" color="info" variant="outline" onClick={() => openDetail(o)}>
                            View
                          </CButton>
                        </CCol>
                        <CCol xs="auto">
                          <CButton size="sm" color="success" variant="outline" onClick={() => generateInvoice(o)}>
                            Invoice
                          </CButton>
                        </CCol>
                        <CCol xs="6">
                          <CFormSelect size="sm" value={statusMap[o._id] || (o.orderStatus||o.status)} onChange={onChangeStatus(o._id)}>
                            {['pending','processing','shipped','delivered','cancelled'].map((s)=> <option key={s} value={s}>{s}</option>)}
                          </CFormSelect>
                        </CCol>
                        <CCol xs="auto">
                          <CButton size="sm" color="primary" disabled={updatingId===o._id} onClick={()=>updateStatus(o._id)}>
                            {updatingId===o._id ? 'Saving...' : 'Update'}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Order Detail Modal */}
      <CModal visible={detailModalOpen} onClose={closeDetail} size="xl" backdrop="static">
        <CModalHeader>
          <CModalTitle>Order Details - {selectedOrder?._id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <CRow className="g-4">
              {/* Customer Info */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Customer Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Name:</strong> {selectedOrder.user?.name || selectedOrder.user?.username || 'N/A'}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Phone:</strong> {selectedOrder.phone || 'N/A'}
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Shipping Address */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Shipping Address</strong></CCardHeader>
                  <CCardBody>
                    <div>
                      <strong>{selectedOrder.firstName} {selectedOrder.lastName}</strong><br/>
                      {selectedOrder.street}<br/>
                      {selectedOrder.cities}, {selectedOrder.state}<br/>
                      {selectedOrder.country} {selectedOrder.zipCode}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Order Items */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Order Items</strong></CCardHeader>
                  <CCardBody>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Product</CTableHeaderCell>
                          <CTableHeaderCell>Size</CTableHeaderCell>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableHeaderCell>Price</CTableHeaderCell>
                          <CTableHeaderCell>Total</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {selectedOrder.items?.map((item, idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>
                              <div>
                                <div style={{ fontWeight: 500 }}>{item.name || item.productName || 'Product'}</div>
                                {item.productImage && (
                                  <img src={item.productImage} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                )}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{item.size || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.quantity}</CTableDataCell>
                            <CTableDataCell>${item.price}</CTableDataCell>
                            <CTableDataCell>${(item.price * item.quantity).toFixed(2)}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                    <div className="text-end mt-3">
                      <strong>Total: ${selectedOrder.totalPrice || selectedOrder.totalAmount || 0}</strong>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Order Status & Notes */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Order Management</strong></CCardHeader>
                  <CCardBody>
                    <CRow className="g-3">
                      <CCol md={6}>
                        <div>
                          <strong>Current Status:</strong>
                          <CBadge color={statusColors[selectedOrder.orderStatus||selectedOrder.status] || 'secondary'} className="ms-2">
                            {selectedOrder.orderStatus||selectedOrder.status}
                          </CBadge>
                        </div>
                        <div className="mt-2">
                          <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
                        </div>
                        <div>
                          <strong>Payment Status:</strong> {selectedOrder.paymentStatus || 'pending'}
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <CForm>
                          <CFormTextarea 
                            label="Add Notes" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add internal notes for this order..."
                            rows={3}
                          />
                          <CButton 
                            color="primary" 
                            size="sm" 
                            onClick={addNotes} 
                            disabled={!notes.trim() || addingNotes}
                            className="mt-2"
                          >
                            {addingNotes ? 'Adding...' : 'Add Notes'}
                          </CButton>
                        </CForm>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={closeDetail}>Close</CButton>
          <CButton color="success" onClick={() => selectedOrder && generateInvoice(selectedOrder)}>
            Generate Invoice
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Orders


