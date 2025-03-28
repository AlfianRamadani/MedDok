import { canisterId, createActor } from '../../../src/declarations/backend';
import { useAuth } from './UseAuth';

export default function useActor() {
  const { user } = useAuth();
  const actor = createActor(canisterId, { agentOptions: { identity: user?.authClient?.getIdentity() } });
  return actor;
}
