export interface IssueRequest {
    id: string;
    amountBTC: string;
    creation: string;
    vaultBTCAddress: string;
    btcTxId: string;
    confirmations: number;
    completed: boolean;
    cancelled: boolean;
    merkleProof?: string;
    transactionBlockHeight?: number;
    rawTransaction?: Uint8Array;
    fee: string;
    griefingCollateral: string;
}

export interface IssueMap {
    [key: string]: IssueRequest[];
}

export interface VaultIssue {
    id: string;
    timestamp: string;
    user: string;
    btcAddress: string;
    polkaBTC: string;
    lockedDOT: string;
    status: string;
    completed: boolean;
    cancelled: boolean;
}

export interface IssueState {
    address: string;
    step: string;
    amountBTC: string;
    fee: string;
    griefingCollateral: string;
    vaultDotAddress: string;
    vaultBtcAddress: string;
    id: string;
    btcTxId: string;
    issueRequests: Map<string, IssueRequest[]>;
    transactionListeners: string[];
    wizardInEditMode: boolean;
    vaultIssues: VaultIssue[];
}
