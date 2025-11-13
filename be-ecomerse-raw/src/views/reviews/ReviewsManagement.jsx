import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CFormCheck, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge,
  CInputGroup, CInputGroupText, CProgress, CListGroup, CListGroupItem,
  CImage, CRating, CFormTextarea as CTextarea
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const ReviewsManagement = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: 'PROD001',
      productName: 'iPhone 15 Pro',
      productImage: 'https://via.placeholder.com/60x60/007bff/ffffff?text=iPhone',
      customerId: 'CUST001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      rating: 5,
      title: 'Sản phẩm tuyệt vời!',
      comment: 'Điện thoại rất đẹp, camera chụp ảnh cực kỳ sắc nét. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua lại lần sau.',
      images: [
        'https://via.placeholder.com/100x100/28a745/ffffff?text=IMG1',
        'https://via.placeholder.com/100x100/28a745/ffffff?text=IMG2'
      ],
      status: 'approved',
      isVerified: true,
      helpful: 12,
      createdAt: '2024-01-07T10:30:00Z',
      updatedAt: '2024-01-07T10:30:00Z',
      adminResponse: null
    },
    {
      id: 2,
      productId: 'PROD002',
      productName: 'Samsung Galaxy S24',
      productImage: 'https://via.placeholder.com/60x60/6f42c1/ffffff?text=Galaxy',
      customerId: 'CUST002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      rating: 4,
      title: 'Tốt nhưng có vài điểm cần cải thiện',
      comment: 'Điện thoại tốt, pin trâu, nhưng camera hơi kém so với iPhone. Giá cả hợp lý.',
      images: [],
      status: 'approved',
      isVerified: true,
      helpful: 8,
      createdAt: '2024-01-06T15:20:00Z',
      updatedAt: '2024-01-06T15:20:00Z',
      adminResponse: null
    },
    {
      id: 3,
      productId: 'PROD003',
      productName: 'MacBook Pro M3',
      productImage: 'https://via.placeholder.com/60x60/343a40/ffffff?text=MacBook',
      customerId: 'CUST003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      rating: 1,
      title: 'Sản phẩm lỗi, không hoạt động',
      comment: 'Máy tính mới mua về đã bị lỗi màn hình, không thể sử dụng được. Rất thất vọng với chất lượng.',
      images: [
        'https://via.placeholder.com/100x100/dc3545/ffffff?text=ERROR'
      ],
      status: 'pending',
      isVerified: true,
      helpful: 3,
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z',
      adminResponse: null
    },
    {
      id: 4,
      productId: 'PROD001',
      productName: 'iPhone 15 Pro',
      productImage: 'https://via.placeholder.com/60x60/007bff/ffffff?text=iPhone',
      customerId: 'CUST004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      rating: 3,
      title: 'Bình thường',
      comment: 'Sản phẩm ok, không có gì đặc biệt. Giá hơi cao.',
      images: [],
      status: 'rejected',
      isVerified: false,
      helpful: 1,
      createdAt: '2024-01-04T14:45:00Z',
      updatedAt: '2024-01-04T16:30:00Z',
      adminResponse: 'Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cải thiện chất lượng sản phẩm.'
    },
    {
      id: 5,
      productId: 'PROD004',
      productName: 'iPad Air',
      productImage: 'https://via.placeholder.com/60x60/17a2b8/ffffff?text=iPad',
      customerId: 'CUST005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      rating: 5,
      title: 'Rất hài lòng',
      comment: 'iPad rất mượt, màn hình đẹp, pin trâu. Phù hợp cho công việc và giải trí.',
      images: [],
      status: 'approved',
      isVerified: true,
      helpful: 15,
      createdAt: '2024-01-03T11:20:00Z',
      updatedAt: '2024-01-03T11:20:00Z',
      adminResponse: null
    }
  ])

  const [products, setProducts] = useState([
    { id: 'PROD001', name: 'iPhone 15 Pro' },
    { id: 'PROD002', name: 'Samsung Galaxy S24' },
    { id: 'PROD003', name: 'MacBook Pro M3' },
    { id: 'PROD004', name: 'iPad Air' },
    { id: 'PROD005', name: 'AirPods Pro' }
  ])

  const [adminResponse, setAdminResponse] = useState('')

  const loadReviews = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      // Data is already initialized above
    } catch (e) {
      setError('Không tải được danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReviews() }, [])

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, status: newStatus, updatedAt: new Date().toISOString() }
          : review
      ))
      
      setSuccess(`Đánh giá đã được ${newStatus === 'approved' ? 'duyệt' : newStatus === 'rejected' ? 'từ chối' : 'chờ duyệt'}!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi cập nhật trạng thái đánh giá')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        setSaving(true)
        // In real app, this would be API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        setSuccess('Đánh giá đã được xóa!')
        setTimeout(() => setSuccess(''), 3000)
      } catch (e) {
        setError('Lỗi khi xóa đánh giá')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleAddAdminResponse = async (reviewId) => {
    if (!adminResponse.trim()) {
      setError('Vui lòng nhập phản hồi')
      return
    }

    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, adminResponse: adminResponse.trim(), updatedAt: new Date().toISOString() }
          : review
      ))
      
      setAdminResponse('')
      setModalOpen(false)
      setSuccess('Phản hồi đã được thêm!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi thêm phản hồi')
    } finally {
      setSaving(false)
    }
  }

  const openReviewDetail = (review) => {
    setSelectedReview(review)
    setAdminResponse(review.adminResponse || '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedReview(null)
    setAdminResponse('')
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    const matchesProduct = productFilter === 'all' || review.productId === productFilter
    
    return matchesSearch && matchesStatus && matchesRating && matchesProduct
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Từ chối'
      case 'pending': return 'Chờ duyệt'
      default: return status
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success'
    if (rating >= 3) return 'warning'
    return 'danger'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffc107' : '#e9ecef' }}>
        ★
      </span>
    ))
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol md={8}>
          <h2>Reviews Management</h2>
          <p className="text-muted">Quản lý đánh giá và bình luận sản phẩm</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="info" variant="outline">
            Export Reviews
          </CButton>
        </CCol>
      </CRow>

      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
      {success && <CAlert color="success" className="mb-4">{success}</CAlert>}

      {/* Filters */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={3}>
              <CFormInput
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="all">Tất cả điểm</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormSelect value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                <option value="all">Tất cả sản phẩm</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CButton color="secondary" variant="outline" onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setRatingFilter('all')
                setProductFilter('all')
              }}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Reviews Table */}
      <CCard>
        <CCardHeader>
          <strong>Reviews ({filteredReviews.length})</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Rating</CTableHeaderCell>
                  <CTableHeaderCell>Review</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredReviews.map((review) => (
                  <CTableRow key={review.id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CImage
                          src={review.productImage}
                          alt={review.productName}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          className="me-2"
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{review.productName}</div>
                          <small className="text-muted">ID: {review.productId}</small>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{review.customerName}</div>
                        <small className="text-muted">{review.customerEmail}</small>
                        {review.isVerified && (
                          <CBadge color="success" className="ms-1">Verified</CBadge>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontSize: '16px' }}>{renderStars(review.rating)}</div>
                        <small className="text-muted">{review.rating}/5</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{review.title}</div>
                        <div style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {review.comment}
                        </div>
                        {review.images.length > 0 && (
                          <small className="text-info">{review.images.length} ảnh</small>
                        )}
                        {review.adminResponse && (
                          <div className="mt-1">
                            <small className="text-success">
                              <strong>Admin:</strong> {review.adminResponse}
                            </small>
                          </div>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(review.status)}>
                        {getStatusText(review.status)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{formatDate(review.createdAt)}</div>
                        <small className="text-muted">{review.helpful} helpful</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1">
                        <CButton 
                          size="sm" 
                          color="info" 
                          variant="outline" 
                          onClick={() => openReviewDetail(review)}
                        >
                          View
                        </CButton>
                        {review.status === 'pending' && (
                          <>
                            <CButton 
                              size="sm" 
                              color="success" 
                              variant="outline" 
                              onClick={() => handleStatusChange(review.id, 'approved')}
                              disabled={saving}
                            >
                              Approve
                            </CButton>
                            <CButton 
                              size="sm" 
                              color="warning" 
                              variant="outline" 
                              onClick={() => handleStatusChange(review.id, 'rejected')}
                              disabled={saving}
                            >
                              Reject
                            </CButton>
                          </>
                        )}
                        <CButton 
                          size="sm" 
                          color="danger" 
                          variant="outline" 
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={saving}
                        >
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Review Detail Modal */}
      <CModal visible={modalOpen} onClose={closeModal} size="lg" backdrop="static">
        <CModalHeader>
          <CModalTitle>Review Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReview && (
            <CRow className="g-4">
              {/* Product Info */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Product Information</strong></CCardHeader>
                  <CCardBody>
                    <div className="d-flex align-items-center">
                      <CImage
                        src={selectedReview.productImage}
                        alt={selectedReview.productName}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        className="me-3"
                      />
                      <div>
                        <h5>{selectedReview.productName}</h5>
                        <small className="text-muted">Product ID: {selectedReview.productId}</small>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Customer Info */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Customer Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Name:</strong> {selectedReview.customerName}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Email:</strong> {selectedReview.customerEmail}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Customer ID:</strong> {selectedReview.customerId}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Verified:</strong> 
                        <CBadge color={selectedReview.isVerified ? 'success' : 'secondary'} className="ms-2">
                          {selectedReview.isVerified ? 'Yes' : 'No'}
                        </CBadge>
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Review Info */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Review Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Rating:</strong> 
                        <div className="mt-1" style={{ fontSize: '18px' }}>
                          {renderStars(selectedReview.rating)}
                        </div>
                        <small className="text-muted">{selectedReview.rating}/5 stars</small>
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Status:</strong> 
                        <CBadge color={getStatusColor(selectedReview.status)} className="ms-2">
                          {getStatusText(selectedReview.status)}
                        </CBadge>
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Helpful:</strong> {selectedReview.helpful} votes
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Date:</strong> {formatDate(selectedReview.createdAt)}
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Review Content */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Review Content</strong></CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <h5>{selectedReview.title}</h5>
                      <p>{selectedReview.comment}</p>
                    </div>
                    
                    {selectedReview.images.length > 0 && (
                      <div>
                        <strong>Images:</strong>
                        <div className="d-flex gap-2 mt-2">
                          {selectedReview.images.map((image, idx) => (
                            <CImage
                              key={idx}
                              src={image}
                              alt={`Review image ${idx + 1}`}
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Admin Response */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Admin Response</strong></CCardHeader>
                  <CCardBody>
                    <CTextarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Add admin response to this review..."
                      rows={3}
                    />
                    <div className="mt-2">
                      <CButton 
                        color="primary" 
                        size="sm" 
                        onClick={() => handleAddAdminResponse(selectedReview.id)}
                        disabled={saving || !adminResponse.trim()}
                      >
                        {saving ? 'Saving...' : 'Add Response'}
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={closeModal}>
            Close
          </CButton>
          {selectedReview && selectedReview.status === 'pending' && (
            <>
              <CButton 
                color="success" 
                onClick={() => handleStatusChange(selectedReview.id, 'approved')}
                disabled={saving}
              >
                Approve
              </CButton>
              <CButton 
                color="warning" 
                onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                disabled={saving}
              >
                Reject
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ReviewsManagement
