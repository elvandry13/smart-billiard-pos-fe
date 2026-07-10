import { apiClient } from '@/lib/apiClient';

import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfile,
} from './types';

export const getProfileApi = (): Promise<UserProfile> => {
  return apiClient<UserProfile>('/profile/');
};

export const updateProfileApi = (payload: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  return apiClient<UpdateProfileResponse>('/profile/', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const changePasswordApi = (payload: ChangePasswordRequest): Promise<void> => {
  return apiClient<void>('/auth/password/change/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};