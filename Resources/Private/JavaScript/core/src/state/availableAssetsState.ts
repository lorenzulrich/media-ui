import { atom, selector } from 'recoil';
import { Asset } from '../interfaces';

const availableAssetsState = atom<Asset[]>({
    key: 'AvailableAssetsState',
    default: [],
});

const availableAssetIdentitiesState = selector<AssetIdentity[]>({
    key: 'AvailableAssetIdentitiesState',
    get: ({ get }) => {
        return get(availableAssetsState).map((asset) => ({
            assetId: asset.id,
            assetSourceId: asset.assetSource.id,
        }));
    },
});

export { availableAssetsState, availableAssetIdentitiesState };
