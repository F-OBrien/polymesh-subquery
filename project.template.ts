import {
  SubstrateDatasourceKind,
  SubstrateEventHandler,
  SubstrateHandlerKind,
  SubstrateProject,
} from '@subql/types';

const filters = {
  asset: [
    'AssetBalanceUpdated',
    'AssetCreated',
    'AssetFrozen',
    'AssetOwnershipTransferred',
    'AssetRenamed',
    'AssetTypeChanged',
    'AssetUnfrozen',
    'ControllerTransfer',
    'CustomAssetTypeExists',
    'CustomAssetTypeRegistered',
    'DivisibilityChanged',
    'DocumentAdded',
    'DocumentRemoved',
    'ExtensionRemoved',
    'FundingRoundSet',
    'IdentifiersUpdated',
    'IsIssuable',
    'Issued',
    'LocalMetadataKeyDeleted',
    'MetadataValueDeleted',
    'Redeemed',
    'RegisterAssetMetadataGlobalType',
    'RegisterAssetMetadataLocalType',
    'SetAssetMetadataValue',
    'SetAssetMetadataValueDetails',
    'TickerRegistered',
    'TickerTransferred',
    'Transfer',
    'TransferWithData',
    'PreApprovedAsset',
    'RemovePreApprovedAsset',
  ],
  identity: [
    'AssetDidRegistered',
    'AuthorizationAdded',
    'AuthorizationConsumed',
    'AuthorizationRejected',
    'AuthorizationRetryLimitReached',
    'AuthorizationRevoked',
    'CddClaimsInvalidated',
    'CddRequirementForPrimaryKeyUpdated',
    'ChildDidCreated',
    'ChildDidUnlinked',
    'ClaimAdded',
    'ClaimRevoked',
    'CustomClaimTypeAdded',
    'DidCreated',
    'PrimaryKeyUpdated',
    'SecondaryKeyLeftIdentity',
    'SecondaryKeyPermissionsUpdated',
    'SecondaryKeysAdded',
    'SecondaryKeysFrozen',
    'SecondaryKeysRemoved',
    'SecondaryKeysUnfrozen',
  ],
  bridge: [
    'AdminChanged',
    'BridgeLimitUpdated',
    'BridgeTxFailed',
    'BridgeTxScheduleFailed',
    'BridgeTxScheduled',
    'Bridged',
    'ControllerChanged',
    'ExemptedUpdated',
    'FreezeAdminAdded',
    'FreezeAdminRemoved',
    'Frozen',
    'FrozenTx',
    'TimelockChanged',
    'TxRemoved',
    'TxsHandled',
    'Unfrozen',
    'UnfrozenTx',
  ],
  complianceManager: [
    'AssetCompliancePaused',
    'AssetComplianceReplaced',
    'AssetComplianceReset',
    'AssetComplianceResumed',
    'ComplianceRequirementChanged',
    'ComplianceRequirementCreated',
    'ComplianceRequirementRemoved',
    'TrustedDefaultClaimIssuerAdded',
    'TrustedDefaultClaimIssuerRemoved',
  ],
  corporateAction: [
    'CAInitiated',
    'CALinkedToDoc',
    'CARemoved',
    'DefaultTargetIdentitiesChanged',
    'DefaultWithholdingTaxChanged',
    'DidWithholdingTaxChanged',
    'MaxDetailsLengthChanged',
    'RecordDateChanged',
  ],
  capitalDistribution: ['BenefitClaimed', 'Created', 'Reclaimed', 'Removed'],
  externalAgents: [
    'AgentAdded',
    'AgentRemoved',
    'GroupChanged',
    'GroupCreated',
    'GroupPermissionsUpdated',
  ],
  corporateBallot: ['Created', 'MetaChanged', 'RCVChanged', 'RangeChanged', 'Removed', 'VoteCast'],
  checkpoint: [
    'CheckpointCreated',
    'MaximumSchedulesComplexityChanged',
    'ScheduleCreated',
    'ScheduleRemoved',
  ],
  multiSig: [
    'MultiSigCreated',
    'MultiSigSignaturesRequiredChanged',
    'MultiSigSignerAdded',
    'MultiSigSignerAuthorized',
    'MultiSigSignerRemoved',
    'ProposalAdded',
    'ProposalApproved',
    'ProposalExecuted',
    'ProposalExecutionFailed',
    'ProposalRejected',
    'ProposalRejectionVote',
    'SchedulingFailed',
  ],
  nft: ['NFTPortfolioUpdated', 'NftCollectionCreated'],
  portfolio: [
    'FundsMovedBetweenPortfolios',
    'MovedBetweenPortfolios',
    'PortfolioCreated',
    'PortfolioCustodianChanged',
    'PortfolioDeleted',
    'PortfolioRenamed',
    'UserPortfolios',
  ],
  pips: [
    'ActivePipLimitChanged',
    'DefaultEnactmentPeriodChanged',
    'ExecutionCancellingFailed',
    'ExecutionScheduled',
    'ExecutionSchedulingFailed',
    'ExpiryScheduled',
    'ExpirySchedulingFailed',
    'HistoricalPipsPruned',
    'MaxPipSkipCountChanged',
    'MinimumProposalDepositChanged',
    'PendingPipExpiryChanged',
    'PipClosed',
    'PipSkipped',
    'ProposalCreated',
    'ProposalRefund',
    'ProposalStateUpdated',
    'SnapshotCleared',
    'SnapshotResultsEnacted',
    'SnapshotTaken',
    'Voted',
  ],
  settlement: [
    'AffirmationWithdrawn',
    'FailedToExecuteInstruction',
    'InstructionAuthorized',
    'InstructionUnauthorized',
    'InstructionAffirmed',
    'InstructionCreated',
    'InstructionExecuted',
    'InstructionFailed',
    'InstructionRejected',
    'InstructionRescheduled',
    'LegFailedExecution',
    'ReceiptClaimed',
    'SchedulingFailed',
    'SettlementManuallyExecuted',
    'VenueCreated',
    'VenueDetailsUpdated',
    'VenueFiltering',
    'VenueSignersUpdated',
    'VenueTypeUpdated',
    'VenueUnauthorized',
    'VenuesAllowed',
    'VenuesBlocked',
  ],
  statistics: [
    'AssetStatsUpdated',
    'SetAssetTransferCompliance',
    'StatTypesAdded',
    'StatTypesRemoved',
    'TransferManagerAdded',
    'TransferManagerRemoved',
    'ExemptionsAdded',
    'ExemptionsRemoved',
    'TransferConditionExemptionsAdded',
    'TransferConditionExemptionsRemoved',
  ],
  sto: [
    'FundraiserClosed',
    'FundraiserCreated',
    'FundraiserFrozen',
    'FundraiserUnfrozen',
    'FundraiserWindowModified',
    'Invested',
  ],
  transactionPayment: ['TransactionFeePaid'],
  staking: [
    'Bonded',
    'CommissionCapUpdated',
    'EraPayout',
    'InvalidatedNominators',
    'MinimumBondThresholdUpdated',
    'Nominated',
    'OldSlashingReportDiscarded',
    'PermissionedIdentityAdded',
    'PermissionedIdentityRemoved',
    'Reward',
    'RewardPaymentSchedulingInterrupted',
    'Slash',
    'SlashingAllowedForChanged',
    'SolutionStored',
    'StakingElection',
    'Unbonded',
    'Withdrawn',
  ],
  treasury: ['TreasuryDisbursement', 'TreasuryDisbursementFailed', 'TreasuryReimbursement'],
  balances: [
    'AccountBalanceBurned',
    'BalanceSet',
    'Endowed',
    'ReserveRepatriated',
    'Reserved',
    'Transfer',
    'Unreserved',
  ],
  protocolFee: ['FeeCharged'],
  system: ['CodeUpdated', 'NewAccount'],
  confidentialAsset: [
    'AccountCreated',
    'AccountDeposit',
    'AccountDepositIncoming',
    'AccountWithdraw',
    'AccountAssetFrozen',
    'AccountAssetUnfrozen',
    'AssetCreated',
    'AssetFrozen',
    'AssetUnfrozen',
    'AssetBurned',
    'Issued',
    'TransactionAffirmed',
    'TransactionCreated',
    'TransactionExecuted',
    'TransactionRejected',
    'VenueCreated',
    'VenueFiltering',
    'VenuesAllowed',
    'VenuesBlocked',
  ],
};

