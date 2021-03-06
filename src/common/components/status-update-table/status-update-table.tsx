import React, { ReactElement, useEffect, useState } from "react";
import { StoreType } from "../../types/util.types";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import VoteModal from "../../../pages/staked-relayer/vote-modal/vote-modal";
import { StatusUpdate } from "../../types/util.types";
import MessageModal from "../../../pages/staked-relayer/message-modal/message-modal";
import BN from "bn.js";
import BitcoinBlockHash from "../bitcoin-links/block-hash";
import { reverseHashEndianness } from "../../utils/utils";
import * as constants from "../../../constants";
import { useTranslation } from 'react-i18next';


const ADD_DATA_ERROR = "Add NO_DATA error";
const REMOVE_DATA_ERROR = "Remove NO_DATA error";

interface Option<T> {
    isNone: boolean;
    unwrap(): T;
}

interface ErrorCode {
    toString(): string;
}

function displayBlockHash(option: Option<Uint8Array>): string {
    return option.isNone ? "None" : reverseHashEndianness(option.unwrap());
}

function displayProposedChanges(addError: Option<ErrorCode>, removeError: Option<ErrorCode>): string {
    return addError.isNone
        ? removeError.isNone
            ? "-"
            : removeError.unwrap().toString()
        : addError.unwrap().toString();
}

type StatusUpdateTableProps = {
    dotLocked: string;
    planckLocked?: string;
    stakedRelayerAddress?: string;
    readOnly?: boolean;
};

