import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CFormCheck, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge,
  CInputGroup, CInputGroupText, CProgress, CListGroup, CListGroupItem,
  CImage, CRating, CChartBar, CChartDoughnut, CChartLine, CChartPie,
  CAvatar, CFormTextarea as CTextarea, CFormGroup, CFormLabel as CLabel
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const SupportTickets = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  
  const [tickets, setTickets] = useState([
    {
      id: 'TKT001',
      customerId: 'CUST001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/007bff/ffffff?text=NA',
      subject: 'Sản phẩm bị lỗi sau khi mua',
      description: 'Tôi đã mua iPhone 15 Pro nhưng sau 2 ngày sử dụng, máy bị lỗi màn hình. Tôi muốn được đổi sản phẩm mới.',
      category: 'product_issue',
      priority: 'high',
      status: 'open',
      assignedTo: 'admin1',
      assignedToName: 'Admin Support',
      createdAt: '2024-01-07T10:30:00Z',
      updatedAt: '2024-01-07T10:30:00Z',
      dueDate: '2024-01-10T10:30:00Z',
      orderId: 'ORD001',
      tags: ['product_defect', 'replacement'],
      attachments: ['receipt.pdf', 'product_image.jpg'],
      resolution: null,
      satisfaction: null,
      timeSpent: 0, // minutes
      replies: [
        {
          id: 1,
          message: 'Chúng tôi đã nhận được ticket của bạn. Sẽ xử lý trong 24h.',
          sender: 'admin1',
          senderName: 'Admin Support',
          createdAt: '2024-01-07T10:30:00Z',
          isAdmin: true
        }
      ]
    },
    {
      id: 'TKT002',
      customerId: 'CUST002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/28a745/ffffff?text=TB',
      subject: 'Yêu cầu hoàn tiền',
      description: 'Sản phẩm không đúng như mô tả trên website. Tôi muốn hoàn tiền.',
      category: 'refund',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'admin2',
      assignedToName: 'Support Team',
      createdAt: '2024-01-06T15:20:00Z',
      updatedAt: '2024-01-06T16:45:00Z',
      dueDate: '2024-01-09T15:20:00Z',
      orderId: 'ORD002',
      tags: ['refund', 'product_mismatch'],
      attachments: ['product_comparison.jpg'],
      resolution: null,
      satisfaction: null,
      timeSpent: 45,
      replies: [
        {
          id: 1,
          message: 'Chúng tôi đã nhận được yêu cầu hoàn tiền của bạn.',
          sender: 'admin2',
          senderName: 'Support Team',
          createdAt: '2024-01-06T15:20:00Z',
          isAdmin: true
        },
        {
          id: 2,
          message: 'Đang xử lý yêu cầu hoàn tiền. Sẽ có kết quả trong 2-3 ngày.',
          sender: 'admin2',
          senderName: 'Support Team',
          createdAt: '2024-01-06T16:45:00Z',
          isAdmin: true
        }
      ]
    },
    {
      id: 'TKT003',
      customerId: 'CUST003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/ffc107/ffffff?text=LC',
      subject: 'Câu hỏi về bảo hành',
      description: 'Sản phẩm này có bảo hành bao lâu? Tôi có thể đổi hàng không?',
      category: 'general_inquiry',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'admin1',
      assignedToName: 'Admin Support',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T10:30:00Z',
      dueDate: '2024-01-08T09:15:00Z',
      orderId: null,
      tags: ['warranty', 'general'],
      attachments: [],
      resolution: 'Answered customer inquiry about warranty policy',
      satisfaction: 5,
      timeSpent: 15,
      replies: [
        {
          id: 1,
          message: 'Sản phẩm có bảo hành 12 tháng. Bạn có thể đổi hàng trong 30 ngày đầu.',
          sender: 'admin1',
          senderName: 'Admin Support',
          createdAt: '2024-01-05T10:30:00Z',
          isAdmin: true
        }
      ]
    },
    {
      id: 'TKT004',
      customerId: 'CUST004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/dc3545/ffffff?text=PD',
      subject: 'Khiếu nại dịch vụ',
      description: 'Dịch vụ khách hàng của các bạn rất tệ. Tôi đã gọi nhiều lần nhưng không ai trả lời.',
      category: 'complaint',
      priority: 'high',
      status: 'escalated',
      assignedTo: 'manager1',
      assignedToName: 'Manager',
      createdAt: '2024-01-04T14:45:00Z',
      updatedAt: '2024-01-04T16:00:00Z',
      dueDate: '2024-01-07T14:45:00Z',
      orderId: 'ORD004',
      tags: ['complaint', 'service_issue'],
      attachments: [],
      resolution: null,
      satisfaction: null,
      timeSpent: 30,
      replies: [
        {
          id: 1,
          message: 'Xin lỗi về sự bất tiện. Chúng tôi sẽ cải thiện dịch vụ.',
          sender: 'manager1',
          senderName: 'Manager',
          createdAt: '2024-01-04T16:00:00Z',
          isAdmin: true
        }
      ]
    },
    {
      id: 'TKT005',
      customerId: 'CUST005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/17a2b8/ffffff?text=HE',
      subject: 'Thay đổi địa chỉ giao hàng',
      description: 'Tôi muốn thay đổi địa chỉ giao hàng cho đơn hàng #ORD005',
      category: 'shipping',
      priority: 'medium',
      status: 'closed',
      assignedTo: 'admin1',
      assignedToName: 'Admin Support',
      createdAt: '2024-01-03T11:20:00Z',
      updatedAt: '2024-01-03T12:00:00Z',
      dueDate: '2024-01-06T11:20:00Z',
      orderId: 'ORD005',
      tags: ['shipping', 'address_change'],
      attachments: [],
      resolution: 'Updated shipping address successfully',
      satisfaction: 4,
      timeSpent: 20,
      replies: [
        {
          id: 1,
          message: 'Chúng tôi đã cập nhật địa chỉ giao hàng cho bạn.',
          sender: 'admin1',
          senderName: 'Admin Support',
          createdAt: '2024-01-03T12:00:00Z',
          isAdmin: true
        }
      ]
    }
  ])

  const [newTicket, setNewTicket] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
    category: 'general_inquiry',
    priority: 'medium',
    orderId: '',
    tags: []
  })

  const [replyText, setReplyText] = useState('')
  const [resolutionText, setResolutionText] = useState('')

  const [stats, setStats] = useState({
    totalTickets: 125,
    openTickets: 15,
    inProgressTickets: 25,
    resolvedTickets: 60,
    closedTickets: 20,
    escalatedTickets: 5,
    averageResolutionTime: 2.5, // days
    customerSatisfaction: 4.2
  })

  const [categories, setCategories] = useState([
    { id: 'product_issue', name: 'Product Issue', count: 35 },
    { id: 'refund', name: 'Refund Request', count: 20 },
    { id: 'shipping', name: 'Shipping Issue', count: 25 },
    { id: 'general_inquiry', name: 'General Inquiry', count: 30 },
    { id: 'complaint', name: 'Complaint', count: 10 },
    { id: 'technical_support', name: 'Technical Support', count: 5 }
  ])

  const [assignees, setAssignees] = useState([
    { id: 'admin1', name: 'Admin Support' },
    { id: 'admin2', name: 'Support Team' },
    { id: 'manager1', name: 'Manager' },
    { id: 'tech1', name: 'Technical Support' }
  ])

  const loadTickets = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      // Data is already initialized above
    } catch (e) {
      setError('Không tải được danh sách ticket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTickets() }, [])

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
          : ticket
      ))
      
      setSuccess(`Ticket đã được cập nhật thành ${getStatusText(newStatus)}!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi cập nhật trạng thái ticket')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignTo = async (ticketId, assignee) => {
    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const assigneeName = assignees.find(a => a.id === assignee)?.name || assignee
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo: assignee, assignedToName: assigneeName, updatedAt: new Date().toISOString() }
          : ticket
      ))
      
      setSuccess('Ticket đã được phân công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi phân công ticket')
    } finally {
      setSaving(false)
    }
  }

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) {
      setError('Vui lòng nhập phản hồi')
      return
    }

    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newReply = {
        id: Date.now(),
        message: replyText.trim(),
        sender: 'admin1',
        senderName: 'Admin Support',
        createdAt: new Date().toISOString(),
        isAdmin: true
      }
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              replies: [...ticket.replies, newReply],
              status: ticket.status === 'open' ? 'in_progress' : ticket.status,
              updatedAt: new Date().toISOString()
            }
          : ticket
      ))
      
      setReplyText('')
      setSuccess('Phản hồi đã được gửi!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi gửi phản hồi')
    } finally {
      setSaving(false)
    }
  }

  const handleResolve = async (ticketId) => {
    if (!resolutionText.trim()) {
      setError('Vui lòng nhập giải pháp')
      return
    }

    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: 'resolved',
              resolution: resolutionText.trim(),
              updatedAt: new Date().toISOString()
            }
          : ticket
      ))
      
      setResolutionText('')
      setSuccess('Ticket đã được giải quyết!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi giải quyết ticket')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateTicket = async () => {
    if (!newTicket.customerName || !newTicket.subject || !newTicket.description) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const ticket = {
        id: `TKT${String(Date.now()).slice(-6)}`,
        ...newTicket,
        customerAvatar: `https://via.placeholder.com/40x40/007bff/ffffff?text=${newTicket.customerName.charAt(0)}`,
        status: 'open',
        assignedTo: null,
        assignedToName: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        tags: newTicket.tags,
        attachments: [],
        resolution: null,
        satisfaction: null,
        timeSpent: 0,
        replies: []
      }
      
      setTickets(prev => [ticket, ...prev])
      setNewTicket({
        customerId: '',
        customerName: '',
        customerEmail: '',
        subject: '',
        description: '',
        category: 'general_inquiry',
        priority: 'medium',
        orderId: '',
        tags: []
      })
      setCreateModalOpen(false)
      setSuccess('Ticket đã được tạo!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi tạo ticket')
    } finally {
      setSaving(false)
    }
  }

  const openTicketDetail = (ticket) => {
    setSelectedTicket(ticket)
    setReplyText('')
    setResolutionText(ticket.resolution || '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedTicket(null)
    setReplyText('')
    setResolutionText('')
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    const matchesAssignee = assigneeFilter === 'all' || ticket.assignedTo === assigneeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'danger'
      case 'in_progress': return 'warning'
      case 'resolved': return 'info'
      case 'closed': return 'success'
      case 'escalated': return 'secondary'
      default: return 'light'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Mở'
      case 'in_progress': return 'Đang xử lý'
      case 'resolved': return 'Đã giải quyết'
      case 'closed': return 'Đã đóng'
      case 'escalated': return 'Chuyển cấp'
      default: return status
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'secondary'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return priority
    }
  }

  const getCategoryText = (category) => {
    switch (category) {
      case 'product_issue': return 'Lỗi sản phẩm'
      case 'refund': return 'Hoàn tiền'
      case 'shipping': return 'Giao hàng'
      case 'general_inquiry': return 'Câu hỏi chung'
      case 'complaint': return 'Khiếu nại'
      case 'technical_support': return 'Hỗ trợ kỹ thuật'
      default: return category
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours}h trước`
    return `${Math.floor(diffInHours / 24)}d trước`
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol md={8}>
          <h2>Support Tickets</h2>
          <p className="text-muted">Quản lý ticket hỗ trợ khách hàng</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="primary" onClick={() => setCreateModalOpen(true)}>
            Create Ticket
          </CButton>
        </CCol>
      </CRow>

      {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
      {success && <CAlert color="success" className="mb-4">{success}</CAlert>}

      {/* Statistics */}
      <CRow className="mb-4">
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-primary">{stats.totalTickets}</h4>
              <p className="text-muted mb-0">Total Tickets</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-danger">{stats.openTickets}</h4>
              <p className="text-muted mb-0">Open</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning">{stats.inProgressTickets}</h4>
              <p className="text-muted mb-0">In Progress</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info">{stats.resolvedTickets}</h4>
              <p className="text-muted mb-0">Resolved</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success">{stats.closedTickets}</h4>
              <p className="text-muted mb-0">Closed</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-secondary">{stats.escalatedTickets}</h4>
              <p className="text-muted mb-0">Escalated</p>
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
                placeholder="Tìm kiếm ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Mở</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
                <option value="escalated">Chuyển cấp</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">Tất cả mức độ</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">Tất cả danh mục</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}>
                <option value="all">Tất cả người phụ trách</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={1}>
              <CButton color="secondary" variant="outline" onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setPriorityFilter('all')
                setCategoryFilter('all')
                setAssigneeFilter('all')
              }}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Tickets Table */}
      <CCard>
        <CCardHeader>
          <strong>Support Tickets ({filteredTickets.length})</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Subject</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Priority</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Assigned To</CTableHeaderCell>
                  <CTableHeaderCell>Due Date</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredTickets.map((ticket) => (
                  <CTableRow key={ticket.id}>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{ticket.id}</div>
                        <small className="text-muted">{getTimeAgo(ticket.createdAt)}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          src={ticket.customerAvatar}
                          size="sm"
                          className="me-2"
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{ticket.customerName}</div>
                          <small className="text-muted">{ticket.customerEmail}</small>
                          {ticket.orderId && (
                            <div>
                              <small className="text-info">Order: {ticket.orderId}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{ticket.subject}</div>
                        <div style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {ticket.description}
                        </div>
                        <small className="text-muted">{ticket.replies.length} replies</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <small>{getCategoryText(ticket.category)}</small>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {ticket.assignedTo ? (
                          <small className="text-success">{ticket.assignedToName}</small>
                        ) : (
                          <small className="text-muted">Unassigned</small>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div className={isOverdue(ticket.dueDate) ? 'text-danger' : ''}>
                          {formatDate(ticket.dueDate)}
                        </div>
                        {isOverdue(ticket.dueDate) && (
                          <small className="text-danger">Overdue</small>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1">
                        <CButton 
                          size="sm" 
                          color="info" 
                          variant="outline" 
                          onClick={() => openTicketDetail(ticket)}
                        >
                          View
                        </CButton>
                        {ticket.status === 'open' && (
                          <CButton 
                            size="sm" 
                            color="warning" 
                            variant="outline" 
                            onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                            disabled={saving}
                          >
                            Start
                          </CButton>
                        )}
                        {ticket.status === 'in_progress' && (
                          <CButton 
                            size="sm" 
                            color="success" 
                            variant="outline" 
                            onClick={() => handleStatusChange(ticket.id, 'resolved')}
                            disabled={saving}
                          >
                            Resolve
                          </CButton>
                        )}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Ticket Detail Modal */}
      <CModal visible={modalOpen} onClose={closeModal} size="xl" backdrop="static">
        <CModalHeader>
          <CModalTitle>Ticket Details - {selectedTicket?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTicket && (
            <CRow className="g-4">
              {/* Customer Info */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Customer Information</strong></CCardHeader>
                  <CCardBody>
                    <div className="d-flex align-items-center">
                      <CAvatar
                        src={selectedTicket.customerAvatar}
                        size="lg"
                        className="me-3"
                      />
                      <div>
                        <h5>{selectedTicket.customerName}</h5>
                        <p className="text-muted mb-1">{selectedTicket.customerEmail}</p>
                        <p className="text-muted mb-0">Customer ID: {selectedTicket.customerId}</p>
                        {selectedTicket.orderId && (
                          <p className="text-info mb-0">Order ID: {selectedTicket.orderId}</p>
                        )}
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Ticket Content */}
              <CCol md={8}>
                <CCard>
                  <CCardHeader>
                    <strong>Ticket Details</strong>
                    <div className="float-end">
                      <CBadge color={getPriorityColor(selectedTicket.priority)} className="me-2">
                        {getPriorityText(selectedTicket.priority)}
                      </CBadge>
                      <CBadge color={getStatusColor(selectedTicket.status)}>
                        {getStatusText(selectedTicket.status)}
                      </CBadge>
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <h5>{selectedTicket.subject}</h5>
                      <p>{selectedTicket.description}</p>
                    </div>
                    
                    {selectedTicket.attachments.length > 0 && (
                      <div>
                        <strong>Attachments:</strong>
                        <div className="mt-2">
                          {selectedTicket.attachments.map((file, idx) => (
                            <CBadge key={idx} color="info" className="me-2">
                              {file}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTicket.tags.length > 0 && (
                      <div className="mt-3">
                        <strong>Tags:</strong>
                        <div className="mt-1">
                          {selectedTicket.tags.map((tag, idx) => (
                            <CBadge key={idx} color="secondary" className="me-1">
                              {tag}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTicket.resolution && (
                      <div className="mt-3">
                        <strong>Resolution:</strong>
                        <p className="mt-2">{selectedTicket.resolution}</p>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Ticket Info */}
              <CCol md={4}>
                <CCard>
                  <CCardHeader><strong>Ticket Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Category:</strong> {getCategoryText(selectedTicket.category)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Created:</strong> {formatDate(selectedTicket.createdAt)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Updated:</strong> {formatDate(selectedTicket.updatedAt)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Due Date:</strong> 
                        <span className={isOverdue(selectedTicket.dueDate) ? 'text-danger ms-2' : 'ms-2'}>
                          {formatDate(selectedTicket.dueDate)}
                        </span>
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Assigned To:</strong> 
                        {selectedTicket.assignedTo ? (
                          <span className="text-success ms-2">{selectedTicket.assignedToName}</span>
                        ) : (
                          <span className="text-muted ms-2">Unassigned</span>
                        )}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Time Spent:</strong> {selectedTicket.timeSpent} minutes
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Replies:</strong> {selectedTicket.replies.length}
                      </CListGroupItem>
                      {selectedTicket.satisfaction && (
                        <CListGroupItem>
                          <strong>Satisfaction:</strong> 
                          <span className="ms-2">{selectedTicket.satisfaction}/5</span>
                        </CListGroupItem>
                      )}
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Conversation History */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Conversation History</strong></CCardHeader>
                  <CCardBody>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedTicket.replies.map((reply) => (
                        <div key={reply.id} className={`mb-3 p-3 rounded ${reply.isAdmin ? 'bg-light' : 'bg-primary text-white'}`}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{reply.senderName}</strong>
                              <small className="text-muted ms-2">{formatDate(reply.createdAt)}</small>
                            </div>
                          </div>
                          <div className="mt-2">{reply.message}</div>
                        </div>
                      ))}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Reply Form */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Reply to Customer</strong></CCardHeader>
                  <CCardBody>
                    <CTextarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={4}
                    />
                    <div className="mt-3">
                      <CButton 
                        color="primary" 
                        onClick={() => handleReply(selectedTicket.id)}
                        disabled={saving || !replyText.trim()}
                      >
                        {saving ? 'Sending...' : 'Send Reply'}
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Resolution Form */}
              <CCol md={6}>
                <CCard>
                  <CCardHeader><strong>Resolution</strong></CCardHeader>
                  <CCardBody>
                    <CTextarea
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Describe the resolution..."
                      rows={4}
                    />
                    <div className="mt-3">
                      <CButton 
                        color="success" 
                        onClick={() => handleResolve(selectedTicket.id)}
                        disabled={saving || !resolutionText.trim()}
                      >
                        {saving ? 'Resolving...' : 'Mark as Resolved'}
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
          {selectedTicket && selectedTicket.status === 'open' && (
            <CButton 
              color="warning" 
              onClick={() => handleStatusChange(selectedTicket.id, 'in_progress')}
              disabled={saving}
            >
              Start Processing
            </CButton>
          )}
          {selectedTicket && selectedTicket.status === 'in_progress' && (
            <CButton 
              color="success" 
              onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
              disabled={saving}
            >
              Mark as Resolved
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Create Ticket Modal */}
      <CModal visible={createModalOpen} onClose={() => setCreateModalOpen(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Create New Ticket</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput
                label="Customer Name"
                value={newTicket.customerName}
                onChange={(e) => setNewTicket(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                label="Customer Email"
                type="email"
                value={newTicket.customerEmail}
                onChange={(e) => setNewTicket(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="customer@email.com"
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormInput
                label="Subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter ticket subject"
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormTextarea
                label="Description"
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the issue..."
                rows={4}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormSelect
                label="Category"
                value={newTicket.category}
                onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                label="Priority"
                value={newTicket.priority}
                onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </CFormSelect>
            </CCol>
            <CCol md={12}>
              <CFormInput
                label="Order ID (Optional)"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket(prev => ({ ...prev, orderId: e.target.value }))}
                placeholder="ORD001"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setCreateModalOpen(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleCreateTicket} disabled={saving}>
            {saving ? 'Creating...' : 'Create Ticket'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SupportTickets
