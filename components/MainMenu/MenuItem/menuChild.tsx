import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Grid, Link, Paper, Popover } from '@mui/material';
import { withStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
                    <Grid item key={menuC._id} md={3} sm={12} xs={12} style={{ maxWidth: "100%" }}>
                        <Link href={menuC.url} underline="none" style={mapItem[menuC._id]?.length > 0 ? { fontWeight: 600, color: "#000", paddingBottom: "10px" } : { fontSize: "12px", color: "#000" }}>{menuC.title}</Link>
                        <div>{mapItem[menuC._id]?.length > 0 && showMenu(mapItem, menuC)}</div>
                    </Grid>
                ))}
            </>
        )
    }

    const MenuPopover = withStyles((_) => ({
        paper: {
            minHeight: "unset",
            maxHeight: "unset",
            overflowX: "unset",
            overflowY: "unset"
        }
    }))(Popover);

    const MenuExpandContainer = withStyles((_) => ({
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