import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CFormCheck, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge,
  CInputGroup, CInputGroupText, CProgress, CListGroup, CListGroupItem,
  CImage, CRating, CChartBar, CChartDoughnut, CChartLine, CChartPie
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const NegativeReviewsReports = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('30')
  
  const [negativeReviews, setNegativeReviews] = useState([
    {
      id: 1,
      productId: 'PROD003',
      productName: 'MacBook Pro M3',
      productImage: 'https://via.placeholder.com/60x60/343a40/ffffff?text=MacBook',
      customerId: 'CUST003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      rating: 1,
      title: 'Sản phẩm lỗi, không hoạt động',
      comment: 'Máy tính mới mua về đã bị lỗi màn hình, không thể sử dụng được. Rất thất vọng với chất lượng.',
      images: ['https://via.placeholder.com/100x100/dc3545/ffffff?text=ERROR'],
      severity: 'critical',
      category: 'product_defect',
      status: 'pending',
      isVerified: true,
      orderId: 'ORD003',
      purchaseDate: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-05T09:15:00Z',
      adminResponse: null,
      resolution: null,
      impact: 'high'
    },
    {
      id: 2,
      productId: 'PROD001',
      productName: 'iPhone 15 Pro',
      productImage: 'https://via.placeholder.com/60x60/007bff/ffffff?text=iPhone',
      customerId: 'CUST004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      rating: 2,
      title: 'Giao hàng chậm và đóng gói kém',
      comment: 'Đặt hàng từ 1 tuần trước nhưng đến giờ mới nhận được. Đóng gói bị hỏng, sản phẩm có vẻ không mới.',
      images: [],
      severity: 'high',
      category: 'shipping_issue',
      status: 'resolved',
      isVerified: true,
      orderId: 'ORD004',
      purchaseDate: '2023-12-25T00:00:00Z',
      createdAt: '2024-01-04T14:45:00Z',
      adminResponse: 'Xin lỗi về sự bất tiện. Chúng tôi sẽ cải thiện dịch vụ giao hàng.',
      resolution: 'refund_issued',
      impact: 'medium'
    },
    {
      id: 3,
      productId: 'PROD002',
      productName: 'Samsung Galaxy S24',
      productImage: 'https://via.placeholder.com/60x60/6f42c1/ffffff?text=Galaxy',
      customerId: 'CUST006',
      customerName: 'Nguyễn Văn F',
      customerEmail: 'nguyenvanf@email.com',
      rating: 2,
      title: 'Camera không như quảng cáo',
      comment: 'Camera chụp ảnh rất kém, không sắc nét như quảng cáo. Pin cũng tụt nhanh.',
      images: [],
      severity: 'medium',
      category: 'product_quality',
      status: 'investigating',
      isVerified: true,
      orderId: 'ORD005',
      purchaseDate: '2023-12-20T00:00:00Z',
      createdAt: '2024-01-03T16:30:00Z',
      adminResponse: null,
      resolution: null,
      impact: 'medium'
    },
    {
      id: 4,
      productId: 'PROD004',
      productName: 'iPad Air',
      productImage: 'https://via.placeholder.com/60x60/17a2b8/ffffff?text=iPad',
      customerId: 'CUST007',
      customerName: 'Trần Thị G',
      customerEmail: 'tranthig@email.com',
      rating: 1,
      title: 'Hỗ trợ khách hàng tệ',
      comment: 'Gọi hotline không ai nghe máy, email không được trả lời. Dịch vụ khách hàng rất tệ.',
      images: [],
      severity: 'high',
      category: 'customer_service',
      status: 'pending',
      isVerified: false,
      orderId: 'ORD006',
      purchaseDate: '2023-12-15T00:00:00Z',
      createdAt: '2024-01-02T11:20:00Z',
      adminResponse: null,
      resolution: null,
      impact: 'high'
    },
    {
      id: 5,
      productId: 'PROD005',
      productName: 'AirPods Pro',
      productImage: 'https://via.placeholder.com/60x60/28a745/ffffff?text=AirPods',
      customerId: 'CUST008',
      customerName: 'Hoàng Văn H',
      customerEmail: 'hoangvanh@email.com',
      rating: 2,
      title: 'Chất lượng âm thanh kém',
      comment: 'Âm thanh không rõ, có tiếng rè. Không đáng giá tiền.',
      images: [],
      severity: 'medium',
      category: 'product_quality',
      status: 'resolved',
      isVerified: true,
      orderId: 'ORD007',
      purchaseDate: '2023-12-10T00:00:00Z',
      createdAt: '2024-01-01T08:45:00Z',
      adminResponse: 'Cảm ơn phản hồi. Chúng tôi đã gửi sản phẩm thay thế.',
      resolution: 'replacement_sent',
      impact: 'low'
    }
  ])

  const [products, setProducts] = useState([
    { id: 'PROD001', name: 'iPhone 15 Pro' },
    { id: 'PROD002', name: 'Samsung Galaxy S24' },
    { id: 'PROD003', name: 'MacBook Pro M3' },
    { id: 'PROD004', name: 'iPad Air' },
    { id: 'PROD005', name: 'AirPods Pro' }
  ])

  const [stats, setStats] = useState({
    totalNegativeReviews: 25,
    criticalIssues: 3,
    highSeverity: 8,
    mediumSeverity: 12,
    lowSeverity: 2,
    resolvedIssues: 15,
    pendingIssues: 8,
    investigatingIssues: 2,
    averageResolutionTime: 3.5, // days
    customerSatisfactionScore: 2.8
  })

  const [categoryStats, setCategoryStats] = useState([
    { category: 'product_defect', count: 8, percentage: 32 },
    { category: 'shipping_issue', count: 6, percentage: 24 },
    { category: 'product_quality', count: 5, percentage: 20 },
    { category: 'customer_service', count: 4, percentage: 16 },
    { category: 'billing_issue', count: 2, percentage: 8 }
  ])

  const loadReports = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      // Data is already initialized above
    } catch (e) {
      setError('Không tải được báo cáo đánh giá tiêu cực')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReports() }, [])

  const filteredReviews = negativeReviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = severityFilter === 'all' || review.severity === severityFilter
    const matchesProduct = productFilter === 'all' || review.productId === productFilter
    
    return matchesSearch && matchesSeverity && matchesProduct
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'secondary'
      default: return 'light'
    }
  }

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'critical': return 'Nghiêm trọng'
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return severity
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success'
      case 'investigating': return 'info'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'resolved': return 'Đã giải quyết'
      case 'investigating': return 'Đang điều tra'
      case 'pending': return 'Chờ xử lý'
      default: return status
    }
  }

  const getCategoryText = (category) => {
    switch (category) {
      case 'product_defect': return 'Lỗi sản phẩm'
      case 'shipping_issue': return 'Vấn đề giao hàng'
      case 'product_quality': return 'Chất lượng sản phẩm'
      case 'customer_service': return 'Dịch vụ khách hàng'
      case 'billing_issue': return 'Vấn đề thanh toán'
      default: return category
    }
  }

  const getResolutionText = (resolution) => {
    switch (resolution) {
      case 'refund_issued': return 'Hoàn tiền'
      case 'replacement_sent': return 'Gửi sản phẩm thay thế'
      case 'discount_offered': return 'Giảm giá'
      case 'apology_sent': return 'Xin lỗi'
      default: return resolution || 'Chưa giải quyết'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
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
          <h2>Negative Reviews Reports</h2>
          <p className="text-muted">Báo cáo đánh giá tiêu cực và xử lý khiếu nại</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="danger" variant="outline">
            Export Report
          </CButton>
        </CCol>
      </CRow>

      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}

      {/* Key Metrics */}
      <CRow className="mb-4">
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-danger">{stats.totalNegativeReviews}</h4>
              <p className="text-muted mb-0">Total Negative</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-danger">{stats.criticalIssues}</h4>
              <p className="text-muted mb-0">Critical Issues</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning">{stats.pendingIssues}</h4>
              <p className="text-muted mb-0">Pending</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info">{stats.investigatingIssues}</h4>
              <p className="text-muted mb-0">Investigating</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success">{stats.resolvedIssues}</h4>
              <p className="text-muted mb-0">Resolved</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-primary">{stats.averageResolutionTime}d</h4>
              <p className="text-muted mb-0">Avg Resolution</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Charts */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <strong>Issues by Category</strong>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: categoryStats.map(c => getCategoryText(c.category)),
                  datasets: [
                    {
                      data: categoryStats.map(c => c.count),
                      backgroundColor: [
                        '#dc3545',
                        '#fd7e14',
                        '#ffc107',
                        '#17a2b8',
                        '#6c757d'
                      ]
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                style={{ height: '300px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <strong>Issues by Severity</strong>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['Critical', 'High', 'Medium', 'Low'],
                  datasets: [
                    {
                      label: 'Number of Issues',
                      data: [
                        stats.criticalIssues,
                        stats.highSeverity,
                        stats.mediumSeverity,
                        stats.lowSeverity
                      ],
                      backgroundColor: [
                        '#dc3545',
                        '#fd7e14',
                        '#ffc107',
                        '#6c757d'
                      ]
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
                style={{ height: '300px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
              <CFormSelect value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="all">Tất cả mức độ</option>
                <option value="critical">Nghiêm trọng</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
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
              <CFormSelect value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
                <option value="365">1 năm qua</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CButton color="secondary" variant="outline" onClick={() => {
                setSearchTerm('')
                setSeverityFilter('all')
                setProductFilter('all')
                setDateFilter('30')
              }}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Negative Reviews Table */}
      <CCard>
        <CCardHeader>
          <strong>Negative Reviews ({filteredReviews.length})</strong>
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
                  <CTableHeaderCell>Issue</CTableHeaderCell>
                  <CTableHeaderCell>Severity</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Resolution</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
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
                          <small className="text-muted">Order: {review.orderId}</small>
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
                        <div style={{ fontWeight: 500 }}>{review.title}</div>
                        <div style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {review.comment}
                        </div>
                        <div style={{ fontSize: '14px' }}>{renderStars(review.rating)}</div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getSeverityColor(review.severity)}>
                        {getSeverityText(review.severity)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <small>{getCategoryText(review.category)}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(review.status)}>
                        {getStatusText(review.status)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <small>{getResolutionText(review.resolution)}</small>
                        {review.adminResponse && (
                          <div className="mt-1">
                            <small className="text-info">
                              <strong>Admin:</strong> {review.adminResponse}
                            </small>
                          </div>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{formatDate(review.createdAt)}</div>
                        <small className="text-muted">Purchased: {formatDate(review.purchaseDate)}</small>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default NegativeReviewsReports
