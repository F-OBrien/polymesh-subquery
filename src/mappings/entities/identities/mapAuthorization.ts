import { Codec } from '@polkadot/types/types';
import { SubstrateEvent } from '@subql/types';
import { Authorization, AuthorizationStatusEnum, AuthTypeEnum, EventIdEnum } from '../../../types';
import {
  capitalizeFirstLetter,
  getDateValue,
  getFirstKeyFromJson,
  getFirstValueFromJson,
  getTextValue,
  padId,
  serializeAccount,
} from '../../../utils';
import { extractArgs } from '../common';
import { createIdentityIfNotExists } from './mapIdentities';

const authorizationEventStatusMapping = new Map<EventIdEnum, AuthorizationStatusEnum>([
  [EventIdEnum.AuthorizationConsumed, AuthorizationStatusEnum.Consumed],
  [EventIdEnum.AuthorizationRevoked, AuthorizationStatusEnum.Revoked],
  [EventIdEnum.AuthorizationRejected, AuthorizationStatusEnum.Rejected],
]);

const processAuthId = (id: Codec): string => {
  return padId(getTextValue(id));
};

export async function handleAuthorization(event: SubstrateEvent): Promise<void> {
  const { eventId, blockId, params, eventIdx, block } = extractArgs(event);

  if (authorizationEventStatusMapping.has(eventId)) {
    const authId = processAuthId(params[2]);
    const auth = await Authorization.get(authId);
    auth.status = authorizationEventStatusMapping.get(eventId);
    auth.updatedBlockId = blockId;

    await auth.save();
  } else {
    const fromId = getTextValue(params[0]);

    // For `identity.cdd_register_did` extrinsic with params including `SecondaryKey` along with `TargetAccount`, `AuthorizationAdded` event is triggered before `DidCreated` event.
    await createIdentityIfNotExists(fromId, blockId, eventId, eventIdx, block);
    const authId = processAuthId(params[3]);
    await Authorization.create({
      id: authId,
      authId: Number(authId),
      fromId,
      toId: getTextValue(params[1]),
      toKey: serializeAccount(params[2]),
      type: capitalizeFirstLetter(getFirstKeyFromJson(params[4])) as AuthTypeEnum,
      data: JSON.stringify(getFirstValueFromJson(params[4])),
      expiry: getDateValue(params[5]),
      status: AuthorizationStatusEnum.Pending,
      createdBlockId: blockId,
      updatedBlockId: blockId,
    }).save();
  }
}
