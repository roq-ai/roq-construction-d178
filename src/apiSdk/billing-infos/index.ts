import axios from 'axios';
import queryString from 'query-string';
import { BillingInfoInterface, BillingInfoGetQueryInterface } from 'interfaces/billing-info';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBillingInfos = async (
  query?: BillingInfoGetQueryInterface,
): Promise<PaginatedInterface<BillingInfoInterface>> => {
  const response = await axios.get('/api/billing-infos', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBillingInfo = async (billingInfo: BillingInfoInterface) => {
  const response = await axios.post('/api/billing-infos', billingInfo);
  return response.data;
};

export const updateBillingInfoById = async (id: string, billingInfo: BillingInfoInterface) => {
  const response = await axios.put(`/api/billing-infos/${id}`, billingInfo);
  return response.data;
};

export const getBillingInfoById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/billing-infos/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBillingInfoById = async (id: string) => {
  const response = await axios.delete(`/api/billing-infos/${id}`);
  return response.data;
};
