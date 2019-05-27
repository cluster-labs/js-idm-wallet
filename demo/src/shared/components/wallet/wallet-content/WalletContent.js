import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Timer from '../../timer/Timer';

import './WalletContent.css';

class WalletContent extends Component {
    componentDidMount() {
        const { wallet } = this.props;

        wallet.identities.load();
    }

    render() {
        const { wallet: { locker } } = this.props;

        return (
            <div className="WalletContent">
                <div className="leftBar">
                </div>
                <div className="container">
                    <div className="top">
                        <Timer className="timer" locker={ locker } />
                    </div>
                    <div className="bottom">
                        <div className="section">
                            <h4>Locker</h4>
                            <div className="content">
                                <div className="option">
                                    <span>Lock Locker</span>
                                    <button onClick={ this.handleLockLocker }>Lock</button>
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <h4>Timer</h4>
                            <div className="content">
                                <div className="option">
                                    <span>Restart</span>
                                    <button onClick={ this.handleRestartTimer }>Restart</button>
                                </div>
                                <div className="option">
                                    <span>Set MaxTime</span>
                                    <input
                                        type="number"
                                        onChange={ this.handleMaxTimeInputChange } />
                                    <button onClick={ this.handleMaxTimeInputSubmit }>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <h4>Identities</h4>
                            <div className="content">
                                <div className="option">
                                    <span>List</span>
                                    <button onClick={ this.handleList }>List</button>
                                </div>
                                <div className="option">
                                    <span>Create</span>
                                    <button onClick={ this.handleCreate }>Create</button>
                                </div>
                                <div className="option">
                                    <span>Peek</span>
                                    <input
                                        type="text"
                                        placeholder="mnemonic"
                                        onChange={ this.handlePeekInputChange } />
                                    <button onClick={ this.handlePeekSubmit }>Submit</button>
                                </div>
                                <div className="option">
                                    <span>Import</span>
                                    <input
                                        type="text"
                                        placeholder="mnemonic"
                                        onChange={ this.handleImportInputChange } />
                                    <button onClick={ this.handleImportSubmit }>Submit</button>
                                </div>
                                <div className="option">
                                    <span>Remove</span>
                                    <input
                                        type="text"
                                        placeholder="id"
                                        onChange={ this.handleRemoveIdChange } />
                                    <input
                                        type="text"
                                        placeholder="mnemonic"
                                        onChange={ this.handleRemoveMnemonicChange } />
                                    <button onClick={ this.handleRemoveSubmit }>Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleLockLocker = () => {
        const { wallet: { locker } } = this.props;

        locker.lock();
    };

    handleRestartTimer = () => {
        const { wallet: { locker } } = this.props;

        locker.idleTimer.restart();
    };

    handleMaxTimeInputChange = (event) => {
        this.maxInputTime = event.target.value;
    };

    handleMaxTimeInputSubmit = () => {
        const { wallet: { locker } } = this.props;

        if (this.maxInputTime > 0) {
            locker.idleTimer.setMaxTime(this.maxInputTime * 60 * 1000);
        }
    };

    // IDENTITIES ------------------------------------

    handleList = () => {
        const { wallet } = this.props;

        try {
            const identities = wallet.identities.list();

            console.log('List Identities:');
            identities.forEach((identity) => {
                console.log('Identity:', identity);
                console.log('Serialized:', {
                    addedAt: identity.getAddedAt(),
                    id: identity.getId(),
                    did: identity.getDid(),
                    devices: identity.devices.list(),
                    backup: identity.backup.getData(),
                    profile: identity.profile.getDetails(),
                });
                console.log(' ');
            });
            console.log('Final List Identities.');
        } catch (err) {
            console.error(err);
        }
    };

    handleCreate = () => {
        const { wallet } = this.props;

        wallet.identities.create('ipid', {
            profileDetails: {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'John Doe',
            },
            deviceInfo: {
                type: 'laptop',
                name: 'MacBook Pro'
            },
        })
        .then((identity) => {
            console.log('Created Identity:')
            console.log('Identity:', identity);
            console.log('Serialized:', {
                addedAt: identity.getAddedAt(),
                id: identity.getId(),
                did: identity.getDid(),
                devices: identity.devices.list(),
                backup: identity.backup.getData(),
                profile: identity.profile.getDetails(),
            });
            console.log(' ');
            console.log('End of Created Identity.')
        });
    };

    handleImportInputChange = (event) => {
        this.importValue = event.target.value;
    };

    handleImportSubmit = () => {
        const { wallet } = this.props;

        wallet.identities.import('ipid', {
            mnemonic: this.importValue,
            deviceInfo: {
                type: 'laptop',
                name: 'MacBook Pro'
            },
        })
        .then((result) => console.log('Imported Identity:', result))
    };

    handlePeekInputChange = (event) => {
        this.peekValue = event.target.value;
    };

    handlePeekSubmit = () => {
        const { wallet } = this.props;

        wallet.identities.peek('ipid', {
            mnemonic: this.peekValue,
        })
        .then((result) => console.log('Peek Resolved:', result));
    };

    handleRemoveIdChange = (event) => {
        this.removeIdValue = event.target.value;
    };

    handleRemoveMnemonicChange = (event) => {
        this.removeMnemonicValue = event.target.value;
    };

    handleRemoveSubmit = () => {
        const { wallet } = this.props;

        wallet.identities.remove(this.removeIdValue, {
            mnemonic: this.removeMnemonicValue,
        })
        .then(() => console.log('Removed Successfully!'));
    };

    // -----------------------------------------------
}

WalletContent.propTypes = {
    wallet: PropTypes.object.isRequired,
};

export default WalletContent;
