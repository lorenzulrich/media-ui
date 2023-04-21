import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import AssetCollection from '../interfaces/AssetCollection';
import { SET_ASSET_COLLECTION_PARENT } from '../mutations/setAssetCollectionParent';

interface SetAssetCollectionParentProps {
    assetCollection: AssetCollection;
    parent: AssetCollection | null;
}

interface SetAssetCollectionParentVariables {
    id: string;
    parent?: string;
}

export function useSetAssetCollectionParent() {
    const [action, { error, data, loading }] = useMutation<boolean, SetAssetCollectionParentVariables>(
        SET_ASSET_COLLECTION_PARENT
    );

    const setAssetCollectionParent = useCallback(
        ({ assetCollection, parent }: SetAssetCollectionParentProps) =>
            action({
                variables: {
                    id: assetCollection.id,
                    parent: parent?.id,
                },
                // refetchQueries: [{ query: ASSET_COLLECTION, variables: { id: parent?.id } }],
                optimisticResponse: true,
                update: (cache, { data }) => {
                    if (!data) return;
                    cache.modify({
                        id: cache.identify({
                            __typename: 'AssetCollection',
                            id: assetCollection.id,
                        }),
                        broadcast: false,
                        fields: {
                            parent: () =>
                                parent
                                    ? {
                                          __ref: cache.identify({
                                              __typename: 'AssetCollection',
                                              id: parent.id,
                                          }),
                                      }
                                    : null,
                        },
                    });
                },
            }),
        [action]
    );

    return { setAssetCollectionParent, data, error, loading };
}
