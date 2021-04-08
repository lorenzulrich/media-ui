import * as React from 'react';
import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { AssetIdentity, MediaUiTheme } from '../../interfaces';
import { createUseMediaUiStyles, useIntl, useMediaUi } from '../../core';
import { AssetActions } from './index';
import { AssetLabel } from '../Presentation';
import { selectedAssetForPreviewState, selectedAssetIdState } from '../../state';
import { useAssetQuery, useSelectAsset } from '../../hooks';

const useStyles = createUseMediaUiStyles((theme: MediaUiTheme) => ({
    thumbnail: {
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover $caption': {
            backgroundColor: theme.colors.primary,
        },
        '&:hover $toolBar': {
            display: 'flex',
        },
    },
    picture: {
        cursor: 'pointer',
        backgroundColor: theme.colors.assetBackground,
        '& img': {
            display: 'block',
            height: '250px',
            width: '100%',
            objectFit: 'contain',
        },
    },
    caption: {
        backgroundColor: theme.colors.captionBackground,
        transition: `background-color ${theme.transition.fast}`,
        padding: theme.spacing.half,
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        '& img': {
            width: '1.3rem',
            height: 'auto',
            marginRight: theme.spacing.half,
        },
    },
    selected: {
        backgroundColor: theme.colors.primary,
    },
    toolBar: {
        display: 'none',
        position: 'absolute',
        top: theme.spacing.quarter,
        right: theme.spacing.quarter,
        backgroundColor: 'rgba(0.15, 0.15, 0.15, 0.25)',
    },
    label: {
        position: 'absolute',
        top: theme.spacing.quarter,
        left: theme.spacing.quarter,
        fontSize: theme.fontSize.small,
        borderRadius: '3px',
        padding: '2px 4px',
        backgroundColor: theme.colors.primary,
        userSelect: 'none',
    },
}));

interface ThumbnailProps {
    assetIdentity: AssetIdentity;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ assetIdentity }: ThumbnailProps) => {
    const classes = useStyles();
    const { translate } = useIntl();
    const { dummyImage } = useMediaUi();
    const { asset } = useAssetQuery(assetIdentity);
    const selectedAssetId = useRecoilValue(selectedAssetIdState);
    const setSelectedAssetForPreview = useSetRecoilState(selectedAssetForPreviewState);
    const isSelected = selectedAssetId?.assetId === assetIdentity.assetId;
    const selectAsset = useSelectAsset();

    const onSelect = useCallback(() => {
        if (isSelected) {
            setSelectedAssetForPreview(asset);
        } else {
            selectAsset(asset);
        }
    }, [isSelected, setSelectedAssetForPreview, selectAsset, asset]);

    return (
        <figure className={classes.thumbnail}>
            {asset?.imported && <span className={classes.label}>{translate('asset.label.imported', 'Imported')}</span>}
            <picture onClick={onSelect} className={classes.picture}>
                <img src={asset?.thumbnailUrl || dummyImage} alt={asset?.label} />
            </picture>
            <figcaption className={[classes.caption, isSelected ? classes.selected : ''].join(' ')}>
                {asset && (
                    <>
                        <img src={asset.file.typeIcon.url} alt={asset.file.typeIcon.alt} />
                        <AssetLabel label={asset.label} />
                    </>
                )}
            </figcaption>
            {asset && (
                <div className={classes.toolBar}>
                    <AssetActions asset={asset} />
                </div>
            )}
        </figure>
    );
};

export default React.memo(Thumbnail, (prev, next) => prev.assetIdentity.assetId === next.assetIdentity.assetId);
