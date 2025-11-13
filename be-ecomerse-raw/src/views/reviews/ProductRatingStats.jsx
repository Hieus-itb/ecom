import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CFormCheck, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge,
  CInputGroup, CInputGroupText, CProgress, CListGroup, CListGroupItem,
  CImage, CRating, CChartBar, CChartDoughnut, CChartLine
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const ProductRatingStats = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  
  const [products, setProducts] = useState([
    {
      id: 'PROD001',
      name: 'iPhone 15 Pro',
      image: 'https://via.placeholder.com/60x60/007bff/ffffff?text=iPhone',
      category: 'Electronics',
      price: 29990000,
      totalReviews: 156,
      averageRating: 4.8,
      ratingDistribution: {
        5: 120,
        4: 25,
        3: 8,
        2: 2,
        1: 1
      },
      recentReviews: 12,
      verifiedReviews: 145,
      lastReviewDate: '2024-01-07T10:30:00Z',
      sales: 89,
      revenue: 2669110000
    },
    {
      id: 'PROD002',
      name: 'Samsung Galaxy S24',
      image: 'https://via.placeholder.com/60x60/6f42c1/ffffff?text=Galaxy',
      category: 'Electronics',
      price: 22990000,
      totalReviews: 98,
      averageRating: 4.2,
      ratingDistribution: {
        5: 45,
        4: 35,
        3: 12,
        2: 4,
        1: 2
      },
      recentReviews: 8,
      verifiedReviews: 89,
      lastReviewDate: '2024-01-06T15:20:00Z',
      sales: 67,
      revenue: 1540330000
    },
    {
      id: 'PROD003',
      name: 'MacBook Pro M3',
      image: 'https://via.placeholder.com/60x60/343a40/ffffff?text=MacBook',
      category: 'Electronics',
      price: 45990000,
      totalReviews: 45,
      averageRating: 3.8,
      ratingDistribution: {
        5: 20,
        4: 15,
        3: 6,
        2: 3,
        1: 1
      },
      recentReviews: 3,
      verifiedReviews: 42,
      lastReviewDate: '2024-01-05T09:15:00Z',
      sales: 23,
      revenue: 1057770000
    },
    {
      id: 'PROD004',
      name: 'iPad Air',
      image: 'https://via.placeholder.com/60x60/17a2b8/ffffff?text=iPad',
      category: 'Electronics',
      price: 15990000,
      totalReviews: 78,
      averageRating: 4.6,
      ratingDistribution: {
        5: 55,
        4: 18,
        3: 3,
        2: 1,
        1: 1
      },
      recentReviews: 6,
      verifiedReviews: 72,
      lastReviewDate: '2024-01-03T11:20:00Z',
      sales: 45,
      revenue: 719550000
    },
    {
      id: 'PROD005',
      name: 'AirPods Pro',
      image: 'https://via.placeholder.com/60x60/28a745/ffffff?text=AirPods',
      category: 'Electronics',
      price: 5990000,
      totalReviews: 134,
      averageRating: 4.4,
      ratingDistribution: {
        5: 85,
        4: 35,
        3: 10,
        2: 3,
        1: 1
      },
      recentReviews: 9,
      verifiedReviews: 128,
      lastReviewDate: '2024-01-04T14:45:00Z',
      sales: 89,
      revenue: 533110000
    }
  ])

  const [categories, setCategories] = useState([
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports'
  ])

  const [overallStats, setOverallStats] = useState({
    totalProducts: 150,
    totalReviews: 1250,
    averageRating: 4.3,
    ratingDistribution: {
      5: 650,
      4: 350,
      3: 150,
      2: 75,
      1: 25
    },
    recentReviews: 45,
    verifiedReviews: 1100,
    topRatedProducts: 5,
    lowRatedProducts: 3
  })

  const loadStats = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      // Data is already initialized above
    } catch (e) {
      setError('Không tải được thống kê đánh giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === 'high' && product.averageRating >= 4.5) ||
      (ratingFilter === 'medium' && product.averageRating >= 3.5 && product.averageRating < 4.5) ||
      (ratingFilter === 'low' && product.averageRating < 3.5)
    
    return matchesSearch && matchesCategory && matchesRating
  })

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 3.5) return 'warning'
    return 'danger'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.floor(rating) ? '#ffc107' : '#e9ecef' }}>
        ★
      </span>
    ))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getRatingPercentage = (product, rating) => {
    const total = product.totalReviews
    return total > 0 ? Math.round((product.ratingDistribution[rating] / total) * 100) : 0
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol md={8}>
          <h2>Product Rating Statistics</h2>
          <p className="text-muted">Thống kê điểm đánh giá sản phẩm</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="info" variant="outline">
            Export Statistics
          </CButton>
        </CCol>
      </CRow>

      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}

      {/* Overall Statistics */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-primary">{overallStats.totalProducts}</h4>
              <p className="text-muted mb-0">Total Products</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info">{overallStats.totalReviews}</h4>
              <p className="text-muted mb-0">Total Reviews</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success">{overallStats.averageRating.toFixed(1)}</h4>
              <p className="text-muted mb-0">Average Rating</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning">{overallStats.verifiedReviews}</h4>
              <p className="text-muted mb-0">Verified Reviews</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Charts */}
      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <strong>Overall Rating Distribution</strong>
            </CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                  datasets: [
                    {
                      data: [
                        overallStats.ratingDistribution[5],
                        overallStats.ratingDistribution[4],
                        overallStats.ratingDistribution[3],
                        overallStats.ratingDistribution[2],
                        overallStats.ratingDistribution[1]
                      ],
                      backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#fd7e14',
                        '#dc3545'
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
              <strong>Top Rated Products</strong>
            </CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: products.slice(0, 5).map(p => p.name),
                  datasets: [
                    {
                      label: 'Average Rating',
                      data: products.slice(0, 5).map(p => p.averageRating),
                      backgroundColor: 'rgba(40, 167, 69, 0.8)'
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
                      beginAtZero: true,
                      max: 5
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
            <CCol md={4}>
              <CFormInput
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormSelect value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="all">Tất cả điểm</option>
                <option value="high">Cao (4.5+)</option>
                <option value="medium">Trung bình (3.5-4.4)</option>
                <option value="low">Thấp (&lt;3.5)</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CButton color="secondary" variant="outline" onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
                setRatingFilter('all')
              }}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Products Table */}
      <CCard>
        <CCardHeader>
          <strong>Product Rating Details ({filteredProducts.length})</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Rating</CTableHeaderCell>
                  <CTableHeaderCell>Reviews</CTableHeaderCell>
                  <CTableHeaderCell>Distribution</CTableHeaderCell>
                  <CTableHeaderCell>Sales</CTableHeaderCell>
                  <CTableHeaderCell>Last Review</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredProducts.map((product) => (
                  <CTableRow key={product.id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CImage
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          className="me-3"
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{product.name}</div>
                          <small className="text-muted">{product.category}</small>
                          <div className="text-success">{formatCurrency(product.price)}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontSize: '16px' }}>{renderStars(product.averageRating)}</div>
                        <div>
                          <CBadge color={getRatingColor(product.averageRating)}>
                            {product.averageRating.toFixed(1)}/5
                          </CBadge>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{product.totalReviews}</div>
                        <small className="text-muted">
                          {product.verifiedReviews} verified
                        </small>
                        <div>
                          <small className="text-info">
                            {product.recentReviews} recent
                          </small>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div style={{ minWidth: '120px' }}>
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="d-flex align-items-center mb-1">
                            <small className="me-2" style={{ width: '20px' }}>{rating}★</small>
                            <CProgress 
                              value={getRatingPercentage(product, rating)} 
                              className="me-2" 
                              style={{ height: '8px', flex: 1 }}
                            />
                            <small style={{ width: '30px' }}>
                              {product.ratingDistribution[rating]}
                            </small>
                          </div>
                        ))}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{product.sales}</div>
                        <small className="text-success">{formatCurrency(product.revenue)}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{formatDate(product.lastReviewDate)}</div>
                        <small className="text-muted">Last review</small>
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

export default ProductRatingStats