export default function StatusUpdateTable(props: StatusUpdateTableProps): ReactElement {
    const [parachainStatus, setStatus] = useState("Running");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const [statusUpdates, setStatusUpdates] = useState<Array<StatusUpdate>>([]);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const handleClose = () => {
        setShowVoteModal(false);
        setShowMessageModal(false);
    };
    const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>();
    const { t } = useTranslation();


    useEffect(() => {
        const fetchStatus = async () => {
            if (!polkaBtcLoaded) return;

            const result = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
            setStatus(result.isRunning ? "Running" : result.isError ? "Error" : "Shutdown");
        };

        const fetchUpdates = async () => {
            if (!polkaBtcLoaded) return;

            const statusUpdates = await (props.readOnly
                ? window.polkaBTC.stakedRelayer.getAllActiveStatusUpdates()
                : window.polkaBTC.stakedRelayer.getAllStatusUpdates());

            // sort in descending order by id (newest shown first)
            statusUpdates.sort((right, left) => {
                return left.id.eq(right.id) ? 0 : left.id.gt(right.id) ? 1 : -1;
            });

            setStatusUpdates(
                statusUpdates.map((status) => {
                    const { id, statusUpdate } = status;
                    let hasVoted = false;

                    // NOTE: passing the `AccountId` in props cases a weird infinite reload bug,
                    // so we pass the address obtained from the staked relayer client and reconstruct
                    if (props.stakedRelayerAddress) {
                        const stakedRelayerId = window.polkaBTC.api.createType("AccountId", props.stakedRelayerAddress);

                        // FIXME: Set.has() doesn't work for objects
                        statusUpdate.tally.aye.forEach((acc) => {
                            hasVoted = acc.hash.toHex() === stakedRelayerId.hash.toHex() ? true : hasVoted;
                        });
                        statusUpdate.tally.nay.forEach((acc) => {
                            hasVoted = acc.hash.toHex() === stakedRelayerId.hash.toHex() ? true : hasVoted;
                        });
                    }

                    return {
                        id,
                        timestamp: statusUpdate.end.toString(),
                        proposedStatus: statusUpdate.new_status_code.toString(),
                        currentStatus: statusUpdate.old_status_code.toString(),
                        proposedChanges: displayProposedChanges(statusUpdate.add_error, statusUpdate.remove_error),
                        blockHash: displayBlockHash(statusUpdate.btc_block_hash),
                        votes: `${statusUpdate.tally.aye.size} : ${statusUpdate.tally.nay.size}`,
                        result: statusUpdate.proposal_status.toString(),
                        proposer: statusUpdate.proposer.toString(),
                        message: statusUpdate.message.toString(),
                        hasVoted,
                    };
                })
            );
        };

        fetchStatus();
        fetchUpdates();
        const interval = setInterval(() => {
            fetchStatus();
            fetchUpdates();
        }, constants.COMPONENT_UPDATE_MS);
        return () => clearInterval(interval);
    }, [polkaBtcLoaded, props.stakedRelayerAddress, props.readOnly]);

    const openVoteModal = (statusUpdate: StatusUpdate) => {
        setShowVoteModal(true);
        setStatusUpdate(statusUpdate);
    };

    const openMessageModal = (statusUpdate: StatusUpdate) => {
        setShowMessageModal(true);
        setStatusUpdate(statusUpdate);
    };

    const getResultColor = (result: string): string => {
        switch (result) {
            case "Accepted":
                return "green-text";
            case "Rejected":
                return "red-text";
            default:
                return "";
        }
    };

    const getCircle = (status: string): string => {
        switch (status) {
            case "Running":
                return "green-circle";
            case "Error":
                return "yellow-circle";
            default:
                return "red-circle";
        }
    };

    const getProposedChangesColor = (changes: string): string => {
        switch (changes) {
            case ADD_DATA_ERROR:
                return "orange-text";
            case REMOVE_DATA_ERROR:
                return "green-text";
            default:
                return "red-text";
        }
    };

    const getPercentage = (votes: string, type: string): number => {
        const yes = Number(votes.split(":")[0]);
        const no = Number(votes.split(":")[1]);
        const total = yes + no;
        if (type === "yes") {
            return Number((yes / (total / 100)).toFixed(1));
        }
        return Number((no / (total / 100)).toFixed(1));
    };

    return (
        <div className="btc-parachain-table">
            <VoteModal
                show={showVoteModal}
                onClose={handleClose}
                statusUpdate={statusUpdate!}
                getColor={getProposedChangesColor}
            ></VoteModal>
            <MessageModal show={showMessageModal} onClose={handleClose} statusUpdate={statusUpdate!}></MessageModal>
            <div className="row">
                <div className="col-12">
                    <div className="header">
                        {t("btc_parachain_status")}: &nbsp; <div className={getCircle(parachainStatus)}></div> &nbsp;{" "}
                        {parachainStatus}
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t("id")}</th>
                                    <th>{t("expiration")}</th>
                                    <th>{t("proposed_status")}</th>
                                    <th>{t("current_status")}</th>
                                    <th>{t("proposed_changes")}</th>
                                    <th>{t("btc_block_hash")}</th>
                                    <th>{t("votes_yes_no")}</th>
                                    <th>{t("result")}</th>
                                </tr>
                            </thead>
                            {statusUpdates && statusUpdates.length ? (
                                <tbody>
                                    {statusUpdates.map((statusUpdate, index) => {
                                        return (
                                            <tr key={index}>
                                                <td
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => openMessageModal(statusUpdate)}
                                                >
                                                    {statusUpdate.id.toString()}
                                                </td>
                                                <td>{statusUpdate.timestamp}</td>
                                                <td
                                                    className={
                                                        statusUpdate.proposedStatus === "Running"
                                                            ? "green-text"
                                                            : "orange-text"
                                                    }
                                                >
                                                    {statusUpdate.proposedStatus}
                                                </td>
                                                <td>{statusUpdate.currentStatus}</td>
                                                <td className={getProposedChangesColor(statusUpdate.proposedChanges)}>
                                                    {statusUpdate.proposedChanges}
                                                </td>
                                                <td className="break-words">
                                                    <BitcoinBlockHash blockHash={statusUpdate.blockHash} />
                                                </td>
                                                <td>
                                                    {" "}
                                                    {statusUpdate.votes && (
                                                        <React.Fragment>
                                                            <p>
                                                                <span className="green-text">
                                                                    {getPercentage(statusUpdate.votes, "yes")}%
                                                                </span>
                                                                <span>&nbsp;:&nbsp;</span>
                                                                <span className="red-text">
                                                                    {getPercentage(statusUpdate.votes, "no")}%
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <span className="green-text">
                                                                    {statusUpdate.votes.split(":")[0]}
                                                                </span>
                                                                <span>:</span>
                                                                <span className="red-text">
                                                                    {statusUpdate.votes.split(":")[1]}
                                                                </span>
                                                            </p>
                                                        </React.Fragment>
                                                    )}
                                                </td>
                                                <td className={getResultColor(statusUpdate.result)}>
                                                    {!props.readOnly ? (
                                                        props.planckLocked !== undefined &&
                                                        new BN(props.planckLocked) > new BN(0) &&
                                                        !statusUpdate.hasVoted &&
                                                        statusUpdate.result === "Pending" ? (
                                                            <Button
                                                                variant="outline-primary"
                                                                onClick={() => openVoteModal(statusUpdate)}
                                                            >
                                                                {t("vote")}
                                                            </Button>
                                                        ) : (
                                                            statusUpdate.result
                                                        )
                                                    ) : (
                                                        "Pending"
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={8}>
                                            {t("no_pending_status")}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
