import client from './client';

const endpoint = '/hot/capability'

const getForms = () => client.get(endpoint);

export default {
  getForms,
}
