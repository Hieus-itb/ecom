import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CButton, CBadge, CRow, CCol, CFormSelect, CModal, 
  CModalHeader, CModalTitle, CModalBody, CModalFooter, CSpinner, CFormInput, 
  CFormTextarea, CAlert, CListGroup, CListGroupItem, CForm, CInputGroup, CInputGroupText
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const returnStatusColors = { 
  requested: 'warning', 
  approved: 'info', 
  processing: 'primary', 
  completed: 'success', 
  rejected: 'danger' 
}

const Returns = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [newReturnModal, setNewReturnModal] = useState(false)
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    reason: '',
    description: '',
    refundAmount: '',
    returnType: 'refund' // refund or exchange
  })

  // Mock data for returns - in real app, this would come from API
  const mockReturns = [
    {
      _id: 'RET001',
      orderId: 'ORD001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      reason: 'Defective Product',
      description: 'Product arrived damaged',
      status: 'requested',
      refundAmount: 29.99,
      returnType: 'refund',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: 'RET002',
      orderId: 'ORD002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      reason: 'Wrong Size',
      description: 'Ordered L but received M',
      status: 'approved',
      refundAmount: 45.00,
      returnType: 'exchange',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16')
    }
  ]

  const load = async () => {
    setLoading(true)
    try {
      // In real app: const res = await axiosClient.get('/admin/returns')
      // For now, use mock data
      setItems(mockReturns)
    } catch (e) {
      setError('Không tải được danh sách đơn hàng trả')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openDetail = (returnItem) => {
    setSelectedReturn(returnItem)
    setDetailModalOpen(true)
  }

  const closeDetail = () => {
    setDetailModalOpen(false)
    setSelectedReturn(null)
  }

  const openNewReturn = () => {
    setReturnForm({
      orderId: '',
      reason: '',
      description: '',
      refundAmount: '',
      returnType: 'refund'
    })
    setNewReturnModal(true)
  }

  const closeNewReturn = () => {
    setNewReturnModal(false)
    setReturnForm({
      orderId: '',
      reason: '',
      description: '',
      refundAmount: '',
      returnType: 'refund'
    })
  }

  const handleCreateReturn = async (e) => {
    e.preventDefault()
    try {
      // In real app: await axiosClient.post('/admin/returns', returnForm)
      console.log('Creating return:', returnForm)
      closeNewReturn()
      await load()
    } catch (e) {
      console.error('Error creating return:', e)
    }
  }

  const updateReturnStatus = async (returnId, newStatus) => {
    try {
      // In real app: await axiosClient.patch(`/admin/returns/${returnId}`, { status: newStatus })
      console.log('Updating return status:', returnId, newStatus)
      await load()
    } catch (e) {
      console.error('Error updating return status:', e)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol><strong>Returns & Refunds Management</strong></CCol>
            <CCol className="text-end">
              <CButton color="primary" onClick={openNewReturn}>New Return</CButton>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={4}>
              <CFormInput 
                placeholder="Search returns..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </CFormSelect>
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
                  <CTableHeaderCell>Return ID</CTableHeaderCell>
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Reason</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredItems.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      <div style={{ fontWeight: 500 }}>{item._id}</div>
                    </CTableDataCell>
                    <CTableDataCell>{item.orderId}</CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{item.customerName}</div>
                        <small className="text-muted">{item.customerEmail}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{item.reason}</div>
                        <small className="text-muted">{item.returnType}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>${item.refundAmount}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={returnStatusColors[item.status] || 'secondary'}>
                        {item.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{new Date(item.createdAt).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell className="text-end">
                      <CRow className="g-2 justify-content-end">
                        <CCol xs="auto">
                          <CButton size="sm" color="info" variant="outline" onClick={() => openDetail(item)}>
                            View
                          </CButton>
                        </CCol>
                        <CCol xs="auto">
                          <CFormSelect 
                            size="sm" 
                            value={item.status} 
                            onChange={(e) => updateReturnStatus(item._id, e.target.value)}
                          >
                            <option value="requested">Requested</option>
                            <option value="approved">Approved</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </CFormSelect>
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

      {/* Return Detail Modal */}
      <CModal visible={detailModalOpen} onClose={closeDetail} size="lg" backdrop="static">
        <CModalHeader>
          <CModalTitle>Return Details - {selectedReturn?._id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedReturn && (
            <CRow className="g-4">
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Customer Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Name:</strong> {selectedReturn.customerName}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Email:</strong> {selectedReturn.customerEmail}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Order ID:</strong> {selectedReturn.orderId}
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Return Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Type:</strong> {selectedReturn.returnType}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Reason:</strong> {selectedReturn.reason}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Amount:</strong> ${selectedReturn.refundAmount}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Status:</strong>
                        <CBadge color={returnStatusColors[selectedReturn.status]} className="ms-2">
                          {selectedReturn.status}
                        </CBadge>
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Description</strong></CCardHeader>
                  <CCardBody>
                    <p>{selectedReturn.description}</p>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={closeDetail}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* New Return Modal */}
      <CModal visible={newReturnModal} onClose={closeNewReturn} backdrop="static">
        <CModalHeader>
          <CModalTitle>Create New Return</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleCreateReturn}>
          <CModalBody>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput 
                  label="Order ID" 
                  value={returnForm.orderId} 
                  onChange={(e) => setReturnForm({...returnForm, orderId: e.target.value})}
                  required 
                />
              </CCol>
              <CCol md={6}>
                <CFormSelect 
                  label="Return Type" 
                  value={returnForm.returnType} 
                  onChange={(e) => setReturnForm({...returnForm, returnType: e.target.value})}
                >
                  <option value="refund">Refund</option>
                  <option value="exchange">Exchange</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput 
                  label="Reason" 
                  value={returnForm.reason} 
                  onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
                  required 
                />
              </CCol>
              <CCol md={6}>
                <CFormInput 
                  label="Refund Amount" 
                  type="number" 
                  step="0.01" 
                  value={returnForm.refundAmount} 
                  onChange={(e) => setReturnForm({...returnForm, refundAmount: e.target.value})}
                  required 
                />
              </CCol>
              <CCol md={12}>
                <CFormTextarea 
                  label="Description" 
                  value={returnForm.description} 
                  onChange={(e) => setReturnForm({...returnForm, description: e.target.value})}
                  rows={3}
                  required 
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="outline" onClick={closeNewReturn}>Cancel</CButton>
            <CButton color="primary" type="submit">Create Return</CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Returns
