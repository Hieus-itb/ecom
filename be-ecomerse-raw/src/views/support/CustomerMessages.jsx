import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CAlert, CRow, CCol, CFormInput, 
  CFormTextarea, CFormSelect, CSpinner, CForm, CFormLabel, CFormCheck, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CBadge,
  CInputGroup, CInputGroupText, CProgress, CListGroup, CListGroupItem,
  CImage, CRating, CChartBar, CChartDoughnut, CChartLine, CChartPie,
  CAvatar, CFormTextarea as CTextarea
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const CustomerMessages = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [replyText, setReplyText] = useState('')
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      customerId: 'CUST001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/007bff/ffffff?text=NA',
      channel: 'live_chat',
      priority: 'high',
      status: 'unread',
      subject: 'Vấn đề với đơn hàng #ORD001',
      message: 'Tôi đã đặt hàng từ 3 ngày trước nhưng chưa nhận được thông tin giao hàng. Có thể kiểm tra giúp tôi không?',
      attachments: [],
      orderId: 'ORD001',
      createdAt: '2024-01-07T10:30:00Z',
      updatedAt: '2024-01-07T10:30:00Z',
      lastActivity: '2024-01-07T10:30:00Z',
      assignedTo: null,
      replies: [],
      tags: ['shipping', 'urgent']
    },
    {
      id: 2,
      customerId: 'CUST002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/28a745/ffffff?text=TB',
      channel: 'email',
      priority: 'medium',
      status: 'in_progress',
      subject: 'Yêu cầu hoàn tiền',
      message: 'Sản phẩm tôi mua không đúng như mô tả. Tôi muốn hoàn tiền.',
      attachments: ['receipt.pdf', 'product_image.jpg'],
      orderId: 'ORD002',
      createdAt: '2024-01-06T15:20:00Z',
      updatedAt: '2024-01-06T16:45:00Z',
      lastActivity: '2024-01-06T16:45:00Z',
      assignedTo: 'admin1',
      replies: [
        {
          id: 1,
          message: 'Chúng tôi đã nhận được yêu cầu của bạn. Sẽ xử lý trong 24h.',
          sender: 'admin1',
          senderName: 'Admin Support',
          createdAt: '2024-01-06T16:45:00Z',
          isAdmin: true
        }
      ],
      tags: ['refund', 'product_issue']
    },
    {
      id: 3,
      customerId: 'CUST003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/ffc107/ffffff?text=LC',
      channel: 'live_chat',
      priority: 'low',
      status: 'resolved',
      subject: 'Câu hỏi về sản phẩm',
      message: 'Sản phẩm này có hỗ trợ bảo hành không?',
      attachments: [],
      orderId: null,
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T10:30:00Z',
      lastActivity: '2024-01-05T10:30:00Z',
      assignedTo: 'admin2',
      replies: [
        {
          id: 1,
          message: 'Sản phẩm có bảo hành 12 tháng. Bạn có thể liên hệ hotline để được hỗ trợ.',
          sender: 'admin2',
          senderName: 'Support Team',
          createdAt: '2024-01-05T10:30:00Z',
          isAdmin: true
        }
      ],
      tags: ['warranty', 'product_info']
    },
    {
      id: 4,
      customerId: 'CUST004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/dc3545/ffffff?text=PD',
      channel: 'email',
      priority: 'high',
      status: 'unread',
      subject: 'Khiếu nại dịch vụ',
      message: 'Dịch vụ khách hàng của các bạn rất tệ. Tôi đã gọi nhiều lần nhưng không ai trả lời.',
      attachments: [],
      orderId: 'ORD004',
      createdAt: '2024-01-04T14:45:00Z',
      updatedAt: '2024-01-04T14:45:00Z',
      lastActivity: '2024-01-04T14:45:00Z',
      assignedTo: null,
      replies: [],
      tags: ['complaint', 'service_issue']
    },
    {
      id: 5,
      customerId: 'CUST005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      customerAvatar: 'https://via.placeholder.com/40x40/17a2b8/ffffff?text=HE',
      channel: 'live_chat',
      priority: 'medium',
      status: 'in_progress',
      subject: 'Thay đổi địa chỉ giao hàng',
      message: 'Tôi muốn thay đổi địa chỉ giao hàng cho đơn hàng #ORD005',
      attachments: [],
      orderId: 'ORD005',
      createdAt: '2024-01-03T11:20:00Z',
      updatedAt: '2024-01-03T12:00:00Z',
      lastActivity: '2024-01-03T12:00:00Z',
      assignedTo: 'admin1',
      replies: [
        {
          id: 1,
          message: 'Chúng tôi sẽ cập nhật địa chỉ giao hàng cho bạn.',
          sender: 'admin1',
          senderName: 'Admin Support',
          createdAt: '2024-01-03T12:00:00Z',
          isAdmin: true
        }
      ],
      tags: ['shipping', 'address_change']
    }
  ])

  const [stats, setStats] = useState({
    totalMessages: 125,
    unreadMessages: 8,
    inProgressMessages: 15,
    resolvedMessages: 102,
    averageResponseTime: 2.5, // hours
    customerSatisfaction: 4.2
  })

  const [channels, setChannels] = useState([
    { id: 'live_chat', name: 'Live Chat', count: 45 },
    { id: 'email', name: 'Email', count: 80 }
  ])

  const [priorities, setPriorities] = useState([
    { id: 'high', name: 'High', count: 12 },
    { id: 'medium', name: 'Medium', count: 35 },
    { id: 'low', name: 'Low', count: 78 }
  ])

  const loadMessages = async () => {
    setLoading(true)
    try {
      // Mock data - in real app, this would be API call
      // Data is already initialized above
    } catch (e) {
      setError('Không tải được tin nhắn khách hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMessages() }, [])

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus, updatedAt: new Date().toISOString() }
          : msg
      ))
      
      setSuccess(`Tin nhắn đã được cập nhật thành ${getStatusText(newStatus)}!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi cập nhật trạng thái tin nhắn')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignTo = async (messageId, assignee) => {
    try {
      setSaving(true)
      // In real app, this would be API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, assignedTo: assignee, updatedAt: new Date().toISOString() }
          : msg
      ))
      
      setSuccess('Tin nhắn đã được phân công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Lỗi khi phân công tin nhắn')
    } finally {
      setSaving(false)
    }
  }

  const handleReply = async (messageId) => {
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
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              replies: [...msg.replies, newReply],
              status: 'in_progress',
              updatedAt: new Date().toISOString()
            }
          : msg
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

  const openMessageDetail = (message) => {
    setSelectedMessage(message)
    setReplyText('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedMessage(null)
    setReplyText('')
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchTerm || 
      message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter
    const matchesChannel = channelFilter === 'all' || message.channel === channelFilter
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesChannel && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'danger'
      case 'in_progress': return 'warning'
      case 'resolved': return 'success'
      default: return 'secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'unread': return 'Chưa đọc'
      case 'in_progress': return 'Đang xử lý'
      case 'resolved': return 'Đã giải quyết'
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

  const getChannelText = (channel) => {
    switch (channel) {
      case 'live_chat': return 'Live Chat'
      case 'email': return 'Email'
      default: return channel
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

  return (
    <>
      <CRow className="mb-4">
        <CCol md={8}>
          <h2>Customer Messages</h2>
          <p className="text-muted">Quản lý tin nhắn và hỗ trợ khách hàng</p>
        </CCol>
        <CCol md={4} className="text-end">
          <CButton color="info" variant="outline">
            Export Messages
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
              <h4 className="text-primary">{stats.totalMessages}</h4>
              <p className="text-muted mb-0">Total Messages</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-danger">{stats.unreadMessages}</h4>
              <p className="text-muted mb-0">Unread</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-warning">{stats.inProgressMessages}</h4>
              <p className="text-muted mb-0">In Progress</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success">{stats.resolvedMessages}</h4>
              <p className="text-muted mb-0">Resolved</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-info">{stats.averageResponseTime}h</h4>
              <p className="text-muted mb-0">Avg Response</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={2}>
          <CCard className="text-center">
            <CCardBody>
              <h4 className="text-success">{stats.customerSatisfaction}/5</h4>
              <p className="text-muted mb-0">Satisfaction</p>
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
                placeholder="Tìm kiếm tin nhắn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
            <CCol md={2}>
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="unread">Chưa đọc</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
              </CFormSelect>
            </CCol>
            <CCol md={2}>
              <CFormSelect value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
                <option value="all">Tất cả kênh</option>
                <option value="live_chat">Live Chat</option>
                <option value="email">Email</option>
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
            <CCol md={3}>
              <CButton color="secondary" variant="outline" onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setChannelFilter('all')
                setPriorityFilter('all')
              }}>
                Reset Filters
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Messages Table */}
      <CCard>
        <CCardHeader>
          <strong>Customer Messages ({filteredMessages.length})</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center py-5"><CSpinner color="primary" /></div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                  <CTableHeaderCell>Subject</CTableHeaderCell>
                  <CTableHeaderCell>Channel</CTableHeaderCell>
                  <CTableHeaderCell>Priority</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Assigned To</CTableHeaderCell>
                  <CTableHeaderCell>Time</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredMessages.map((message) => (
                  <CTableRow key={message.id}>
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          src={message.customerAvatar}
                          size="sm"
                          className="me-2"
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{message.customerName}</div>
                          <small className="text-muted">{message.customerEmail}</small>
                          {message.orderId && (
                            <div>
                              <small className="text-info">Order: {message.orderId}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div style={{ fontWeight: 500 }}>{message.subject}</div>
                        <div style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {message.message}
                        </div>
                        {message.attachments.length > 0 && (
                          <small className="text-info">{message.attachments.length} files</small>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={message.channel === 'live_chat' ? 'success' : 'info'}>
                        {getChannelText(message.channel)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getPriorityColor(message.priority)}>
                        {getPriorityText(message.priority)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusColor(message.status)}>
                        {getStatusText(message.status)}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {message.assignedTo ? (
                          <small className="text-success">{message.assignedTo}</small>
                        ) : (
                          <small className="text-muted">Unassigned</small>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        <div>{getTimeAgo(message.createdAt)}</div>
                        <small className="text-muted">{formatDate(message.createdAt)}</small>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1">
                        <CButton 
                          size="sm" 
                          color="info" 
                          variant="outline" 
                          onClick={() => openMessageDetail(message)}
                        >
                          View
                        </CButton>
                        {message.status === 'unread' && (
                          <CButton 
                            size="sm" 
                            color="warning" 
                            variant="outline" 
                            onClick={() => handleStatusChange(message.id, 'in_progress')}
                            disabled={saving}
                          >
                            Start
                          </CButton>
                        )}
                        {message.status === 'in_progress' && (
                          <CButton 
                            size="sm" 
                            color="success" 
                            variant="outline" 
                            onClick={() => handleStatusChange(message.id, 'resolved')}
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

      {/* Message Detail Modal */}
      <CModal visible={modalOpen} onClose={closeModal} size="xl" backdrop="static">
        <CModalHeader>
          <CModalTitle>Message Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedMessage && (
            <CRow className="g-4">
              {/* Customer Info */}
              <CCol md={12}>
                <CCard>
                  <CCardHeader><strong>Customer Information</strong></CCardHeader>
                  <CCardBody>
                    <div className="d-flex align-items-center">
                      <CAvatar
                        src={selectedMessage.customerAvatar}
                        size="lg"
                        className="me-3"
                      />
                      <div>
                        <h5>{selectedMessage.customerName}</h5>
                        <p className="text-muted mb-1">{selectedMessage.customerEmail}</p>
                        <p className="text-muted mb-0">Customer ID: {selectedMessage.customerId}</p>
                        {selectedMessage.orderId && (
                          <p className="text-info mb-0">Order ID: {selectedMessage.orderId}</p>
                        )}
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Message Content */}
              <CCol md={8}>
                <CCard>
                  <CCardHeader>
                    <strong>Message Content</strong>
                    <div className="float-end">
                      <CBadge color={getPriorityColor(selectedMessage.priority)} className="me-2">
                        {getPriorityText(selectedMessage.priority)}
                      </CBadge>
                      <CBadge color={getStatusColor(selectedMessage.status)}>
                        {getStatusText(selectedMessage.status)}
                      </CBadge>
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mb-3">
                      <h5>{selectedMessage.subject}</h5>
                      <p>{selectedMessage.message}</p>
                    </div>
                    
                    {selectedMessage.attachments.length > 0 && (
                      <div>
                        <strong>Attachments:</strong>
                        <div className="mt-2">
                          {selectedMessage.attachments.map((file, idx) => (
                            <CBadge key={idx} color="info" className="me-2">
                              {file}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMessage.tags.length > 0 && (
                      <div className="mt-3">
                        <strong>Tags:</strong>
                        <div className="mt-1">
                          {selectedMessage.tags.map((tag, idx) => (
                            <CBadge key={idx} color="secondary" className="me-1">
                              {tag}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Message Info */}
              <CCol md={4}>
                <CCard>
                  <CCardHeader><strong>Message Information</strong></CCardHeader>
                  <CCardBody>
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Channel:</strong> {getChannelText(selectedMessage.channel)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Created:</strong> {formatDate(selectedMessage.createdAt)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Last Activity:</strong> {formatDate(selectedMessage.lastActivity)}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Assigned To:</strong> 
                        {selectedMessage.assignedTo ? (
                          <span className="text-success ms-2">{selectedMessage.assignedTo}</span>
                        ) : (
                          <span className="text-muted ms-2">Unassigned</span>
                        )}
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Replies:</strong> {selectedMessage.replies.length}
                      </CListGroupItem>
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
                      {selectedMessage.replies.map((reply) => (
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
              <CCol md={12}>
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
                        onClick={() => handleReply(selectedMessage.id)}
                        disabled={saving || !replyText.trim()}
                      >
                        {saving ? 'Sending...' : 'Send Reply'}
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
          {selectedMessage && selectedMessage.status === 'unread' && (
            <CButton 
              color="warning" 
              onClick={() => handleStatusChange(selectedMessage.id, 'in_progress')}
              disabled={saving}
            >
              Start Processing
            </CButton>
          )}
          {selectedMessage && selectedMessage.status === 'in_progress' && (
            <CButton 
              color="success" 
              onClick={() => handleStatusChange(selectedMessage.id, 'resolved')}
              disabled={saving}
            >
              Mark as Resolved
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CustomerMessages
