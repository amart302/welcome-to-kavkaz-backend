import { ServiceDataResponse } from '@/common/types/service-response.types';

export type AuthWithTokenResponse = ServiceDataResponse<{
  accessToken: string;
}>;
