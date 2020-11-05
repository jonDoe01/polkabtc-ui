import React from "react";
import { Modal, Button } from "react-bootstrap";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { requestReplacmentPendingAction } from "../../../common/actions/vault.actions";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

type RequestReplacementForm = {
    amount: number;
}

type RequestReplacementProps = {
    onClose: () => void;
    show: boolean;
};

export default function RequestReplacementModal(props: RequestReplacementProps){
    const { register, handleSubmit, errors } = useForm<RequestReplacementForm>();
    const dispatch = useDispatch();
    const isPending = useSelector((state: StoreType) => state.vault.isReplacmentPending);
    const lockedDot = useSelector((state: StoreType) => state.vault.collateral);
    const lockedBtc = useSelector((state: StoreType) => state.vault.lockedBTC);
    
    const onSubmit = handleSubmit(async ({ amount }) => {
        try {
            dispatch(requestReplacmentPendingAction(true));
            await window.vaultClient.requestReplace(amount,100);
            toast.success("Replacment request is submitted");
            props.onClose();
            dispatch(requestReplacmentPendingAction(false));
        } catch (error) {
            toast.error(error.toString());
        }
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Replacement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12 request-header">
                            You are requesting that your vault is replaced by other vaults in the system. 
                            If this is successful, you can withdraw your collateral.
                        </div>
                        <div className="col-12">
                            Your currently have:
                        </div>
                        <div className="col-12">
                            Locked: {lockedDot} DOT
                        </div>
                        <div className="col-12 vault-empty-space">
                            Locked: {lockedBtc} BTC
                        </div>
                        <div className="col-12 vault-empty-space">
                            Replace amount
                        </div>
                        <div className="col-12">
                            <div className="input-group">
                                <input
                                    name="amount"
                                    type="number"
                                    className={"form-control custom-input" + (errors.amount ? " error-borders" : "")}
                                    aria-describedby="basic-addon2" 
                                    ref={register({
                                        required: true,
                                    })}
                                ></input>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">PolkaBTC</span>
                                </div>
                                {errors.amount && (
                                    <div className="input-error">
                                        {errors.amount.type === "required" ? 
                                        "Amount is required" : errors.amount.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending
                        variant="outline-danger" 
                        type="submit"
                        isPending={isPending}
                        >
                        Request
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}