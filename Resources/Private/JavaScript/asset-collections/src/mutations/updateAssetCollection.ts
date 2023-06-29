import { gql } from '@apollo/client';

export const UPDATE_ASSET_COLLECTION = gql`
    mutation UpdateAssetCollection($id: AssetCollectionId!, $title: String, $tagIds: [TagId]) {
        updateAssetCollection(id: $id, title: $title, tagIds: $tagIds)
    }
`;
