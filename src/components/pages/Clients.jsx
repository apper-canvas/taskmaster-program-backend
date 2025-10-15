import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import clientService from '@/services/api/clientService';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    full_name_c: '',
    company_name_c: '',
    email_c: '',
    phone_number_c: '',
    address_c: '',
    city_c: '',
    state_province_c: '',
    postal_code_c: '',
    country_c: '',
    industry_c: '',
    client_status_c: 'Active',
    created_date_c: '',
    last_contacted_c: '',
    notes_c: '',
    website_c: '',
    position_title_c: '',
    source_c: '',
    Tags: '',
  });

  useEffect(() => {
    loadClients();
  }, [searchTerm, statusFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAll(searchTerm, statusFilter);
      setClients(data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name_c || !formData.email_c) {
      toast.error('Full Name and Email are required');
      return;
    }

    try {
      if (editingClient) {
        await clientService.update(editingClient.Id, formData);
        toast.success('Client updated successfully');
      } else {
        await clientService.create(formData);
        toast.success('Client created successfully');
      }

      setShowModal(false);
      resetForm();
      loadClients();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      Name: client.Name || '',
      full_name_c: client.full_name_c || '',
      company_name_c: client.company_name_c || '',
      email_c: client.email_c || '',
      phone_number_c: client.phone_number_c || '',
      address_c: client.address_c || '',
      city_c: client.city_c || '',
      state_province_c: client.state_province_c || '',
      postal_code_c: client.postal_code_c || '',
      country_c: client.country_c || '',
      industry_c: client.industry_c || '',
      client_status_c: client.client_status_c || 'Active',
      created_date_c: client.created_date_c || '',
      last_contacted_c: client.last_contacted_c || '',
      notes_c: client.notes_c || '',
      website_c: client.website_c || '',
      position_title_c: client.position_title_c || '',
      source_c: client.source_c || '',
      Tags: client.Tags || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await clientService.delete(id);
      toast.success('Client deleted successfully');
      loadClients();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      full_name_c: '',
      company_name_c: '',
      email_c: '',
      phone_number_c: '',
      address_c: '',
      city_c: '',
      state_province_c: '',
      postal_code_c: '',
      country_c: '',
      industry_c: '',
      client_status_c: 'Active',
      created_date_c: '',
      last_contacted_c: '',
      notes_c: '',
      website_c: '',
      position_title_c: '',
      source_c: '',
      Tags: '',
    });
    setEditingClient(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Prospect':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Lead':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Referral':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Web':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Ads':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading && clients.length === 0) {
    return <Loading message="Loading clients..." />;
  }

  if (error && clients.length === 0) {
    return <Error message={error} onRetry={loadClients} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-slate-600 mt-1">Manage your client relationships</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
        >
          <ApperIcon name="Plus" size={16} />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search clients by name, company, or email..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Prospect">Prospect</option>
          <option value="Lead">Lead</option>
        </Select>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <Empty
          icon="Users"
          title="No clients found"
          description={
            searchTerm || statusFilter
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'
          }
          action={
            !searchTerm && !statusFilter ? (
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <ApperIcon name="Plus" size={16} />
                Add First Client
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {clients.map((client) => (
                  <tr key={client.Id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.full_name_c?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {client.full_name_c || 'Unnamed Client'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {client.position_title_c || 'No position'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {client.company_name_c || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-500">
                        {client.industry_c || 'No industry'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{client.email_c || 'N/A'}</div>
                      <div className="text-sm text-slate-500">
                        {client.phone_number_c || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(client.client_status_c)}>
                        {client.client_status_c || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.source_c ? (
                        <Badge className={getSourceColor(client.source_c)}>
                          {client.source_c}
                        </Badge>
                      ) : (
                        <span className="text-sm text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <ApperIcon name="Pencil" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name_c">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name_c"
                      type="text"
                      value={formData.full_name_c}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name_c: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position_title_c">Position / Title</Label>
                    <Input
                      id="position_title_c"
                      type="text"
                      value={formData.position_title_c}
                      onChange={(e) =>
                        setFormData({ ...formData, position_title_c: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email_c">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email_c"
                      type="email"
                      value={formData.email_c}
                      onChange={(e) =>
                        setFormData({ ...formData, email_c: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number_c">Phone Number</Label>
                    <Input
                      id="phone_number_c"
                      type="tel"
                      value={formData.phone_number_c}
                      onChange={(e) =>
                        setFormData({ ...formData, phone_number_c: e.target.value })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="website_c">Website</Label>
                    <Input
                      id="website_c"
                      type="url"
                      value={formData.website_c}
                      onChange={(e) =>
                        setFormData({ ...formData, website_c: e.target.value })
                      }
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name_c">Company Name</Label>
                    <Input
                      id="company_name_c"
                      type="text"
                      value={formData.company_name_c}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry_c">Industry</Label>
                    <Input
                      id="industry_c"
                      type="text"
                      value={formData.industry_c}
                      onChange={(e) =>
                        setFormData({ ...formData, industry_c: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address_c">Address</Label>
                    <Input
                      id="address_c"
                      type="text"
                      value={formData.address_c}
                      onChange={(e) =>
                        setFormData({ ...formData, address_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city_c">City</Label>
                    <Input
                      id="city_c"
                      type="text"
                      value={formData.city_c}
                      onChange={(e) =>
                        setFormData({ ...formData, city_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="state_province_c">State / Province</Label>
                    <Input
                      id="state_province_c"
                      type="text"
                      value={formData.state_province_c}
                      onChange={(e) =>
                        setFormData({ ...formData, state_province_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code_c">Postal Code</Label>
                    <Input
                      id="postal_code_c"
                      type="text"
                      value={formData.postal_code_c}
                      onChange={(e) =>
                        setFormData({ ...formData, postal_code_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="country_c">Country</Label>
                    <Input
                      id="country_c"
                      type="text"
                      value={formData.country_c}
                      onChange={(e) =>
                        setFormData({ ...formData, country_c: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_status_c">Client Status</Label>
                    <Select
                      id="client_status_c"
                      value={formData.client_status_c}
                      onChange={(e) =>
                        setFormData({ ...formData, client_status_c: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Lead">Lead</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="source_c">Source</Label>
                    <Select
                      id="source_c"
                      value={formData.source_c}
                      onChange={(e) =>
                        setFormData({ ...formData, source_c: e.target.value })
                      }
                    >
                      <option value="">Select source...</option>
                      <option value="Referral">Referral</option>
                      <option value="Web">Web</option>
                      <option value="Ads">Ads</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="created_date_c">Created Date</Label>
                    <Input
                      id="created_date_c"
                      type="datetime-local"
                      value={formData.created_date_c}
                      onChange={(e) =>
                        setFormData({ ...formData, created_date_c: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_contacted_c">Last Contacted</Label>
                    <Input
                      id="last_contacted_c"
                      type="datetime-local"
                      value={formData.last_contacted_c}
                      onChange={(e) =>
                        setFormData({ ...formData, last_contacted_c: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  Additional Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="Tags">Tags</Label>
                    <Input
                      id="Tags"
                      type="text"
                      value={formData.Tags}
                      onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
                      placeholder="Enter comma-separated tags"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes_c">Notes</Label>
                    <textarea
                      id="notes_c"
                      rows="4"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={formData.notes_c}
                      onChange={(e) =>
                        setFormData({ ...formData, notes_c: e.target.value })
                      }
                      placeholder="Add any additional notes about this client..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}