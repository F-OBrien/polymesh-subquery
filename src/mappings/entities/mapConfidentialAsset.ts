import { Codec } from '@polkadot/types/types';
import { ConfidentialAsset, ConfidentialVenue, EventIdEnum, ModuleIdEnum } from '../../types';
import { getBigIntValue, getBooleanValue, getTextValue, getNumberValue } from '../util';
import { Attributes, HandlerArgs } from './common';

export const getAuditorsAndMediators = (
  item: Codec
): Pick<Attributes<ConfidentialAsset>, 'auditors' | 'mediators'> => {
  const { auditors, mediators } = JSON.parse(item.toString());

  return {
    auditors,
    mediators,
  };
};

const handleConfidentialAssetCreated = async (blockId: string, params: Codec[]): Promise<void> => {
  const [rawCreator, rawAssetId, rawAuditorsMediators] = params;

  const creatorId = getTextValue(rawCreator);
  const assetId = getTextValue(rawAssetId);
  const { auditors, mediators } = getAuditorsAndMediators(rawAuditorsMediators);

  await ConfidentialAsset.create({
    id: assetId,
    assetId,
    creatorId,
    auditors,
    mediators,
    totalSupply: BigInt(0),
    venueFiltering: false,
    createdBlockId: blockId,
    updatedBlockId: blockId,
  }).save();
};

const handleConfidentialAssetIssued = async (blockId: string, params: Codec[]): Promise<void> => {
  const [, rawAssetId, , rawTotalSupply] = params;

  const assetId = getTextValue(rawAssetId);
  const totalSupply = getBigIntValue(rawTotalSupply);

  const asset = await ConfidentialAsset.get(assetId);

  if (asset) {
    asset.totalSupply = totalSupply;
    asset.updatedBlockId = blockId;

    await asset.save();
  }
};

const handleVenueCreated = async (blockId: string, params: Codec[]): Promise<void> => {
  const [rawCreator, rawVenueId] = params;

  const creatorId = getTextValue(rawCreator);
  const venueId = getNumberValue(rawVenueId);

  await ConfidentialVenue.create({
    id: `${venueId}`,
    venueId,
    creatorId,
    createdBlockId: blockId,
    updatedBlockId: blockId,
  }).save();
};

const handleVenuesAllowed = async (blockId: string, params: Codec[]): Promise<void> => {
  const [, rawAssetId, rawVenueId] = params;

  const assetId = getTextValue(rawAssetId);
  const venuesAllowed = JSON.parse(rawVenueId.toString()).map(val => getNumberValue(val)) || [];

  const asset = await ConfidentialAsset.get(assetId);

  if (asset) {
    const existingVenues = asset.allowedVenues || [];
    asset.allowedVenues = [...new Set([...venuesAllowed, ...existingVenues])];
    asset.updatedBlockId = blockId;

    await asset.save();
  }
};

const handleVenuesBlocked = async (blockId: string, params: Codec[]): Promise<void> => {
  const [, rawAssetId, rawVenueId] = params;

  const assetId = getTextValue(rawAssetId);
  const blockedVenues = JSON.parse(rawVenueId.toString()).map(val => getNumberValue(val));

  const asset = await ConfidentialAsset.get(assetId);

  if (asset) {
    asset.allowedVenues = asset.allowedVenues?.filter(val => !blockedVenues.includes(val));
    asset.updatedBlockId = blockId;

    await asset.save();
  }
};

const handleVenueFiltering = async (blockId: string, params: Codec[]): Promise<void> => {
  const [, rawAssetId, rawEnabled] = params;
  const assetId = getTextValue(rawAssetId);
  const enabled = getBooleanValue(rawEnabled);

  const asset = await ConfidentialAsset.get(assetId);

  if (asset) {
    asset.venueFiltering = enabled;
    asset.updatedBlockId = blockId;

    await asset.save();
  }
};

export const mapConfidentialAsset = async (args: HandlerArgs): Promise<void> => {
  const { blockId, moduleId, eventId, params } = args;

  if (moduleId !== ModuleIdEnum.confidentialasset) {
    return;
  }

  if (eventId === EventIdEnum.ConfidentialAssetCreated) {
    await handleConfidentialAssetCreated(blockId, params);
  }

  if (eventId === EventIdEnum.Issued) {
    await handleConfidentialAssetIssued(blockId, params);
  }

  if (eventId === EventIdEnum.VenueFiltering) {
    await handleVenueFiltering(blockId, params);
  }

  if (eventId === EventIdEnum.VenuesAllowed) {
    await handleVenuesAllowed(blockId, params);
  }

  if (eventId === EventIdEnum.VenuesBlocked) {
    await handleVenuesBlocked(blockId, params);
  }

  if (eventId === EventIdEnum.VenueCreated) {
    await handleVenueCreated(blockId, params);
  }
};
