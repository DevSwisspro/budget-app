import { hasPin } from './pin';

export async function bootstrapRoute(): Promise<'create'|'login'> {
  return (await hasPin()) ? 'login' : 'create';
}