const handlers: SubstrateEventHandler[] = Object.keys(filters)
  .map(module =>
    filters[module].map(method => ({
      kind: SubstrateHandlerKind.Event,
      handler: 'handleEvent',
      filter: {
        module,
        method,
      },
    }))
  )
  .flat();

const project: SubstrateProject = {
  specVersion: '1.0.0',
  version: '0.0.1',
  name: 'polkadot-starter',
  description: 'This project can be used as a starting point for developing your SubQuery project',
  runner: {
    node: {
      name: '@subql/node',
      version: '>=3.0.1',
    },
    query: {
      name: '@subql/query',
      version: '*',
    },
  },
  schema: {
    file: './schema.graphql',
  },
  network: {
    /* The genesis hash of the network (hash of block 0) */
    chainId: '$NETWORK_CHAIN_ID',
    /**
     * This endpoint must be a public non-pruned archive node
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * You can get them from OnFinality for free https://app.onfinality.io
     * https://documentation.onfinality.io/support/the-enhanced-api-service
     */
    endpoint: ['$NETWORK_ENDPOINT'],
    dictionary: '$NETWORK_DICTIONARY',
    chaintypes: {
      file: './dist/chainTypes.js',
    },
  },
  dataSources: [
    {
      kind: SubstrateDatasourceKind.Runtime,
      startBlock: 1,
      endBlock: 1,
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: SubstrateHandlerKind.Event,
            handler: 'handleEvent',
          },
        ],
      },
    },
    {
      kind: SubstrateDatasourceKind.Runtime,
      startBlock: Number('$START_BLOCK'),
      mapping: {
        file: './dist/index.js',
        handlers,
      },
    },
  ],
};

// Must set default to the project instance
export default project;
