'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/app/components/Button'
import Card from '@/app/components/Card'
import Input from '@/app/components/Input'
import Textarea from '@/app/components/Textarea'
import Alert from '@/app/components/Alert'
import Loading from '@/app/components/Loading'
import { formatDate, formatKm } from '@/lib/utils'
import { Download, Plus, LogOut, QrCode, Edit, Trash2, History } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [records, setRecords] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [showHistory, setShowHistory] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverName: '',
    departureDate: '',
    arrivalDate: '',
    initialKm: '',
    finalKm: '',
    purpose: '',
    observations: '',
  })
  
  // Carrega dados iniciais
  useEffect(() => {
    loadRecords()
    loadVehicles()
  }, [])
  
  const loadRecords = async () => {
    try {
      const response = await fetch('/api/records')
      const data = await response.json()
      if (data.success) {
        setRecords(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const loadVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      if (data.success) {
        setVehicles(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const url = editingRecord 
        ? `/api/records/${editingRecord.id}` 
        : '/api/records'
      
      const method = editingRecord ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          initialKm: parseFloat(formData.initialKm),
          finalKm: parseFloat(formData.finalKm),
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Erro ao salvar registro')
      } else {
        setSuccess(data.message)
        setShowForm(false)
        setEditingRecord(null)
        resetForm()
        loadRecords()
      }
    } catch (error) {
      setError('Erro ao salvar registro')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return
    
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('Registro deletado com sucesso')
        loadRecords()
      } else {
        setError(data.error || 'Erro ao deletar')
      }
    } catch (error) {
      setError('Erro ao deletar registro')
    }
  }
  
  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setFormData({
      vehicleId: record.vehicleId,
      driverName: record.driverName,
      departureDate: new Date(record.departureDate).toISOString().slice(0, 16),
      arrivalDate: new Date(record.arrivalDate).toISOString().slice(0, 16),
      initialKm: record.initialKm.toString(),
      finalKm: record.finalKm.toString(),
      purpose: record.purpose || '',
      observations: record.observations || '',
    })
    setShowForm(true)
  }
  
  const loadHistory = async (recordId: string) => {
    try {
      const response = await fetch(`/api/records/${recordId}/history`)
      const data = await response.json()
      if (data.success) {
        setHistory(data.data)
        setShowHistory(recordId)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }
  
  const resetForm = () => {
    setFormData({
      vehicleId: '',
      driverName: '',
      departureDate: '',
      arrivalDate: '',
      initialKm: '',
      finalKm: '',
      purpose: '',
      observations: '',
    })
  }
  
  const handleExport = (format: string) => {
    window.open(`/api/export/${format}`, '_blank')
  }
  
  const showQRCode = () => {
    const url = window.location.origin
    window.open(`/api/qrcode?url=${encodeURIComponent(url)}`, '_blank')
  }
  
  if (status === 'loading' || loading) {
    return <Loading />
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">🚗 Quilometragem Veicular</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={showQRCode}>
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Code
              </Button>
              <Button variant="secondary" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 inline mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}
        
        {success && (
          <div className="mb-4">
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
          </div>
        )}
        
        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Button onClick={() => { setShowForm(!showForm); setEditingRecord(null); resetForm(); }}>
            <Plus className="w-4 h-4 inline mr-2" />
            Novo Registro
          </Button>
          
          <Button variant="secondary" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 inline mr-2" />
            Exportar CSV
          </Button>
          
          <Button variant="secondary" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 inline mr-2" />
            Exportar Excel
          </Button>
          
          <Button variant="secondary" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 inline mr-2" />
            Exportar PDF
          </Button>
        </div>
        
        {/* Form */}
        {showForm && (
          <Card className="mb-6" title={editingRecord ? 'Editar Registro' : 'Novo Registro'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Veículo *</label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Condutor"
                  name="driverName"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  required
                />
                
                <Input
                  label="Data/Hora Saída"
                  name="departureDate"
                  type="datetime-local"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  required
                />
                
                <Input
                  label="Data/Hora Chegada"
                  name="arrivalDate"
                  type="datetime-local"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  required
                />
                
                <Input
                  label="KM Inicial"
                  name="initialKm"
                  type="number"
                  step="0.1"
                  value={formData.initialKm}
                  onChange={(e) => setFormData({ ...formData, initialKm: e.target.value })}
                  required
                />
                
                <Input
                  label="KM Final"
                  name="finalKm"
                  type="number"
                  step="0.1"
                  value={formData.finalKm}
                  onChange={(e) => setFormData({ ...formData, finalKm: e.target.value })}
                  required
                />
                
                <Input
                  label="Motivo"
                  name="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>
              
              <Textarea
                label="Observações"
                name="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              />
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingRecord ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => { setShowForm(false); setEditingRecord(null); resetForm(); }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {/* Records Table */}
        <Card title="Registros de Quilometragem">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condutor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saída</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chegada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distância</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.driverName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.vehicle?.licensePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(record.departureDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(record.arrivalDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatKm(record.distanceTraveled)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => loadHistory(record.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Histórico"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
                <button
                  onClick={() => setShowHistory(null)}
                  className="text-2xl font-bold hover:opacity-70"
                >
                  ×
                </button>
              </div>
              
              {history.length === 0 ? (
                <p className="text-gray-500">Nenhuma alteração registrada</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="text-sm text-gray-600">{formatDate(item.changeDate)}</div>
                      <div className="font-medium">{item.fieldChanged}</div>
                      <div className="text-sm">
                        <span className="text-red-600">{item.previousValue}</span>
                        {' → '}
                        <span className="text-green-600">{item.newValue}</span>
                      </div>
                      {item.user && (
                        <div className="text-xs text-gray-500 mt-1">
                          Por: {item.user.name || item.user.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
