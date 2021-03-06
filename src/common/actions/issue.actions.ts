import {
    CHANGE_ISSUE_STEP,
    CHANGE_BTC_ADDRESS,
    RESET_ISSUE_WIZARD,
    CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE,
    CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE,
    CHANGE_ISSUE_ID,
    CHANGE_BTC_TX_ID,
    CHANGE_AMOUNT_BTC,
    UPDATE_ISSUE_FEE,
    UPDATE_ISSUE_GRIEFING_COLLATERAL,
    ADD_ISSUE_REQUEST,
    UPDATE_ISSUE_REQUEST,
    ADD_TRANSACTION_LISTENER_ISSUE,
    ADD_VAULT_ISSUES,
    OPEN_WIZARD_IN_EDIT_MODE,
    UPDATE_ALL_ISSUE_REQUESTS,
    UpdateAllIssueRequests,
    ChangeIssueStep,
    ChangeBtcAddress,
    ResetIssueWizard,
    ChangeVaultBtcAddressOnIssue,
    ChangeVaultDotAddressOnIssue,
    ChangeIssueId,
    ChangeAmountBtc,
    ChangeBtcTxId,
    UpdateIssueFee,
    UpdateIssueGriefingCollateral,
    AddIssueRequest,
    UpdateIssueRequest,
    AddTransactionListenerIssue,
    OpenWizardInEditMode,
    AddVaultIssues,
} from "../types/actions.types";
import { IssueRequest, VaultIssue } from "../types/issue.types";

export const changeIssueStepAction = (step: string): ChangeIssueStep => ({
    type: CHANGE_ISSUE_STEP,
    step,
});

export const changeAmountBTCAction = (amount: string): ChangeAmountBtc => ({
    type: CHANGE_AMOUNT_BTC,
    amount,
});

export const updateIssueFeeAction = (fee: string): UpdateIssueFee => ({
    type: UPDATE_ISSUE_FEE,
    fee,
});

export const updateIssueGriefingCollateralAction = (griefingCollateral: string): UpdateIssueGriefingCollateral => ({
    type: UPDATE_ISSUE_GRIEFING_COLLATERAL,
    griefingCollateral,
});

export const changeBTCAddressAction = (btcAddress: string): ChangeBtcAddress => ({
    type: CHANGE_BTC_ADDRESS,
    btcAddress,
});

export const resetIssueWizardAction = (): ResetIssueWizard => ({
    type: RESET_ISSUE_WIZARD,
});

export const changeVaultBtcAddressOnIssueAction = (vaultBtcAddress: string): ChangeVaultBtcAddressOnIssue => ({
    type: CHANGE_VAULT_BTC_ADDRESS_ON_ISSUE,
    vaultBtcAddress,
});

export const changeVaultDotAddressOnIssueAction = (vaultDotAddress: string): ChangeVaultDotAddressOnIssue => ({
    type: CHANGE_VAULT_DOT_ADDRESS_ON_ISSUE,
    vaultDotAddress,
});

export const changeIssueIdAction = (id: string): ChangeIssueId => ({
    type: CHANGE_ISSUE_ID,
    id,
});

export const openWizardInEditModeAction = (): OpenWizardInEditMode => ({
    type: OPEN_WIZARD_IN_EDIT_MODE,
});

export const changeBtcTxIdAction = (btcTxId: string): ChangeBtcTxId => ({
    type: CHANGE_BTC_TX_ID,
    btcTxId,
});

export const addIssueRequestAction = (request: IssueRequest): AddIssueRequest => ({
    type: ADD_ISSUE_REQUEST,
    request,
});

export const updateIssueRequestAction = (request: IssueRequest): UpdateIssueRequest => ({
    type: UPDATE_ISSUE_REQUEST,
    request,
});

export const addTransactionListenerIssue = (id: string): AddTransactionListenerIssue => ({
    type: ADD_TRANSACTION_LISTENER_ISSUE,
    id,
});

export const addVaultIssuesAction = (vaultIssues: VaultIssue[]): AddVaultIssues => ({
    type: ADD_VAULT_ISSUES,
    vaultIssues,
});

export const updateAllIssueRequestsAction = (issueRequests: IssueRequest[]): UpdateAllIssueRequests => ({
    type: UPDATE_ALL_ISSUE_REQUESTS,
    issueRequests,
});
