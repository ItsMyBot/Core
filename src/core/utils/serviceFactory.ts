import { Manager } from '@itsmybot';

export default class ServiceFactory {
  static async createService(ServiceType: any, manager: Manager): Promise<any> {
    const service = new ServiceType(manager);
    if (service.initialize) await service.initialize();

    return service;
  }
}