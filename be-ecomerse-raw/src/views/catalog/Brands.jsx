import React, { useEffect, useState } from 'react'
import { 
  CCard, CCardHeader, CCardBody, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, 
  CForm, CFormInput, CFormTextarea, CSpinner, CRow, CCol 
} from '@coreui/react'
import axiosClient from '../../lib/axiosClient'

const Brands = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', logo: '', description: '' })
  const [searchTerm, setSearchTerm] = useState('')

  const load = async () => {
    setLoading(true)
    try { const res = await axiosClient.get('/brands'); setItems(Array.isArray(res.data)?res.data:[]) } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const onChange = (k) => (e) => setForm((s)=>({ ...s, [k]: e.target.value }))
  const openCreate = () => { setEditing(null); setForm({ name:'', slug:'', logo:'', description:'' }); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name:c.name||'', slug:c.slug||'', logo:c.logo||'', description:c.description||'' }); setModalOpen(true) }

  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    setSaving(true)
    try {
      if (editing && (editing._id||editing.id)) await axiosClient.put(`/brands/${editing._id||editing.id}`, form)
      else await axiosClient.post('/brands', form)
      setModalOpen(false); await load()
    } finally { setSaving(false) }
  }
  const handleDelete = async (c) => { 
    if (!window.confirm('Xóa thương hiệu này?')) return
    try {
      await axiosClient.delete(`/brands/${c._id||c.id}`)
      await load()
    } catch (e) {
      alert('Không thể xóa thương hiệu đang được sử dụng')
    }
  }

  const filteredItems = items.filter(item => 
    !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <CCard>
      <CCardHeader>
        <CRow className="align-items-center">
          <CCol><strong>Brands</strong></CCol>
          <CCol className="text-end">
            <CButton color="primary" onClick={openCreate}>New Brand</CButton>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={6}>
            <CFormInput 
              placeholder="Search brands..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Logo</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Slug</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredItems.map((it)=> (
                <CTableRow key={it._id||it.id}>
                  <CTableDataCell>
                    {it.logo ? (
                      <img src={it.logo} alt={it.name} style={{ height: 32, width: 32, objectFit: 'contain' }} />
                    ) : (
                      <div style={{ height: 32, width: 32, background: '#f8f9fa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                        No Logo
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <div style={{ fontWeight: 500 }}>{it.name}</div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{it.slug}</CTableDataCell>
                  <CTableDataCell>
                    {it.description ? (
                      <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {it.description}
                      </div>
                    ) : '-'}
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <CButton size="sm" color="secondary" variant="outline" onClick={()=>openEdit(it)}>Edit</CButton>{' '}
                    <CButton size="sm" color="danger" variant="outline" onClick={()=>handleDelete(it)}>Delete</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        <CModal visible={modalOpen} onClose={()=>setModalOpen(false)} backdrop="static">
          <CModalHeader><CModalTitle>{editing?'Edit':'Create'} Brand</CModalTitle></CModalHeader>
          <CForm onSubmit={handleSave}>
            <CModalBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput label="Name" value={form.name} onChange={onChange('name')} required />
                </CCol>
                <CCol md={6}>
                  <CFormInput label="Slug" value={form.slug} onChange={onChange('slug')} required />
                </CCol>
                <CCol md={12}>
                  <CFormInput label="Logo URL" value={form.logo} onChange={onChange('logo')} />
                  <small className="text-muted">Enter image URL for brand logo</small>
                </CCol>
                <CCol md={12}>
                  <CFormTextarea 
                    label="Description" 
                    value={form.description} 
                    onChange={onChange('description')} 
                    rows={3}
                    placeholder="Brand description..."
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" variant="outline" onClick={()=>setModalOpen(false)} disabled={saving}>Cancel</CButton>
              <CButton color="primary" type="submit" disabled={saving}>{saving?'Saving...':'Save'}</CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default Brands


