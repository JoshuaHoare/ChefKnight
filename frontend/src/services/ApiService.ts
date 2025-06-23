import axios from 'axios';
import { ContentStatus } from '../types';

const API_BASE_URL = '';  // Empty base URL since we're using the proxy in package.json

export class ApiService {
  static async getStatus(): Promise<ContentStatus> {
    const response = await axios.get(`${API_BASE_URL}/api/status`);
    return response.data;
  }

  static async pullContent(): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/api/pull`);
    return response.data;
  }

  static async pushContent(commitMessage: string): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/api/push`, { msg: commitMessage });
    return response.data;
  }

  static async getContentFile(folder: string, file: string): Promise<string> {
    try {
      // This is a placeholder - we'll need to implement this endpoint in the backend
      const response = await axios.get(`${API_BASE_URL}/api/content/${folder}/${file}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content file:', error);
      throw error;
    }
  }
}
