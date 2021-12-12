import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Grid, Paper, Popover, withStyles, createStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WebMenuItem } from '../../../sub_modules/share/model/webMenuItem';

const MenuChild = (props: { item: WebMenuItem, mapItem: { [itemId: string]: WebMenuItem[] } }) => {
    const { item, mapItem } = props;
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    }

    const showMenu = (mapMenu: { [itemId: string]: WebMenuItem[] }, item: WebMenuItem) => {
        return (
            <>
                {mapMenu[item._id].map((menuC) => (
                    <Grid item key={menuC._id} xs={4}>
                        {mapItem[menuC._id]?.length > 0 ? <span onClick={() => router.push(menuC.url)} style={{ fontWeight: 600}}>{menuC.title}</span> : <span onClick={() => router.push(menuC.url)} style={{ fontSize: "12px" }}>{menuC.title}</span>}  {/* Check menuItem cấp 2 */}
                        <div>{mapItem[menuC._id]?.length > 0 && showMenu(mapItem, menuC)}</div>
                    </Grid>
                ))}
            </>
        )
    }

    const MenuPopover = withStyles((_) => createStyles({
        paper: {
            minHeight: "unset",
            maxHeight: "unset",
            overflowX: "unset",
            overflowY: "unset"
        }
    }))(Popover);

    const MenuExpandContainer = withStyles((_) => createStyles({
        root: {
            minWidth: "768px",
            padding: "16px"
        }
    }))(Paper);

    return (
        <>
            <span onClick={() => router.push(item.url)}>{item.title}</span> <ExpandMoreIcon onClick={(event) => setAnchorEl(event.currentTarget)} />
            <MenuPopover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleClose}
            >
                <MenuExpandContainer>
                    <Grid container spacing={2}>
                        {showMenu(mapItem, item)}
                    </Grid>
                </MenuExpandContainer>
            </MenuPopover>
        </>
    )
}

export default MenuChild