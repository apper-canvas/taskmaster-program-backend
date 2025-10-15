const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clientService = {
  async getAll(searchTerm = '', statusFilter = '') {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'full_name_c' } },
          { field: { Name: 'company_name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_number_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_province_c' } },
          { field: { Name: 'postal_code_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'industry_c' } },
          { field: { Name: 'client_status_c' } },
          { field: { Name: 'created_date_c' } },
          { field: { Name: 'last_contacted_c' } },
          { field: { Name: 'notes_c' } },
          { field: { Name: 'website_c' } },
          { field: { Name: 'position_title_c' } },
          { field: { Name: 'source_c' } },
        ],
        where: [],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 },
      };

      if (searchTerm) {
        params.whereGroups = [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  { fieldName: 'full_name_c', operator: 'Contains', values: [searchTerm] },
                  { fieldName: 'company_name_c', operator: 'Contains', values: [searchTerm] },
                  { fieldName: 'email_c', operator: 'Contains', values: [searchTerm] },
                ],
                operator: 'OR',
              },
            ],
          },
        ];
      }

      if (statusFilter) {
        params.where.push({
          FieldName: 'client_status_c',
          Operator: 'EqualTo',
          Values: [statusFilter],
        });
      }

      const response = await apperClient.fetchRecords('client_c', params);

      if (!response?.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error?.response?.data?.message || error);
      throw new Error('Failed to fetch clients. Please try again.');
    }
  },

  async getById(id) {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'full_name_c' } },
          { field: { Name: 'company_name_c' } },
          { field: { Name: 'email_c' } },
          { field: { Name: 'phone_number_c' } },
          { field: { Name: 'address_c' } },
          { field: { Name: 'city_c' } },
          { field: { Name: 'state_province_c' } },
          { field: { Name: 'postal_code_c' } },
          { field: { Name: 'country_c' } },
          { field: { Name: 'industry_c' } },
          { field: { Name: 'client_status_c' } },
          { field: { Name: 'created_date_c' } },
          { field: { Name: 'last_contacted_c' } },
          { field: { Name: 'notes_c' } },
          { field: { Name: 'website_c' } },
          { field: { Name: 'position_title_c' } },
          { field: { Name: 'source_c' } },
        ],
      };

      const response = await apperClient.getRecordById('client_c', id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error?.response?.data?.message || error);
      throw new Error('Failed to fetch client details. Please try again.');
    }
  },

  async create(clientData) {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const record = {};

      if (clientData.Name) record.Name = clientData.Name;
      if (clientData.Tags) record.Tags = clientData.Tags;
      if (clientData.full_name_c) record.full_name_c = clientData.full_name_c;
      if (clientData.company_name_c) record.company_name_c = clientData.company_name_c;
      if (clientData.email_c) record.email_c = clientData.email_c;
      if (clientData.phone_number_c) record.phone_number_c = clientData.phone_number_c;
      if (clientData.address_c) record.address_c = clientData.address_c;
      if (clientData.city_c) record.city_c = clientData.city_c;
      if (clientData.state_province_c) record.state_province_c = clientData.state_province_c;
      if (clientData.postal_code_c) record.postal_code_c = clientData.postal_code_c;
      if (clientData.country_c) record.country_c = clientData.country_c;
      if (clientData.industry_c) record.industry_c = clientData.industry_c;
      if (clientData.client_status_c) record.client_status_c = clientData.client_status_c;
      if (clientData.created_date_c) record.created_date_c = clientData.created_date_c;
      if (clientData.last_contacted_c) record.last_contacted_c = clientData.last_contacted_c;
      if (clientData.notes_c) record.notes_c = clientData.notes_c;
      if (clientData.website_c) record.website_c = clientData.website_c;
      if (clientData.position_title_c) record.position_title_c = clientData.position_title_c;
      if (clientData.source_c) record.source_c = clientData.source_c;

      const params = { records: [record] };

      const response = await apperClient.createRecord('client_c', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create client');
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create client:`, failed);
          failed.forEach((record) => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error creating client:', error?.response?.data?.message || error);
      throw new Error(error.message || 'Failed to create client. Please try again.');
    }
  },

  async update(id, clientData) {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const record = { Id: id };

      if (clientData.Name !== undefined) record.Name = clientData.Name;
      if (clientData.Tags !== undefined) record.Tags = clientData.Tags;
      if (clientData.full_name_c !== undefined) record.full_name_c = clientData.full_name_c;
      if (clientData.company_name_c !== undefined) record.company_name_c = clientData.company_name_c;
      if (clientData.email_c !== undefined) record.email_c = clientData.email_c;
      if (clientData.phone_number_c !== undefined) record.phone_number_c = clientData.phone_number_c;
      if (clientData.address_c !== undefined) record.address_c = clientData.address_c;
      if (clientData.city_c !== undefined) record.city_c = clientData.city_c;
      if (clientData.state_province_c !== undefined) record.state_province_c = clientData.state_province_c;
      if (clientData.postal_code_c !== undefined) record.postal_code_c = clientData.postal_code_c;
      if (clientData.country_c !== undefined) record.country_c = clientData.country_c;
      if (clientData.industry_c !== undefined) record.industry_c = clientData.industry_c;
      if (clientData.client_status_c !== undefined) record.client_status_c = clientData.client_status_c;
      if (clientData.created_date_c !== undefined) record.created_date_c = clientData.created_date_c;
      if (clientData.last_contacted_c !== undefined) record.last_contacted_c = clientData.last_contacted_c;
      if (clientData.notes_c !== undefined) record.notes_c = clientData.notes_c;
      if (clientData.website_c !== undefined) record.website_c = clientData.website_c;
      if (clientData.position_title_c !== undefined) record.position_title_c = clientData.position_title_c;
      if (clientData.source_c !== undefined) record.source_c = clientData.source_c;

      const params = { records: [record] };

      const response = await apperClient.updateRecord('client_c', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update client');
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update client:`, failed);
          failed.forEach((record) => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data || null;
      }

      return null;
    } catch (error) {
      console.error('Error updating client:', error?.response?.data?.message || error);
      throw new Error(error.message || 'Failed to update client. Please try again.');
    }
  },

  async delete(id) {
    try {
      await delay(300);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = { RecordIds: [id] };

      const response = await apperClient.deleteRecord('client_c', params);

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete client');
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete client:`, failed);
          failed.forEach((record) => {
            if (record.message) throw new Error(record.message);
          });
        }

        return true;
      }

      return true;
    } catch (error) {
      console.error('Error deleting client:', error?.response?.data?.message || error);
      throw new Error(error.message || 'Failed to delete client. Please try again.');
    }
  },
};

export default clientService;