import Ipfs from 'ipfs';
import createSecret from './secret';
import createStorage from './storage';
import createLocker from './locker';
import createIdentities from './identities';
import createDidm from './didm';
import { keychainPass } from './utils/constants';
import { UnavailableIpfsError } from './utils/errors';

const createIpfs = (ipfs) => {
    if (ipfs) {
        if (!ipfs.isOnline || !ipfs.isOnline()) {
            throw new UnavailableIpfsError();
        }

        return ipfs;
    }

    return new Promise((resolve, reject) => {
        const node = new Ipfs({ pass: keychainPass });

        node.on('ready', () => resolve(node));
        node.on('error', (err) => reject(err));
    });
};

const createWallet = async (options) => {
    const { ipfs } = { ...options };

    const ipfsNode = await createIpfs(ipfs);

    const secret = createSecret();

    const didm = createDidm(ipfsNode);
    const storage = await createStorage(secret);
    const locker = await createLocker(storage, secret);
    const identities = createIdentities(storage, didm);

    return {
        didm,
        storage,
        locker,
        identities,
    };
};

export default createWallet;
